import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // The magic line: this connects NestJS's DI container with class-validator.
  // Without it, any @Injectable() services used inside @ValidatorConstraint classes
  // will not be available — leading to undefined errors at runtime.
  //
  // Example failure if missing:
  // TypeError: Cannot read properties of undefined (reading 'findByUsername')
  //
  // More: https://github.com/typestack/class-validator#using-service-container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}

// tslint:disable-next-line:no-console
bootstrap().catch((err) => console.error(err));
