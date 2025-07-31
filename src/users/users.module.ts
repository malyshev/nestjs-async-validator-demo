import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UniqueUsernameValidator } from './validators/unique-username.validator';

@Module({
  providers: [UsersService, UniqueUsernameValidator],
  controllers: [UsersController],
})
export class UsersModule {}
