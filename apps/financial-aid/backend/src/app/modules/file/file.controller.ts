import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { CurrentHttpUser, JwtAuthGuard } from '@island.is/financial-aid/auth'
import type { User } from '@island.is/financial-aid/shared'

import { CreatePresignedPostDto } from './dto'
import { PresignedPostModel } from './models'
import { FileService } from './file.service'

@UseGuards(JwtAuthGuard)
@Controller('api/file/')
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('file/url')
  @ApiCreatedResponse({
    type: PresignedPostModel,
    description: 'Creates a new presigned post',
  })
  createCasePresignedPost(
    @CurrentHttpUser() user: User,
    @Body() createPresignedPost: CreatePresignedPostDto,
  ): PresignedPostModel {
    return this.fileService.createCasePresignedPost(createPresignedPost)
  }
}
