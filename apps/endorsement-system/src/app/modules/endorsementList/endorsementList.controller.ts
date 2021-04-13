import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { FindEndorsementListByTagDto } from './dto/findEndorsementListsByTag.dto'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Endorsement } from '../endorsement/endorsement.model'
import { FindEndorsementListDto } from './dto/findEndorsementLists.dto'

@ApiTags('endorsementList')
@Controller('endorsement-list')
export class EndorsementListController {
  constructor(
    private readonly endorsementListService: EndorsementListService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Get()
  async findLists(
    @Query() { tag }: FindEndorsementListByTagDto,
  ): Promise<EndorsementList[]> {
    // TODO: Add dto for tags here?
    // TODO: Add pagination
    return await this.endorsementListService.findListsByTag(tag)
  }

  @Get('/endorsements')
  async findEndorsements(): Promise<Endorsement[]> {
    // TODO: Add auth here
    // TODO: Add pagination
    const response = await this.endorsementListService.findAllEndorsementsByNationalId(
      '0000000000', // TODO: Replace with auth
    )

    console.log('response', response)

    return response
  }

  @Get(':listId')
  async findOne(
    @Param() { listId }: FindEndorsementListDto,
  ): Promise<EndorsementList> {
    const response = await this.endorsementListService.findSingleList(listId)
    if (!response) {
      throw new NotFoundException(['This endorsement list does not exist.'])
    } else {
      return response
    }
  }

  @Put(':listId/close')
  async close(
    @Param() { listId }: FindEndorsementListDto,
  ): Promise<EndorsementList> {
    // TODO: Add auth here
    const response = await this.endorsementListService.close(listId)
    if (!response) {
      this.logger.warn('Failed to close list', { listId })
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
