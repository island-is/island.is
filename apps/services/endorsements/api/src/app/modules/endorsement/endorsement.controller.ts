import {
  Auth,
  CurrentAuth,
  CurrentUser,
  Scopes,
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
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { environment } from '../../../environments'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementListByIdPipe } from '../endorsementList/pipes/endorsementListById.pipe'
import { IsEndorsementListOwnerValidationPipe } from '../endorsementList/pipes/isEndorsementListOwnerValidation.pipe'
import { BulkEndorsementDto } from './dto/bulkEndorsement.dto'
import { Endorsement } from './models/endorsement.model'
import { EndorsementService } from './endorsement.service'
import { Endorsement as EndorsementScope } from '@island.is/auth/scopes'
import { EndorsementBulkCreate } from './models/endorsementBulkCreate.model'
import type { User } from '@island.is/auth-nest-tools'

const auditNamespace = `${environment.audit.defaultNamespace}/endorsement`

@ApiTags('endorsement')
@ApiOAuth2([])
@Controller('endorsement-list/:listId/endorsement')
export class EndorsementController {
  constructor(
    private readonly endorsementService: EndorsementService,
    private readonly auditService: AuditService,
  ) {}

  @ApiOkResponse({
    description: 'Finds all endorsements in a given list',
    type: [Endorsement],
  })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementScope.endorsementRead)
  @Get()
  @Audit<Endorsement[]>({
    namespace: auditNamespace,
    action: 'findAll',
    resources: (endorsement) => endorsement.map((e) => e.id),
    meta: (endorsement) => ({ count: endorsement.length }),
  })
  async findAll(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
      IsEndorsementListOwnerValidationPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<Endorsement[]> {
    return await this.endorsementService.findEndorsements({
      listId: endorsementList.id,
    })
  }

  @ApiOkResponse({
    description:
      'Uses current authenticated users national id to find any existing endorsement in a given list',
    type: Endorsement,
  })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementScope.endorsementRead)
  @Get('/exists')
  @Audit<Endorsement>({
    namespace: auditNamespace,
    action: 'findByAuth',
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

  @ApiCreatedResponse({
    description:
      'Uses the authenticated users national id to create an endorsement',
    type: Endorsement,
  })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementScope.endorsementWrite)
  @Post()
  @Audit<Endorsement>({
    namespace: auditNamespace,
    action: 'create',
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

  @ApiCreatedResponse({
    description: 'Creates multiple endorsements given an array of national ids',
    type: EndorsementBulkCreate,
  })
  @ApiParam({ name: 'listId', type: String })
  @ApiBody({
    type: BulkEndorsementDto,
  })
  @Scopes(EndorsementScope.endorsementWrite)
  @Post('/bulk')
  @Audit<EndorsementBulkCreate>({
    namespace: auditNamespace,
    action: 'bulkCreate',
    resources: (response) => response.succeeded.map((e) => e.id),
    meta: (response) => ({ count: response.succeeded.length }),
  })
  async bulkCreate(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
      IsEndorsementListOwnerValidationPipe,
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

  @ApiNoContentResponse({
    description:
      'Uses the authenticated users national id to remove endorsement form a given list',
  })
  @ApiParam({ name: 'listId', type: String })
  @Scopes(EndorsementScope.endorsementWrite)
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
    // we pass audit manually since we need a request parameter
    this.auditService.audit({
      user,
      namespace: auditNamespace,
      action: 'delete',
      resources: endorsementList.id,
    })

    await this.endorsementService.deleteFromListByNationalId({
      nationalId: user.nationalId,
      endorsementList,
    })
    return
  }
}
