import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { UniqueUsernameValidator } from '../validators/unique-username.validator';

export class CreateUserDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Validate(UniqueUsernameValidator)
  username!: string;
}
