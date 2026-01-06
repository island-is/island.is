import {
  BadGatewayException,
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { Get } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { PoliceFileTypeCode } from '@island.is/judicial-system/types'

import { CreateCaseDto } from './dto/createCase.dto'
import { UpdatePoliceDocumentDeliveryDto } from './dto/policeDocument.dto'
import { UpdateSubpoenaDto } from './dto/subpoena.dto'
import { Case } from './models/case.model'
import { Defender } from './models/defender.model'
import { PoliceDocumentDelivery } from './models/policeDocumentDelivery.response'
import { PoliceDocumentSupplements } from './models/policeDocumentSupplements.response'
import { SubpoenaResponse } from './models/subpoena.response'
import { EventInterceptor } from './app.interceptor'
import { AppService } from './app.service'

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseInterceptors(EventInterceptor)
  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(@Body() caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a case')

    return this.appService.create(caseToCreate).then((createdCase) => {
      this.logger.info(`Case ${createdCase.id} created`)

      return createdCase
    })
  }

  @Get('defenders')
  @ApiOkResponse({
    type: [Defender],
    description: 'Returns a list of defenders',
  })
  @ApiResponse({ status: 502, description: 'Failed to retrieve defenders' })
  async getLawyers(): Promise<Defender[]> {
    try {
      this.logger.debug('Retrieving litigators from lawyer registry')

      const litigators = await this.appService.getLitigators()

      return litigators
    } catch (error) {
      this.logger.error('Failed to retrieve lawyers', { error })

      throw new BadGatewayException('Failed to retrieve lawyers')
    }
  }

  // update by police subpoena id
  @Patch('subpoena/:policeSubpoenaId')
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 502, description: 'Failed to update subpoena' })
  async updateSubpoena(
    @Param('policeSubpoenaId', new ParseUUIDPipe()) policeSubpoenaId: string,
    @Body() updateSubpoena: UpdateSubpoenaDto,
  ): Promise<SubpoenaResponse> {
    this.logger.info(`Updating subpoena ${policeSubpoenaId}`)

    return this.appService.updateSubpoena(policeSubpoenaId, updateSubpoena)
  }

  // called by the national commissioners office
  @Patch('policeDocumentDelivery/:policeDocumentId')
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({
    status: 502,
    description: 'Failed to update document information',
  })
  async updatePoliceDocumentDelivery(
    @Param('policeDocumentId', new ParseUUIDPipe()) policeDocumentId: string,
    @Body() updatePoliceDocumentDelivery: UpdatePoliceDocumentDeliveryDto,
  ): Promise<PoliceDocumentDelivery> {
    this.logger.info(`Updating police document ${policeDocumentId}`)

    return this.appService.updatePoliceDocumentDelivery(
      policeDocumentId,
      updatePoliceDocumentDelivery,
    )
  }

  // called by the national commissioners office
  @Get('getPoliceDocumentSupplements/:policeDocumentId')
  @ApiQuery({
    name: 'fileTypeCode',
    required: true,
    description: 'Relevant file type code for document id',
    type: String,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({
    status: 502,
    description: 'Failed to get document supplements',
  })
  async getDocumentSupplements(
    @Param('policeDocumentId', new ParseUUIDPipe()) policeDocumentId: string,
    @Query('fileTypeCode') fileTypeCode: PoliceFileTypeCode,
  ): Promise<PoliceDocumentSupplements> {
    this.logger.info(
      `Get document supplements for ${policeDocumentId} with file type code ${fileTypeCode}`,
    )

    return this.appService.getPoliceDocumentSupplements(
      fileTypeCode,
      policeDocumentId,
    )
  }
}
