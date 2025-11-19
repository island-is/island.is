import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

@Injectable()
export class VerdictExistsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    // We populate the defendant to access the verdict
    const defendant = request.defendant
    if (!defendant) {
      throw new BadRequestException('Missing defendant')
    }

    const { verdict } = defendant
    if (!verdict) {
      throw new NotFoundException(`Defendant is missing verdict`)
    }

    request.verdict = verdict
    return true
  }
}
