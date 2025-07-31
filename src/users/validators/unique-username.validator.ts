import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueUsernameValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(username: string): Promise<boolean> {
    return !(await this.userService.findByUsername(username));
  }

  defaultMessage(): string {
    return 'username is already taken';
  }
}
