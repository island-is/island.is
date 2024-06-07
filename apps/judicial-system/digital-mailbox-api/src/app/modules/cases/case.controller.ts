import {
  applyDecorators,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { UpdateSubpoenaDto } from './dto/subpoena.dto'
import { CaseResponse } from './models/case.response'
import { CasesResponse } from './models/cases.response'
import { SubpoenaResponse } from './models/subpoena.response'
import { CaseService } from './case.service'

const CommonApiResponses = applyDecorators(
  ApiResponse({ status: 400, description: 'Bad Request' }),
  ApiResponse({
    status: 401,
    description: 'User is not authorized to perform this action',
  }),
  ApiResponse({ status: 500, description: 'Internal Server Error' }),
)

const ApiLangQuery = applyDecorators(
  ApiQuery({
    name: 'lang',
    required: false,
    description:
      'The requested language of the response. Defaults to Icelandic.',
  }),
)

@Controller('api')
@ApiTags('cases')
@UseGuards(IdsUserGuard)
export class CaseController {
  constructor(
    private readonly caseService: CaseService,

    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('cases')
  @ApiOkResponse({
    type: [CasesResponse],
    description:
      'Returns a list of accessible indictment cases for authenticated user. If user has no cases it returns an empty list.',
  })
  @CommonApiResponses
  @ApiLangQuery
  async getAllCases(
    @CurrentUser() user: User,
    @Query() query?: { lang: string },
  ): Promise<CasesResponse[]> {
    this.logger.debug('Getting all cases')

    return this.caseService.getCases(user.nationalId, query?.lang)
  }

  @Get('case/:caseId')
  @ApiOkResponse({
    type: CaseResponse,
    description: 'Returns indictment case by case id',
  })
  @CommonApiResponses
  @ApiResponse({
    status: 404,
    description: 'Case for given case id and authenticated user not found',
  })
  @ApiLangQuery
  async getCase(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @CurrentUser() user: User,
    @Query() query?: { lang: string },
  ): Promise<CaseResponse> {
    this.logger.debug('Getting case by id')

    return this.caseService.getCase(caseId, user.nationalId, query?.lang)
  }

  @Get('case/:caseId/subpoena')
  @ApiOkResponse({
    type: () => SubpoenaResponse,
    description: 'Returns subpoena by case id',
  })
  @CommonApiResponses
  @ApiResponse({
    status: 404,
    description: 'Subpoena for given case id and authenticated user not found',
  })
  @ApiLangQuery
  async getSubpoena(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @CurrentUser() user: User,
    @Query() query?: { lang: string },
  ): Promise<SubpoenaResponse> {
    this.logger.debug(`Getting subpoena by case id ${caseId}`)

    return this.caseService.getSubpoena(caseId, user.nationalId, query?.lang)
  }

  @Patch('case/:caseId/subpoena')
  @ApiOkResponse({
    type: () => SubpoenaResponse,
    description: 'Updates subpoena info',
  })
  @CommonApiResponses
  @ApiResponse({
    status: 404,
    description: 'Subpoena for given case id and authenticated user not found',
  })
  @ApiResponse({
    status: 403,
    description: 'User is not allowed to update subpoena',
  })
  @ApiLangQuery
  async updateSubpoena(
    @CurrentUser() user: User,
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @Body() defenderAssignment: UpdateSubpoenaDto,
    @Query() query?: { lang: string },
  ): Promise<SubpoenaResponse> {
    this.logger.debug(`Assigning defender to subpoena ${caseId}`)

    return this.caseService.updateSubpoena(
      user.nationalId,
      caseId,
      defenderAssignment,
      query?.lang,
    )
  }
}
