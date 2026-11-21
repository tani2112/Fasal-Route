"""
Main FastAPI Application Entrypoint for FasalRoute.
"""

from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from .alerts.scheduler import scheduler

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fasalroute")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start price alert background scheduler
    logger.info("Starting FasalRoute APScheduler...")
    scheduler.start()
    yield
    # Shutdown: Stop scheduler
    logger.info("Stopping FasalRoute APScheduler...")
    scheduler.shutdown(wait=False)

app = FastAPI(
    title="FasalRoute API",
    description="Voice-First, Offline-Ready AI Decision Co-Pilot for Farmers. Powered by Sarvam AI.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
