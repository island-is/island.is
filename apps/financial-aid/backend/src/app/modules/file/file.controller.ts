import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/financial-aid/auth'
import { apiBasePath, RolesRule } from '@island.is/financial-aid/shared/lib'
import type { User } from '@island.is/financial-aid/shared/lib'

import { GetSignedUrlDto, CreateFilesDto } from './dto'
import { CreateFilesModel, SignedUrlModel } from './models'
import { FileService } from './file.service'

@UseGuards(JwtAuthGuard)
@Controller(`${apiBasePath}/file`)
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(RolesRule.OSK)
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

  @Get('url/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(RolesRule.VEITA)
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url',
  })
  async createSignedUrlForId(@Param('id') id: string): Promise<SignedUrlModel> {
    return this.fileService.createSignedUrlForFileId(id)
  }

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
