import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath } from '@island.is/financial-aid/shared/lib'

import { GetSignedUrlDto, CreateFilesDto } from './dto'
import { CreateFilesModel, SignedUrlModel } from './models'
import { FileService } from './file.service'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller(`${apiBasePath}/file`)
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('url')
  @Scopes(
    MunicipalitiesFinancialAidScope.write,
    MunicipalitiesFinancialAidScope.applicant,
  )
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url',
  })
  createSignedUrl(@Body() getSignedUrl: GetSignedUrlDto): SignedUrlModel {
    return this.fileService.createSignedUrl(
      getSignedUrl.folder,
      getSignedUrl.fileName,
    )
  }

  @Get('url/:id')
  @Scopes(
    MunicipalitiesFinancialAidScope.read,
    MunicipalitiesFinancialAidScope.employee,
  )
  @ApiCreatedResponse({
    type: SignedUrlModel,
    description: 'Creates a new signed url',
  })
  async createSignedUrlForId(@Param('id') id: string): Promise<SignedUrlModel> {
    return this.fileService.createSignedUrlForFileId(id)
  }

  @Post('')
  @Scopes(
    MunicipalitiesFinancialAidScope.applicant,
    MunicipalitiesFinancialAidScope.write,
  )
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
