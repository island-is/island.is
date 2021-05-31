import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiOAuth2, ApiParam, ApiTags } from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { FindEndorsementListByTagDto } from './dto/findEndorsementListsByTag.dto'
import { Endorsement } from '../endorsement/endorsement.model'
import { BypassAuth, CurrentUser, User } from '@island.is/auth-nest-tools'
import { EndorsementListByIdPipe } from './pipes/endorsementListById.pipe'
import { IsEndorsementListOwnerValidationPipe } from './pipes/isEndorsementListOwnerValidation.pipe'
import { environment } from '../../../environments/environment'

const auditNamespace = `${environment.audit.defaultNamespace}/endorsement-list`

@ApiTags('endorsementList')
@Controller('endorsement-list')
@ApiOAuth2([])
export class EndorsementListController {
  constructor(
    private readonly endorsementListService: EndorsementListService,
  ) {}

  @Get()
  @BypassAuth()
  async findByTag(
    @Query() { tag }: FindEndorsementListByTagDto,
  ): Promise<EndorsementList[]> {
    // TODO: Add pagination
    return await this.endorsementListService.findListsByTag(tag)
  }

  /**
   * This exists so we can return all endorsements for user across all lists
   */
  @Get('/endorsements')
  @Audit<Endorsement[]>({
    namespace: auditNamespace,
    action: 'findEndorsements',
    resources: (endorsement) => endorsement.map((e) => e.id),
    meta: (endorsement) => ({ count: endorsement.length }),
  })
  async findEndorsements(@CurrentUser() user: User): Promise<Endorsement[]> {
    // TODO: Add pagination
    return await this.endorsementListService.findAllEndorsementsByNationalId(
      user.nationalId,
    )
  }

  @Get(':listId')
  @Audit<EndorsementList>({
    namespace: auditNamespace,
    action: 'findOne',
    resources: (endorsementList) => endorsementList.id,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  async findOne(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return endorsementList
  }

  @Put(':listId/close')
  @Audit<EndorsementList>({
    namespace: auditNamespace,
    action: 'close',
    resources: (endorsementList) => endorsementList.id,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  async close(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
      IsEndorsementListOwnerValidationPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.close(endorsementList)
  }

  @Post()
  @Audit<EndorsementList>({
    namespace: auditNamespace,
    action: 'create',
    resources: (endorsementList) => endorsementList.id,
    meta: (endorsementList) => ({
      tags: endorsementList.tags,
    }),
  })
  async create(
    @Body() endorsementList: EndorsementListDto,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.create({
      ...endorsementList,
      owner: user.nationalId,
    })
  }
}
