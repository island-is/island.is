import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { SubpoenaService } from '../subpoena.service'

@Injectable()
export class PoliceSubpoenaExistsGuard implements CanActivate {
  constructor(private readonly subpoenaService: SubpoenaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const subpoenaId = request.params.subpoenaId

    if (!subpoenaId) {
      throw new BadRequestException('Missing police subpoena id')
    }

    // subpoenaId is the external police document id
    request.subpoena = await this.subpoenaService.findByPoliceSubpoenaId(
      subpoenaId,
    )

    return true
  }
}
