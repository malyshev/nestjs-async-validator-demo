import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  async create(
    @Body() dto: CreateUserDto,
  ): Promise<{ message: string; username: string }> {
    return Promise.resolve({
      message: 'User created successfully',
      username: dto.username,
    });
  }
}
