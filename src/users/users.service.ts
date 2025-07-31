import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  /**
   * Wishful-thinking username checker.
   *
   * In reality, this would hit a database or external service.
   * Here, we just pretend one username is taken — for the sake of example.
   *
   * Demonstrates how to inject async services into class-validator constraints
   * using NestJS's dependency injection.
   */
  async findByUsername(username: string): Promise<boolean> {
    return Promise.resolve(username === 'taken-username');
  }
}
