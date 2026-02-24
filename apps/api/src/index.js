import express from 'express';
import pino from 'pino';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,'..', '..',"client","dist")));

// Configurar logger con formato legible para desarrollo
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
      singleLine: false,
    }
  },
  level: process.env.LOG_LEVEL || 'info'
});

// Morgan para logging de peticiones HTTP
// Formato 'dev' en desarrollo, 'combined' en producción
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Middleware para parsing de JSON
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  logger.info('Accediendo a ruta principal');
  res.send('Hello, World!');
});

app.get('/api/health', (req, res) => {
  logger.debug('Health check solicitado');
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
app.get('/api', (req, res) => {
  logger.debug('Version check solicitado');
  res.json({
    version: '1.0.0',
    buildDate: '2024-06-01T00:00:00Z'
  });
});
// Manejo de rutas no encontradas
app.use((req, res) => {
  logger.warn({ method: req.method, url: req.url }, 'Ruta no encontrada');
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip
  }, 'Error en el servidor');

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  logger.info({
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    time: new Date().toISOString()
  }, `🚀 Servidor iniciado correctamente`);
  logger.info(`📍 Servidor disponible en: http://localhost:${PORT}`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Manejo graceful de shutdown
const gracefulShutdown = (signal) => {
  logger.info({ signal }, `⚠️  Recibida señal ${signal}, cerrando servidor...`);

  server.close(() => {
    logger.info('✅ Servidor cerrado correctamente');
    process.exit(0);
  });

  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    logger.error('❌ Timeout: forzando cierre del servidor');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  logger.error({ error: err.message, stack: err.stack }, '💥 Excepción no capturada');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, '💥 Promesa rechazada no manejada');
});
