import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenEntity } from './token/token.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class TokenGuard implements CanActivate {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('Authorization header not found.');
    }
    const token = authHeader.split(" ")[1];
    const checkToken = await getRepository(TokenEntity).findOne({ token: token });
    if (checkToken) {
      return true;
    }
    throw new UnauthorizedException('Token not valid');
  }
}
