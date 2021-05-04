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
import { ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { FindEndorsementListByTagDto } from './dto/findEndorsementListsByTag.dto'
import { Endorsement } from '../endorsement/endorsement.model'
import { BypassAuth, CurrentUser, User } from '@island.is/auth-nest-tools'

@ApiTags('endorsementList')
@Controller('endorsement-list')
@ApiOAuth2([])
export class EndorsementListController {
  constructor(
    private readonly endorsementListService: EndorsementListService,
  ) {}

  @BypassAuth()
  @Get()
  async findLists(
    @Query() { tag }: FindEndorsementListByTagDto,
  ): Promise<EndorsementList[]> {
    // TODO: Add pagination
    return await this.endorsementListService.findListsByTag(tag)
  }

  /**
   * This exists so we can return all endorsements for user across all lists
   */
  @Get('/endorsements')
  async findEndorsements(@CurrentUser() user: User): Promise<Endorsement[]> {
    // TODO: Add pagination
    return await this.endorsementListService.findAllEndorsementsByNationalId(
      user.nationalId,
    )
  }

  @Get(':listId')
  async findOne(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.findSingleList(listId)
  }

  // TODO: Add is owner check here
  @Put(':listId/close')
  async close(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.close(listId)
  }

  @Post()
  async create(
    @Body() endorsementList: EndorsementListDto,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    // TODO: Add auth here
    return await this.endorsementListService.create({
      ...endorsementList,
      owner: user.nationalId,
    })
  }
}
