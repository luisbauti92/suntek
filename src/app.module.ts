import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from './modules/user/user.module';
import { LoginController } from './modules/login/login.controller';
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
       	uri: config.get<string>('DATABASE_URI')
      })
    }),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController, LoginController],
  providers: [AppService],
})
export class AppModule {}
