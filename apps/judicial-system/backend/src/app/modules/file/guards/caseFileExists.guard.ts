import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common'

import { FileService } from '../file.service'

@Injectable()
export class CaseFileExistsGuard implements CanActivate {
  constructor(private fileService: FileService) {}

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

    const csaeFile = await this.fileService.findById(fileId, caseId)

    request.caseFile = csaeFile

    return true
  }
}
