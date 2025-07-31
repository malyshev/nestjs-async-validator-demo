# Async Validator with Dependency Injection in NestJS

This repository demonstrates how to properly inject services into `class-validator` custom constraints in a NestJS project — a common pitfall with a surprisingly simple but non-obvious fix.

## 🔍 Problem

By default, `class-validator` doesn't know about NestJS’s dependency injection system. So if you try to inject a service into an `@ValidatorConstraint()` class, it simply won't work:

```ts
@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueUsernameValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(username: string): Promise<boolean> {
    return !(await this.userService.findByUsername(username));
  }
}

```

Even though UsersService is a valid NestJS provider, the validator will throw a runtime error — unless you take one crucial step:

## ✅ Solution

Before running your app, tell class-validator to use Nest’s DI container:

```ts
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
```
Without this, class-validator will instantiate constraint classes using its own logic and ignore your providers.

## 📦 How to Run

```shell
npm install
npm run start
```
App will be available at: http://localhost:3000

## 🧪 Test the Validator

Use curl or Postman to test the /users endpoint.

### ✅ Successful Request (username is available):

```shell
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username": "new-username"}'
```

### ❌ Error (username is taken):

```shell
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username": "taken-username"}'
```

Response:

```json
{
  "message": [
    "username is already taken"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
## 📂 Folder Structure
```shell
src/
  app.module.ts
  main.ts
  users/
    users.controller.ts
    users.service.ts
    users.module.ts
    dto/
      create-user.dto.ts
    validators/
      unique-username.validator.ts
```

## 🧠 Bonus Tip

The validator won’t work unless:
* It’s decorated with @ValidatorConstraint({ async: true })
* It’s provided as a NestJS provider (in app.module.ts)
* You call useContainer(app.select(AppModule)) in main.ts

## 🙌 Inspired by Real Pain™

This issue was the source of real-world confusion and wasted hours. Now it’s documented and fixed — hope it helps someone!

> Article: [The Hidden Fix Behind NestJS Async Validators That Nobody Tells You About](https://medium.com/@s_malyshev/the-hidden-fix-behind-nestjs-async-validators-that-nobody-tells-you-about-76e632a9aff8)
