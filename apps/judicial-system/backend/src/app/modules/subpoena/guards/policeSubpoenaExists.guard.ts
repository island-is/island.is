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

    const policeSubpoenaId = request.params.policeSubpoenaId

    if (!policeSubpoenaId) {
      throw new BadRequestException('Missing police subpoena id')
    }

    // policeSubpoenaId is the external police document id
    request.subpoena = await this.subpoenaService.findByPoliceSubpoenaId(
      policeSubpoenaId,
    )

    return true
  }
}
