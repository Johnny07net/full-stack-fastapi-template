from typing import Any

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate


def create_user(*, session: Session, user_create: UserCreate) -> User:
    """
    This method is used to create a new user in the database. 

    It first validates the data from the 'user_create' object using the 'model_validate' method of 'User' class.
    This object must include a 'password' attribute, which will be hashed before being added to the database for security purposes. 

    Then, it adds the created object to the session (which represents the transaction). It commits the transaction to the database to save the changes permanently. 

    The method also refreshes the session to synchronize it with the current database status.

    Finally, it returns the created 'User' object with all attributes which were added to the database.

    Parameters:
    session (Session): The session in which the User is to be created.
    user_create (UserCreate): The object containing the information of the user to be created.

    Returns:
    User: The created User object with information that was stored in the database.
    """
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    """
    Updates the details of an existing user in the database.

    This function takes a session, an existing user object, and a UserUpdate object that contains the new data.
    The session argument is an active database session that is used to commit the changes to the database. 
    The db_user argument is the existing user object that needs to be updated. 
    It should be an instance of the User class.
    The user_in argument is an instance of the UserUpdate class and contains the new data for the user.

    If the "password" field is included in the UserUpdate object, the password is hashed before it is saved to the database.

    After updating the user details, the session is committed and the updated User object is returned.

    Args:
        session (Session): An active database session.
        db_user (User): The existing user object that needs to be updated.
        user_in (UserUpdate): An object that contains the new user data.

    Returns:
        User: Returns the updated user object.
    """
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    """
    Fetches a User object from the database using the given email.

    Args:
        session (Session): The database connection session.
        email (str): The email of the user to be fetched.

    Returns:
        User | None: Returns the User object if found. If no user is found with the provided email, return None.
    """
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    """
    Authenticates a user based on the provided email and password.

    This method first retrieves the user details from the database using the provided email. If no user is found with 
    the given email, it returns None. If a user is found, it verifies the provided password with the stored hashed password.
    If the password is verified, it returns the user details; otherwise, it returns None.

    Args:
        session (Session): A Session object representing the database session to use for queries.
        email (str): The email address of the user to authenticate.
        password (str): The plaintext password provided by the user to use for authentication.

    Returns:
        User | None: If the user is found and the password is verified, it returns a User object. If the user is not
        found or the password is not verified, it returns None.
    """
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_item(*, session: Session, item_in: ItemCreate, owner_id: int) -> Item:
    """
    This method creates a new item in the database.

    It first validates the incoming item data (`item_in`) by using the `model_validate` method of the `Item` class.
    The `model_validate` method also updates the `owner_id` field of the item with the provided `owner_id`.

    After the validation and updation, it adds the new item to the current database session and then commits the session
    to save the changes in the database. It then refreshes the session to synchronize it with the current state of the database.

    Finally, it returns the newly created item.

    Args:
        session (Session): The database session in which the new item is to be created.
        item_in (ItemCreate): The data of the new item to be created.
        owner_id (int): The id of the owner of the new item.

    Returns:
        Item: The newly created item.
    """
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item
