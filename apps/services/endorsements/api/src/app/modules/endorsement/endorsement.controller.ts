import { CurrentAuth, CurrentUser, Scopes } from '@island.is/auth-nest-tools'
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
  applyDecorators,
  Query,
  Type
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
  getSchemaPath
} from '@nestjs/swagger'
import { environment } from '../../../environments'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementListByIdPipe } from '../endorsementList/pipes/endorsementListById.pipe'
import { BulkEndorsementDto } from './dto/bulkEndorsement.dto'
import { Endorsement } from './models/endorsement.model'
import { EndorsementService } from './endorsement.service'
import { EndorsementsScope } from '@island.is/auth/scopes'
import type { User, Auth } from '@island.is/auth-nest-tools'
import { EndorsementBulkCreate } from './models/endorsementBulkCreate.model'
import { HasAccessGroup } from '../../guards/accessGuard/access.decorator'
import { AccessGroup } from '../../guards/accessGuard/access.enum'


import { PaginatedDto } from '../pagination/dto/paginated.dto';
import { PageInfoDto } from '../pagination/dto/pageinfo.dto'
import { QueryDto } from '../pagination/dto/query.dto'

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};


const auditNamespace = `${environment.audit.defaultNamespace}/endorsement`
@Audit({
  namespace: auditNamespace,
})
@ApiTags('endorsement')
@ApiOAuth2([])
@ApiExtraModels(PaginatedDto,PageInfoDto,QueryDto)
@Controller('endorsement-list/:listId/endorsement')
export class EndorsementController {
  constructor(
    private readonly endorsementService: EndorsementService,
    private readonly auditService: AuditService,
  ) {}

  @ApiOperation({ summary: 'Finds all endorsements in a given list' })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementsScope.main)
  @Get()
  @HasAccessGroup(AccessGroup.Owner, AccessGroup.DMR)
  // @Audit<Endorsement[]>({
  //   resources: (endorsement) => endorsement.map((e) => e.id),
  //   meta: (endorsement) => ({ count: endorsement.length }),
  // })
  @ApiPaginatedResponse(Endorsement)
  async findAll(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @Query() query: QueryDto
  ): Promise<Endorsement[]> {
    return await this.endorsementService.findEndorsements({
      listId: endorsementList.id
    },
    query)
  }

  @ApiOperation({ summary: 'Find any existing endorsement in a given list by national Id' })
  @ApiOkResponse({
    description:
      'Uses current authenticated users national id to find any existing endorsement in a given list',
    type: Endorsement,
  })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementsScope.main)
  @Get('/exists')
  @Audit<Endorsement>({
    resources: (endorsement) => endorsement.id,
  })
  async findByAuth(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementService.findSingleUserEndorsement({
      listId: endorsementList.id,
      nationalId: user.nationalId,
    })
  }

  @ApiOperation({ summary: 'Uses the authenticated users national id to create an endorsement' })
  @ApiCreatedResponse({
    description:
      'Uses the authenticated users national id to create an endorsement',
    type: Endorsement,
  })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementsScope.main)
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
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementService.createEndorsementOnList(
      {
        nationalId: user.nationalId,
        endorsementList,
      },
      user,
    )
  }

  @ApiOperation({ summary: 'Creates multiple endorsements given an array of national ids' })
  @ApiCreatedResponse({
    description: 'Creates multiple endorsements given an array of national ids',
    type: EndorsementBulkCreate,
  })
  @ApiParam({ name: 'listId', type: String })
  @ApiBody({
    type: BulkEndorsementDto,
  })
  @Scopes(EndorsementsScope.main)
  @Post('/bulk')
  @HasAccessGroup(AccessGroup.Owner)
  @Audit<EndorsementBulkCreate>({
    resources: (response) => response.succeeded.map((e) => e.id),
    meta: (response) => ({ count: response.succeeded.length }),
  })
  async bulkCreate(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @Body() { nationalIds }: BulkEndorsementDto,
    @CurrentAuth() auth: Auth,
  ): Promise<EndorsementBulkCreate> {
    return await this.endorsementService.bulkCreateEndorsementOnList(
      {
        nationalIds,
        endorsementList,
      },
      auth,
    )
  }

  @ApiOperation({ summary: 'Uses the authenticated users national id to remove endorsement form a given list' })
  @ApiNoContentResponse({
    description:
      'Uses the authenticated users national id to remove endorsement form a given list',
  })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementsScope.main)
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
      user,
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
