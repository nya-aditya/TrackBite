import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users';
import telemetryRouter from './routes/telemetry';
import mealsRouter from './routes/meals';
import planRouter from './routes/plan';
import activitiesRouter from './routes/activities';
import { prisma } from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Global Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'TrackBite Adaptive Telemetry API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/users', usersRouter);
app.use('/api/telemetry', telemetryRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/plan', planRouter);
app.use('/api/activities', activitiesRouter);

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]:', err.message);
  res.status(500).json({
    error: 'InternalServerError',
    message: err.message || 'An unexpected error occurred',
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 TrackBite Backend API listening at http://localhost:${PORT}`);
  console.log(`⚡ Connected to PostgreSQL via Prisma singleton`);
});

// Graceful Shutdown
const shutdown = async () => {
  console.log('Shutting down server...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Database disconnected. Process terminating.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
