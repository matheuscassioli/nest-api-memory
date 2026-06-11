import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.logger.log(`${method} ${url} ${response.statusCode} - ${Date.now() - now}ms`);
      }),
      catchError(err => { 
        const delay = Date.now() - now;
        this.logger.error(`${method} ${url} ${err.status || 500} - ${delay}ms - Error: ${err.message}`);
        return throwError(() => err);  
      }),
    );
  }
}