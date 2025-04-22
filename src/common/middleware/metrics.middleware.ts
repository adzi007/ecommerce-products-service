import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as client from 'prom-client';

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5] // adjust based on your app
});

// Collect default system metrics (only once!)
client.collectDefaultMetrics();

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      end({
        method: req.method,
        route: req.route?.path || req.path, // fallback to raw path
        status_code: res.statusCode,
      });
    });
    next();
  }
}
