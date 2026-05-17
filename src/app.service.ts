import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello() {
    return {
      message: "API NestJS rodando com sucesso!!",
      status: "online",
      documentacao: "Use o endpoint /users para testar o CRUD"
    };
  }
}