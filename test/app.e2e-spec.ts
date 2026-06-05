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

  it('/users/:id (PATCH) - Deve atualizar o nome do usuário com sucesso', async () => {

    const uniqueEmail = `update-${Date.now()}@dev.com`;
    const userRes = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Original', email: uniqueEmail, password: '123456' , role: 'admin'});

    const userId = userRes.body.id;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueEmail, password: '123456' });
  
    const token = loginRes.body.access_token;

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nome Atualizado' })
      .expect(200);

    expect(response.body.name).toBe('Nome Atualizado');
  });

  it('/users/:id (DELETE) - Deve deletar o usuário com sucesso', async () => {

    const uniqueEmail = `delete-${Date.now()}@dev.com`;
    const userRes = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Para Deletar', email: uniqueEmail, password: '123456', role: 'admin' });

    const userId = userRes.body.id;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueEmail, password: '123456' });

    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${loginRes.body.access_token}`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueEmail, password: '123' })
      .expect(401);
  });


});