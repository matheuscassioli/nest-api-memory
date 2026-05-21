import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',      
      password: 'senha_dificil', 
      database: 'meu_projeto',     
      autoLoadEntities: true,     
      synchronize: true,          
    }),
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}