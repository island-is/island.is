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
import {
  ApiBody,
  ApiOAuth2,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiExtraModels,
  ApiOperation,
  IntersectionType,
} from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { FindEndorsementListByTagsDto } from './dto/findEndorsementListsByTags.dto'
import { BypassAuth, CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import { EndorsementListByIdPipe } from './pipes/endorsementListById.pipe'
import { environment } from '../../../environments'
import { EndorsementsScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import { HasAccessGroup } from '../../guards/accessGuard/access.decorator'
import { AccessGroup } from '../../guards/accessGuard/access.enum'

import { PaginationDto } from '@island.is/nest/pagination'
import { PaginatedEndorsementListDto } from './dto/paginatedEndorsementList.dto'
import { PaginatedEndorsementDto } from '../endorsement/dto/paginatedEndorsement.dto'

export class FindTagPaginationCombo extends IntersectionType(
  FindEndorsementListByTagsDto,
  PaginationDto,
) {}

///////////// teste endpoint
import { ApiProperty } from '@nestjs/swagger'
export class FooBarDto {
  @ApiProperty()
  foo!: number
  @ApiProperty()
  bar!: string
  @ApiProperty()
  bob!: string
}

@Audit({
  namespace: `${environment.audit.defaultNamespace}/endorsement-list`,
})
@ApiTags('endorsementList')
@Controller('endorsement-list')
@ApiOAuth2([])
@ApiExtraModels(FindTagPaginationCombo, PaginatedEndorsementListDto)
export class EndorsementListController {
  constructor(
    private readonly endorsementListService: EndorsementListService,
  ) {}

  ////////////////////// new test point

  // @Scopes(EndorsementsScope.main)
  // @ApiOperation({
  //   summary: 'getRabbz',
  // })
  // @ApiOkResponse({ type: FooBarDto })
  // @Get('/getRabbz')
  // @BypassAuth()
  @ApiOperation({
    summary: 'getRabbz',
  })
  @ApiOkResponse({ type: FooBarDto })
  @Get('/getRabbz/:bob')
  @BypassAuth()
  async getRabbz(
    @Query() query: PaginationDto,
    @Param('bob') bob: string,
  ): Promise<FooBarDto> {
    return {
      foo: 4,
      bar: 'bar',
      bob: bob,
    }
  }

  @ApiOperation({
    summary: 'Finds all endorsement lists belonging to given tags',
  })
  @ApiOkResponse({ type: PaginatedEndorsementListDto })
  @Get()
  @BypassAuth()
  async findByTags(
    @Query() query: FindTagPaginationCombo,
  ): Promise<PaginatedEndorsementListDto> {
    return await this.endorsementListService.findListsByTags(
      // query parameters of length one are not arrays, we normalize all tags input to arrays here
      !Array.isArray(query.tags) ? [query.tags] : query.tags,
      query,
    )
  }

  @Scopes(EndorsementsScope.main)
  @ApiOperation({
    summary: 'Finds all endorsements for the currently authenticated user',
  })
  @ApiOkResponse({ type: PaginatedEndorsementDto })
  @Get('/endorsements')
  @Audit<PaginatedEndorsementDto>({
    resources: ({ data: endorsement }) => endorsement.map((e) => e.id),
    meta: ({ data: endorsement }) => ({ count: endorsement.length }),
  })
  async findEndorsements(
    @CurrentUser() user: User,
    @Query() query: PaginationDto,
  ): Promise<PaginatedEndorsementDto> {
    return await this.endorsementListService.findAllEndorsementsByNationalId(
      user.nationalId,
      query,
    )
  }

  @ApiOkResponse({
    description: 'Finds a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiOperation({ summary: 'Finds a single endorsements list by id' })
  @ApiParam({ name: 'listId', type: 'string' })
  @Scopes(EndorsementsScope.main)
  @Get(':listId')
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
  })
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
  @ApiOperation({ summary: 'Close a single endorsements list by id' })
  @ApiOkResponse({
    description: 'Close a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @Scopes(EndorsementsScope.main)
  @Put(':listId/close')
  @HasAccessGroup(AccessGroup.Owner)
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
  })
  async close(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.close(endorsementList)
  }

  @ApiOperation({ summary: 'Open a single endorsements list by id' })
  @ApiOkResponse({
    description: 'Open a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @Scopes(EndorsementsScope.main)
  @Put(':listId/open')
  @HasAccessGroup(AccessGroup.DMR)
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
  })
  async open(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.open(endorsementList)
  }
  @ApiOperation({ summary: 'Create an endorsements list' })
  @ApiOkResponse({
    description: 'Create an endorsements list',
    type: EndorsementList,
  })
  @ApiBody({ type: EndorsementListDto })
  @Scopes(EndorsementsScope.main)
  @Post()
  @Audit<EndorsementList>({
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
