import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { ApiTags } from '@nestjs/swagger'
import { FindEndorsementListByTagDto } from './dto/findEndorsementListsByTag.dto'

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
    // TODO: Add dto for tags here?
    // TODO: Add pagination
    return await this.endorsementListService.findListsByTag(tag)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EndorsementList> {
    const response = await this.endorsementListService.findSingleList(id)
    if (!response) {
      throw new NotFoundException(['This endorsement list does not exist.'])
    } else {
      return response
    }
  }

  @Get(':id/endorsements')
  async findEndorsements(@Param('id') id: string): Promise<EndorsementList> {
    // TODO: Add auth here
    // TODO: Add pagination
    const response = await this.endorsementListService.findSingleListEndorsements(
      id,
    )
    if (!response) {
      throw new NotFoundException(['This endorsement list does not exist.'])
    } else {
      return response
    }
  }

  @Put(':id/close')
  async close(@Param('id') id: string): Promise<EndorsementList> {
    // TODO: Add auth here
    const response = await this.endorsementListService.close(id)
    if (!response) {
      throw new NotFoundException(['This endorsement list does not exist.'])
    } else {
      return response
    }
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
