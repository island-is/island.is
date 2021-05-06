import { CurrentUser, User } from '@island.is/auth-nest-tools'
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
import { ApiOAuth2, ApiParam, ApiTags } from '@nestjs/swagger'
import { environment } from '../../../environments/environment'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementListByIdPipe } from '../endorsementList/pipes/endorsementListById.pipe'
import { IsEndorsementListOwnerValidationPipe } from '../endorsementList/pipes/isEndorsementListOwnerValidation.pipe'
import { BulkEndorsementDto } from './dto/bulkEndorsement.dto'
import { Endorsement } from './endorsement.model'
import { EndorsementService } from './endorsement.service'

const auditNamespace = `${environment.audit.defaultNamespace}/endorsement`

@ApiTags('endorsement')
@ApiOAuth2([])
@Controller('endorsement-list/:listId/endorsement')
export class EndorsementController {
  constructor (
    private readonly endorsementService: EndorsementService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Audit<Endorsement[]>({
    namespace: auditNamespace,
    action: 'findAll',
    resources: (endorsement) => endorsement.map((e) => e.id),
    meta: (endorsement) => ({ count: endorsement.length }),
  })
  @ApiParam({ name: 'listId', type: 'string' })
  async findAll (
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<Endorsement[]> {
    return await this.endorsementService.findEndorsements({
      listId: endorsementList.id,
    })
  }

  @Get('/exists')
  @Audit<Endorsement>({
    namespace: auditNamespace,
    action: 'findByUser',
    resources: (endorsement) => endorsement.id,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  async findByUser (
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

  @Post()
  @Audit<Endorsement>({
    namespace: auditNamespace,
    action: 'create',
    resources: (endorsement) => endorsement.id,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  async create (
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementService.createEndorsementOnList({
      nationalId: user.nationalId,
      endorsementList,
    })
  }

  @Post('/bulk')
  @Audit<Endorsement[]>({
    namespace: auditNamespace,
    action: 'bulkCreate',
    resources: (endorsement) => endorsement.map((e) => e.id),
    meta: (endorsement) => ({ count: endorsement.length }),
  })
  @ApiParam({ name: 'listId', type: 'string' })
  async bulkCreate (
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
      IsEndorsementListOwnerValidationPipe,
    )
    endorsementList: EndorsementList,
    @Body() { nationalIds }: BulkEndorsementDto,
  ): Promise<Endorsement[]> {
    return await this.endorsementService.bulkCreateEndorsementOnList({
      nationalIds,
      endorsementList,
    })
  }

  @Delete()
  @Audit({
    namespace: auditNamespace,
    action: 'delete',
  })
  @HttpCode(204)
  @ApiParam({ name: 'listId', type: 'string' })
  async delete (
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @CurrentUser() user: User,
  ): Promise<unknown> {
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
