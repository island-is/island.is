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

    const { verdicts } = defendant

    if (!verdicts || verdicts.length === 0) {
      throw new NotFoundException(`Defendant is missing verdict`)
    }

    // Only the latest verdict is relevant
    request.verdict = verdicts[0]
    return true
  }
}
