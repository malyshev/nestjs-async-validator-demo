import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { useContainer } from 'class-validator';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Magic required even in tests!
    // Without this, class-validator won't be able to resolve injected services
    // inside custom validators like `@ValidatorConstraint({ async: true })`.
    // This makes the NestJS DI container available to class-validator.
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/users (POST)', () => {
    it('should create user when given a unique username', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ username: 'new-username' })
        .expect(201)
        .expect({
          message: 'User created successfully',
          username: 'new-username',
        });
    });

    it('should fail when username is already taken', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ username: 'taken-username' })
        .expect(400)
        .expect({
          message: ['username is already taken'],
          error: 'Bad Request',
          statusCode: 400,
        });
    });
  });
});
