from datetime import datetime, timedelta
from typing import Any

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


ALGORITHM = "HS256"


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    """
    Creates a JSON Web Token (JWT) for a given subject with a specific expiration time.
    
    This function encodes the subject and the expiration time into a JWT using the 
    application's secret key and a specified algorithm. The JWT can later be used for 
    user authentication and session management.

    Parameters:
    subject (str | Any): The subject to be encoded in the JWT. Usually, this is the identifier
                         of the user for whom the token is created.
    expires_delta (timedelta): The duration for which the JWT is valid. This value is added 
                               to the current UTC time to determine the expiration time 
                               ('exp') of the JWT.

    Returns:
    str: The encoded JWT as a string.
    """
    expire = datetime.utcnow() + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies if a plain text password matches a hashed password.
    
    This method uses the password context `pwd_context` to compare
    a plain text password with a hashed version. The `pwd_context`
    should have been previously set up and should use the same algorithm
    that was used to hash the password.
    
    Args:
        plain_password (str): The plain text password to verify.
        hashed_password (str): The hashed password to verify against.
        
    Returns:
        bool: True if the plain text password matches the hashed password, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    This method takes a password as a string and returns its hashed version. The hashing is done 
    using a password context object (pwd_context) which must be defined elsewhere in the code.
    
    Hashing a password is a security measure to prevent the original password from being known 
    if the data is compromised. The hashed password can be stored and used for comparison with user input 
    without the risk of revealing the original password.
    
    Args:
        password (str): The password to be hashed.

    Returns:
        str: The hashed version of the input password.
    """
    return pwd_context.hash(password)
