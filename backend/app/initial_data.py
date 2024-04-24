import logging

from sqlmodel import Session

from app.core.db import engine, init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    """
    This method initiates a session with the database using the global engine. 
    Within this session, the database is then initialized through the 'init_db' method.
    
    The function doesn't return any value. It's primarily used for setting up 
    the database connection and preparing the database for use.

    Args:
        None

    Returns:
        None
    """
    with Session(engine) as session:
        init_db(session)


def main() -> None:
    """
    This is the main execution method for the script.

    It starts by logging a message about the creation of initial data.
    Then, it calls the `init` function to generate that data. 
    Once the data is successfully created, it logs another message to indicate the completion 
    of the data creation process.

    Returns:
        None
    """
    logger.info("Creating initial data")
    init()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
