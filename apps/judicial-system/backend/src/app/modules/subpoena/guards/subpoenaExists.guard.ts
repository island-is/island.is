import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { SubpoenaService } from '../subpoena.service'

@Injectable()
export class SubpoenaExistsGuard implements CanActivate {
  constructor(private readonly subpoenaService: SubpoenaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const subpoenaId = request.params.subpoenaId

    if (!subpoenaId) {
      throw new BadRequestException('Missing subpoena id')
    }

    request.subpoena = await this.subpoenaService.findBySubpoenaId(subpoenaId)

    return true
  }
}
