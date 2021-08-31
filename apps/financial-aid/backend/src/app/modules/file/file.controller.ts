import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { CurrentHttpUser, JwtAuthGuard } from '@island.is/financial-aid/auth'
import type { User } from '@island.is/financial-aid/shared'

import { CreateFileDto, GetSignedUrlDto } from './dto'
import { ApplicationFileModel, SignedUrlModel } from './models'
import { FileService } from './file.service'

@UseGuards(JwtAuthGuard)
@Controller('api/file')
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('url')
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url',
  })
  createSignedUrl(
    @CurrentHttpUser() user: User,
    @Body() getSignedUrl: GetSignedUrlDto,
  ): SignedUrlModel {
    return this.fileService.createSignedUrl(user.folder, getSignedUrl.fileName)
  }

  @Post('')
  @ApiCreatedResponse({
    type: ApplicationFileModel,
    description: 'Uploads files',
  })
  createFiles(
    @Body() createFile: CreateFileDto,
  ): Promise<ApplicationFileModel> {
    return this.fileService.createFile(createFile)
  }
}
