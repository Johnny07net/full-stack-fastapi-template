import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import emails  # type: ignore
from jinja2 import Template
from jose import JWTError, jwt

from app.core.config import settings


@dataclass
class EmailData:
    html_content: str
    subject: str


def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    """
    Renders an email template with a given context.

    This method reads a template file from the 'email-templates/build' directory relative to the current file. 
    It then uses the Jinja2 Template to render this template with the provided context.

    Args:
        template_name (str): The name of the template file. This should include any file extension e.g. 'example.html'.
        context (dict[str, Any]): A dictionary representing the context for rendering the template. 
            Each key-value pair in the context represents a variable that can be used in the template.

    Returns:
        str: The rendered email template.

    Raises:
        FileNotFoundError: If the specified template file does not exist.
        jinja2.exceptions.TemplateError: If there is an error in rendering the template.
    """
    template_str = (
        Path(__file__).parent / "email-templates" / "build" / template_name
    ).read_text()
    html_content = Template(template_str).render(context)
    return html_content


def send_email(
    *,
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> None:
    """
    This function sends an email to a specified recipient. 

    The function checks settings to verify that email sending is enabled and configured correctly. 
    If it is, the function constructs the email message, including subject and html content, and sets up 
    SMTP options based on settings. If SMTP requires TLS or SSL, these are configured as well. 

    If SMTP username and password are provided in settings, these are also included in the SMTP options. 
    The email is then sent to the recipient, and the result of the send operation is logged.

    Parameters:
    email_to (str): The recipient's email address.
    subject (str, optional): The subject line of the email. Defaults to an empty string.
    html_content (str, optional): The body of the email in HTML format. Defaults to an empty string.

    Returns:
    None
    """
    assert settings.emails_enabled, "no provided configuration for email variables"
    message = emails.Message(
        subject=subject,
        html=html_content,
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    elif settings.SMTP_SSL:
        smtp_options["ssl"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    response = message.send(to=email_to, smtp=smtp_options)
    logging.info(f"send email result: {response}")


def generate_test_email(email_to: str) -> EmailData:
    """
    This method generates a test email with customised content.

    The method uses the template named "test_email.html" that is presumably stored in a 
    designated templates folder. The email content is rendered by inserting the given 
    project name and the recipient's email address into the template.

    The subject of the email is created by concatenating the project name with the string 
    " - Test email". The final email is represented as an instance of the EmailData class, 
    with the rendered HTML content and the subject as arguments.

    Parameters:
    email_to (str): The recipient's email address.

    Returns:
    EmailData: An instance of the EmailData class representing the final email. The instance 
    has two properties: html_content (str) representing the body of the email, and subject 
    (str) representing the email's subject.
    """
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Test email"
    html_content = render_email_template(
        template_name="test_email.html",
        context={"project_name": settings.PROJECT_NAME, "email": email_to},
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_reset_password_email(email_to: str, email: str, token: str) -> EmailData:
    """
    This method generates an email with a link to reset password for a user. It uses pre-defined settings for 
    the project name, the server host, and the life span of the email reset token.

    Args:
        email_to (str): The recipient's email address where the reset password email will be sent.
        email (str): The email address of the user who wants to reset their password.
        token (str): The unique reset token associated with the user's request.

    Returns:
        EmailData: An object containing the HTML content and the subject of the email.
            
    The email includes a link to reset the password. This link is composed with the server host and the unique 
    reset token. The link is valid for a certain number of hours defined in the settings. The email subject includes 
    the project name and the user's email address.
    """
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery for user {email}"
    link = f"{settings.server_host}/reset-password?token={token}"
    html_content = render_email_template(
        template_name="reset_password.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": email,
            "email": email_to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": link,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_new_account_email(
    email_to: str, username: str, password: str
) -> EmailData:
    """
    Generate an email to be sent to a new user when an account is created.

    This function generates the content for a new account email, including the subject and HTML content.
    The email includes the username, password and a link to the server host. The email content is rendered
    using a template named "new_account.html".

    Args:
        email_to (str): The email address of the user.
        username (str): The username of the new user.
        password (str): The password of the new user.

    Returns:
        EmailData: A namedtuple with the HTML content and subject of the email.
    """
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New account for user {username}"
    html_content = render_email_template(
        template_name="new_account.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": username,
            "password": password,
            "email": email_to,
            "link": settings.server_host,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_password_reset_token(email: str) -> str:
    """
    Generates a unique password reset token for a given email.

    This function generates a JWT (JSON Web Token) which includes the 
    expiry time, the time before which the token may not be accepted 
    and the subject claim which is the user's email. The token expiration 
    is set based on EMAIL_RESET_TOKEN_EXPIRE_HOURS setting.

    The JWT is encoded using HS256 (HMAC with SHA-256) algorithm.

    Args:
        email (str): The email address for which to generate the password reset token.

    Returns:
        str: The encoded JWT token.

    """
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm="HS256",
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> str | None:
    """
    Verifies the validity of a password reset token.

    This method attempts to decode a JWT token using the app's secret key. 
    If the token is successfully decoded, it returns the subject of the token
    as a string. This is expected to be the user's ID. If the token cannot be decoded 
    (likely because it is invalid or has expired), the method returns None.

    Args:
        token (str): The JWT token to be decoded. 

    Returns:
        str: The user's ID as a string if the token is valid.
        None: If the token is invalid or expired. 

    Raises:
        JWTError: If there's an error during token decoding. 
    """
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return str(decoded_token["sub"])
    except JWTError:
        return None
