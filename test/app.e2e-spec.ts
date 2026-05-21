import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Fluxo de Autenticação (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - Deve cadastrar um novo usuário com sucesso', async () => {
    const uniqueEmail = `test-${Date.now()}@dev.com`;

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Matheus Teste',
        email: uniqueEmail,
        password: 'password123',
      })
      .expect(201)

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Matheus Teste');
    expect(response.body.email).toBe(uniqueEmail);
    expect(response.body.password).toBeUndefined();
  });

  it('/auth/login (POST) - Deve falhar ao tentar logar com senha errada', async () => {
    const uniqueEmail = `test-${Date.now()}@dev.com`;

    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Matheus Teste',
        email: uniqueEmail,
        password: 'password123',
      });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: uniqueEmail,
        password: 'senha_errada_aqui',
      })
      .expect(401);
  });

  it('/auth/login (POST) - Deve logar com sucesso e retornar o access_token', async () => {
    const uniqueEmail = `test-${Date.now()}@dev.com`;
    const password = 'password123';

    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Matheus Teste',
        email: uniqueEmail,
        password: password,
      });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: uniqueEmail,
        password: password,
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
  });
});