import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { Defendant } from '../../repository'

@Injectable()
export class SubpoenaExistsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const defendant: Defendant = request.defendant

    if (!defendant) {
      throw new InternalServerErrorException('Missing defendant')
    }

    const subpoenaId = request.params.subpoenaId

    if (!subpoenaId) {
      throw new BadRequestException('Missing subpoena id')
    }

    const subpoena = defendant.subpoenas?.find(
      (subpoena) => subpoena.id === subpoenaId,
    )

    if (!subpoena) {
      throw new BadRequestException(
        `Subpoena ${subpoenaId} of defendant ${defendant.id} does not exist`,
      )
    }

    request.subpoena = subpoena

    return true
  }
}

@Injectable()
export class SubpoenaExistsOptionalGuard extends SubpoenaExistsGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const subpoenaId = request.params.subpoenaId

    if (!subpoenaId) {
      return true
    }

    return super.canActivate(context)
  }
}
