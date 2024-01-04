import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

export interface HttpExceptionResponse {
    statusCode: string,
    message: string,
    error: string
}

export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }
    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        console.log("Exception :: => ", exception);

        const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : String(exception);

        const responseBody = {
            statusCode: httpStatus,
            timeStamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getResponse()),
            message:
                (exceptionResponse as HttpExceptionResponse).message ||
                (exceptionResponse as HttpExceptionResponse).error ||
                exceptionResponse ||
                "Something went wrong",
            errorResponse: (exceptionResponse as HttpExceptionResponse)
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
    
}