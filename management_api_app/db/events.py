import logging

from azure.cosmos import CosmosClient
from fastapi import FastAPI

from core import config


async def connect_to_db(app: FastAPI) -> None:
    logging.debug(f"Connecting to {config.STATE_STORE_ENDPOINT}")

    try:
        cosmos_client = CosmosClient(config.STATE_STORE_ENDPOINT, config.STATE_STORE_KEY)
        app.state.cosmos_client = cosmos_client
        logging.debug("Connection established")
    except Exception as e:
        logging.debug(f"Connection to state store could not be established: {e}")


async def bootstrap_database(app: FastAPI) -> None:
    client = app.state.cosmos_client
    if client:
        client.create_database_if_not_exists(id=config.STATE_STORE_DATABASE)