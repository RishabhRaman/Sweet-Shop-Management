import express from 'express';
import cors from 'cors';
import { handleError } from './utils/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import sweetRoutes from './routes/sweetRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Sweet Shop API is running' });
});

// Root route - API information
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Sweet Shop Management API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      sweets: {
        getAll: 'GET /api/sweets',
        search: 'GET /api/sweets/search',
        getById: 'GET /api/sweets/:id',
        create: 'POST /api/sweets (requires JWT)',
        update: 'PUT /api/sweets/:id (requires JWT)',
        delete: 'DELETE /api/sweets/:id (requires JWT, ADMIN only)',
        purchase: 'POST /api/sweets/:id/purchase (requires JWT)',
        restock: 'POST /api/sweets/:id/restock (requires JWT, ADMIN only)'
      }
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(handleError);

export default app;

