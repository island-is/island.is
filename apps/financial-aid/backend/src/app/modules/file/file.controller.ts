import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import {
  CurrentUser,
  RolesGuard,
  RolesRules,
  TokenGuard,
} from '@island.is/financial-aid/auth'
import { apiBasePath, RolesRule } from '@island.is/financial-aid/shared/lib'
import type { User } from '@island.is/financial-aid/shared/lib'

import { GetSignedUrlDto, CreateFilesDto } from './dto'
import { CreateFilesModel, SignedUrlModel } from './models'
import { FileService } from './file.service'

@UseGuards(TokenGuard)
@Controller(`${apiBasePath}/file`)
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('url')
  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url',
  })
  createSignedUrl(
    @CurrentUser() user: User,
    @Body() getSignedUrl: GetSignedUrlDto,
  ): SignedUrlModel {
    return this.fileService.createSignedUrl(user.folder, getSignedUrl.fileName)
  }

  @Get('url/:id')
  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.VEITA)
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url',
  })
  async createSignedUrlForId(@Param('id') id: string): Promise<SignedUrlModel> {
    return this.fileService.createSignedUrlForFileId(id)
  }

  @Post('')
  @UseGuards(RolesGuard)
  @RolesRules(RolesRule.OSK)
  @ApiCreatedResponse({
    type: CreateFilesModel,
    description: 'Uploads files',
  })
  async createFiles(
    @Body() createFiles: CreateFilesDto,
  ): Promise<CreateFilesModel> {
    return await this.fileService.createFiles(createFiles)
  }
}
