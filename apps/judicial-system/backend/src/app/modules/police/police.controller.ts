import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { prosecutorRepresentativeRule, prosecutorRule } from '../../guards'
import {
  CaseExistsGuard,
  CaseNotCompletedGuard,
  CaseOriginalAncestorInterceptor,
  CaseReadGuard,
  CurrentCase,
} from '../case'
import { Case } from '../repository'
import { UploadPoliceCaseFileDto } from './dto/uploadPoliceCaseFile.dto'
import { PoliceCaseFile } from './models/policeCaseFile.model'
import { PoliceCaseInfo } from './models/policeCaseInfo.model'
import { PoliceDefendant } from './models/policeDefendant.model'
import { PoliceSystemDigitalCaseFile } from './models/PoliceSystemDigitalCaseFile.model'
import { UploadPoliceCaseFileResponse } from './models/uploadPoliceCaseFile.response'
import { PoliceService } from './police.service'

@Controller('api/case/:caseId')
@ApiTags('police files')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseNotCompletedGuard,
)
export class PoliceController {
  constructor(
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @UseInterceptors(CaseOriginalAncestorInterceptor)
  @Get('policeFiles')
  @ApiOkResponse({
    type: PoliceCaseFile,
    isArray: true,
    description: 'Gets all police files for a case',
  })
  getAll(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<PoliceCaseFile[]> {
    this.logger.debug(`Getting all police files for case ${caseId}`)

    return this.policeService.getAllPoliceCaseFiles(theCase.id, user)
  }

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @UseInterceptors(CaseOriginalAncestorInterceptor)
  @Get('policeDefendants')
  @ApiOkResponse({
    type: PoliceDefendant,
    isArray: true,
    description: 'Gets defendants for a case from the police API',
  })
  getPoliceDefendants(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<PoliceDefendant[]> {
    this.logger.debug(`Getting defendants for case ${caseId} from police API`)

    return this.policeService.getDefendantsFromPolice(theCase.id, user)
  }

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @UseInterceptors(CaseOriginalAncestorInterceptor)
  @Get('policeCaseUnits')
  @ApiOkResponse({
    description:
      'Gets case units (malseiningar) for a case and each defendant national ID from the dedicated police API',
  })
  getPoliceCaseUnits(
    @Param('caseId') caseId: string,
    @Query('nationalId') nationalIdParam: string | string[],
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<{ results: Array<{ nationalId: string; units: unknown }> }> {
    const nationalIds = Array.isArray(nationalIdParam)
      ? nationalIdParam.map((id) => id?.trim()).filter(Boolean)
      : nationalIdParam?.trim()
        ? [nationalIdParam.trim()]
        : []

    if (nationalIds.length === 0) {
      throw new BadRequestException(
        'At least one query parameter "nationalId" is required',
      )
    }

    this.logger.debug(
      `Getting case units for case ${caseId} from police API (GetRVMalseiningar), ${nationalIds.length} defendant(s)`,
    )

    return this.policeService.getCaseUnitsFromPolice(
      theCase.id,
      nationalIds,
      user,
    )
  }

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @UseInterceptors(CaseOriginalAncestorInterceptor)
  @Get('policeDigitalFiles')
  @ApiOkResponse({
    type: PoliceSystemDigitalCaseFile,
    isArray: true,
    description: 'Gets all police digital files for a case',
  })
  getDigitalCaseFiles(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<PoliceSystemDigitalCaseFile[]> {
    this.logger.debug(`Getting all police digital files for case ${caseId}`)

    return this.policeService.getAllPoliceSystemDigitalCaseFiles(
      theCase.id,
      user,
    )
  }

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @UseInterceptors(CaseOriginalAncestorInterceptor)
  @Get('policeCaseInfo')
  @ApiOkResponse({
    type: [PoliceCaseInfo],
    isArray: true,
    description: 'Gets info for a police case',
  })
  getPoliceCaseInfo(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<PoliceCaseInfo[]> {
    this.logger.debug(`Getting info for police case ${caseId}`)

    return this.policeService.getPoliceCaseInfo(theCase.id, user)
  }

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post('policeFile')
  @ApiOkResponse({
    type: UploadPoliceCaseFileResponse,
    description: 'Uploads a police file of a case to AWS S3',
  })
  uploadPoliceCaseFile(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @Body() uploadPoliceCaseFile: UploadPoliceCaseFileDto,
    @CurrentCase() theCase: Case,
  ): Promise<UploadPoliceCaseFileResponse> {
    this.logger.debug(
      `Uploading police file ${uploadPoliceCaseFile.id} of case ${caseId} to AWS S3`,
    )

    return this.policeService.uploadPoliceCaseFile(
      caseId,
      theCase.type,
      uploadPoliceCaseFile,
      user,
    )
  }
}
