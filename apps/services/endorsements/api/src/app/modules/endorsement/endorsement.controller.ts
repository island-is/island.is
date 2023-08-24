import {
  BypassAuth,
  CurrentUser,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiExtraModels,
  ApiResponse,
} from '@nestjs/swagger'
import { environment } from '../../../environments'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementListByIdPipe } from '../endorsementList/pipes/endorsementListById.pipe'
import { EndorsementDto } from './dto/endorsement.dto'
import { Endorsement } from './models/endorsement.model'
import { EndorsementService } from './endorsement.service'
import { AdminPortalScope, EndorsementsScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import { PaginationDto } from '@island.is/nest/pagination'
import { PaginatedEndorsementDto } from './dto/paginatedEndorsement.dto'
import { EndorsementInterceptor } from './interceptors/endorsement.interceptor'
import { PaginatedEndorsementInterceptor } from './interceptors/paginatedEndorsement.interceptor'
import { ExistsEndorsementResponse } from './dto/existsEndorsement.response'

const auditNamespace = `${environment.audit.defaultNamespace}/endorsement`
@Audit({
  namespace: auditNamespace,
})
@ApiTags('endorsement')
@ApiOAuth2([])
@ApiExtraModels(PaginationDto, PaginatedEndorsementDto)
@UseGuards(ScopesGuard)
@Controller('endorsement-list/:listId/endorsement')
export class EndorsementController {
  constructor(
    private readonly endorsementService: EndorsementService,
    private readonly auditService: AuditService,
  ) {}

  @ApiOperation({ summary: 'Finds all endorsements in a given list' })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementsScope.main, AdminPortalScope.petitionsAdmin)
  @Get()
  @Audit<PaginatedEndorsementDto>({
    resources: ({ data: endorsement }) => endorsement.map((e) => e.id),
    meta: ({ data: endorsement }) => ({ count: endorsement.length }),
  })
  @ApiOkResponse({ type: PaginatedEndorsementDto })
  @UseInterceptors(PaginatedEndorsementInterceptor)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  async findAll(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @Query() query: PaginationDto,
  ): Promise<PaginatedEndorsementDto> {
    return await this.endorsementService.findEndorsements(
      {
        listId: endorsementList.id,
      },
      query,
    )
  }

  @ApiOperation({
    summary: 'Finds all endorsements in a given general petition list',
  })
  @ApiParam({ name: 'listId', type: String })
  @Get('/general-petition')
  @ApiOkResponse({ type: PaginatedEndorsementDto })
  @UseInterceptors(PaginatedEndorsementInterceptor)
  @ApiResponse({ status: 200 })
  @BypassAuth() // NOTE you cant use @Audit() and @BypassAuth() together
  async find(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @Query() query: PaginationDto,
  ): Promise<PaginatedEndorsementDto> {
    return await this.endorsementService.findEndorsementsGeneralPetition(
      {
        listId: endorsementList.id,
      },
      query,
    )
  }

  @ApiOperation({
    summary: 'Find any existing endorsement in a given list by national Id',
  })
  @ApiOkResponse({
    description:
      'Uses current authenticated users national id to find any existing endorsement in a given list',
    type: ExistsEndorsementResponse,
  })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementsScope.main, AdminPortalScope.petitionsAdmin)
  @Get('/exists')
  async findByAuth(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @CurrentUser() user: User,
  ): Promise<ExistsEndorsementResponse> {
    return await this.endorsementService.findSingleUserEndorsement({
      listId: endorsementList.id,
      nationalId: user.nationalId,
    })
  }

  @ApiOperation({
    summary:
      'Uses the authenticated users national id to create an endorsement',
  })
  @ApiCreatedResponse({
    description:
      'Uses the authenticated users national id to create an endorsement',
    type: Endorsement,
  })
  @UseInterceptors(EndorsementInterceptor)
  @ApiParam({ name: 'listId', type: String })
  @ApiBody({ type: EndorsementDto })
  @Scopes(EndorsementsScope.main, AdminPortalScope.petitionsAdmin)
  @Post()
  @Audit<Endorsement>({
    resources: (endorsement) => endorsement.id,
  })
  async create(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @Body() endorsement: EndorsementDto,
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementService.createEndorsementOnList({
      nationalId: user.nationalId,
      endorsementList,
      showName: endorsement.showName,
    })
  }

  @ApiOperation({
    summary:
      'Uses the authenticated users national id to remove endorsement form a given list',
  })
  @ApiNoContentResponse({
    description:
      'Uses the authenticated users national id to remove endorsement form a given list',
  })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementsScope.main, AdminPortalScope.petitionsAdmin)
  @Delete()
  @HttpCode(204)
  async delete(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @CurrentUser() user: User,
  ): Promise<undefined> {
    // we pass audit manually since we need to use the request parameter since we don't return the endorsement list
    this.auditService.audit({
      auth: user,
      resources: endorsementList.id,
      namespace: auditNamespace,
      action: 'delete',
    })

    await this.endorsementService.deleteFromListByNationalId({
      nationalId: user.nationalId,
      endorsementList,
    })
    return
  }
}
