import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from 'config';
import { AllExceptionFilter } from './httpExceptionFilter';


@Module({
  imports: [
    MongooseModule.forRoot(config.get('mongoDbUrl'), {
      useNewUrlParser: true,
      keepAlive: true,
      useUnifiedTopology: true,
      w: 1,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter
    }
  ],
})
export class AppModule {}
