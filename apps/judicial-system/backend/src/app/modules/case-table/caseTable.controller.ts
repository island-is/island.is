import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
} from '@island.is/judicial-system/auth'
import {
  CaseTableColumnType,
  CaseTableType,
  User,
} from '@island.is/judicial-system/types'

import { CaseTableResponse } from './dto/caseTable.response'
import { CaseTablesResponse } from './dto/caseTables.response'

@Controller('api/')
@ApiTags('case-tables')
@UseGuards(JwtAuthUserGuard)
export class CaseTableController {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  @Get('case-tables')
  @ApiOkResponse({
    type: CaseTablesResponse,
    description: 'Gets all available case tables for a given user',
  })
  getCaseTables(@CurrentHttpUser() user: User): CaseTablesResponse {
    this.logger.debug(`Getting all available case tables for user ${user.id}`)

    return {
      groups: [
        {
          title: 'Rannsóknarmál',
          tables: [
            {
              type: CaseTableType.COURT_OF_APPEALS_IN_PROGRESS,
              title: 'Mál í vinnslu',
              description: 'Kærð sakamál sem eru til meðferðar.',
            },
            {
              type: CaseTableType.COURT_OF_APPEALS_COMPLETED,
              title: 'Afgreidd mál',
              description: 'Mál sem búið er að ljúka.',
            },
          ],
        },
      ],
    }
  }

  @Get('case-table')
  @ApiQuery({
    name: 'type',
    enum: CaseTableType,
    required: true,
    description: 'The case table type',
  })
  @ApiOkResponse({
    type: CaseTableResponse,
    description: 'Gets a case table of a specific type',
  })
  getCaseTable(@Query('type') type: CaseTableType): CaseTableResponse {
    this.logger.debug(`Getting a case table of type ${type}`)

    switch (type) {
      case CaseTableType.COURT_OF_APPEALS_IN_PROGRESS:
        return {
          type,
          columnCount: 0,
          rowCount: 0,
          columns: [
            { title: 'Málsnrúmer', type: CaseTableColumnType.STRING },
            { title: 'Varnaraðili', type: CaseTableColumnType.STRING },
            { title: 'Tegund', type: CaseTableColumnType.STRING },
            { title: 'Staða', type: CaseTableColumnType.STRING },
            { title: 'Dómsformaður', type: CaseTableColumnType.STRING },
          ],
          rows: [
            {
              caseId: '1234',
              cells: [
                { value: ['1234'] },
                { value: ['1234'] },
                { value: ['1234'] },
                { value: ['1234'] },
                { value: ['1234'] },
              ],
            },
          ],
        }
    }

    throw new BadRequestException(`Case table of type ${type} is not supported`)
  }
}
