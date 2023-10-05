import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

import { FileService } from '../file.service'

@Injectable()
export class CaseFileExistsGuard implements CanActivate {
  constructor(private readonly fileService: FileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const caseId = request.params.caseId

    if (!caseId) {
      throw new BadRequestException('Missing case id')
    }

    const fileId = request.params.fileId

    if (!fileId) {
      throw new BadRequestException('Missing file id')
    }

    request.caseFile = await this.fileService.findById(fileId, caseId)

    return true
  }
}
