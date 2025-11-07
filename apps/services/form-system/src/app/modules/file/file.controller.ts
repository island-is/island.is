import { IdsUserGuard } from '@island.is/auth-nest-tools'
import {
  Body,
  Controller,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { FileService } from './file.service'
import { DeleteFileDto } from './models/deleteFile.dto'
import { StoreFileDto } from './models/storeFile.dto'

@UseGuards(IdsUserGuard)
@ApiTags('files')
@Controller({ path: 'files', version: ['1', VERSION_NEUTRAL] })
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBody({ type: StoreFileDto })
  @Post('upload')
  async storeFileToS3(@Body() input: StoreFileDto) {
    return this.fileService.uploadFile(
      input.fieldId,
      input.sourceKey,
      input.valueId,
    )
  }

  @ApiBody({ type: DeleteFileDto })
  @Post('delete')
  async deleteFile(@Body() input: DeleteFileDto) {
    return this.fileService.deleteFile(input.key, input.valueId)
  }
}
