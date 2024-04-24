from sqlmodel import Session, create_engine, select

from app import crud
from app.core.config import settings
from app.models import User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    """
    Initializes the database session. This method is responsible for setting up the initial state of the database. 

    Initially, it tries to fetch the first superuser from the database. If the superuser is not found, it creates a superuser account. 
    This superuser account is created with the email and password obtained from the environment settings.
    
    Note: Tables should be manually created with Alembic migrations. 
    However, if you choose not to use migrations, the tables can be created by un-commenting the lines of code provided. 
    It's important to mention that this function works because the models are already imported and registered from app.models.

    Parameters:
    session (Session): The session object representing the database connection. 

    Returns:
    None
    """
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # from app.core.engine import engine
    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.create_user(session=session, user_create=user_in)
