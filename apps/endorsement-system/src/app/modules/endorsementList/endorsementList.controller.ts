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
import { ApiTags } from '@nestjs/swagger'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { FindEndorsementListByTagDto } from './dto/findEndorsementListsByTag.dto'
import { Endorsement } from '../endorsement/endorsement.model'

@ApiTags('endorsementList')
@Controller('endorsement-list')
export class EndorsementListController {
  constructor(
    private readonly endorsementListService: EndorsementListService,
  ) {}

  @Get()
  async findLists(
    @Query() { tag }: FindEndorsementListByTagDto,
  ): Promise<EndorsementList[]> {
    console.log('Hit!', tag)
    // TODO: Add dto for tags here?
    // TODO: Add pagination
    return await this.endorsementListService.findListsByTag(tag)
  }

  @Get('/endorsements')
  async findEndorsements(): Promise<Endorsement[]> {
    // TODO: Add auth here
    // TODO: Add pagination
    return await this.endorsementListService.findAllEndorsementsByNationalId(
      '0000000000', // TODO: Replace with auth
    )
  }

  @Get(':listId')
  async findOne(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.findSingleList(listId)
  }

  @Put(':listId/close')
  async close(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<EndorsementList> {
    // TODO: Add auth here
    return await this.endorsementListService.close(listId)
  }

  @Post()
  async create(
    @Body() endorsementList: EndorsementListDto,
  ): Promise<EndorsementList> {
    // TODO: Add auth here
    return await this.endorsementListService.create({
      ...endorsementList,
      owner: '0000000000',
    })
  }
}
