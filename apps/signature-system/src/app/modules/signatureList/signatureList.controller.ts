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
import { SignatureList } from './signatureList.model'
import { SignatureListService } from './signatureList.service'
import { SignatureListDto } from './dto/signatureList.dto'
import { ApiTags } from '@nestjs/swagger'
import { FindSignatureListByTagDto } from './dto/findSignatureListsByTag.dto'

@ApiTags('signatureList')
@Controller('signature-list')
export class SignatureListController {
  constructor(private readonly signatureListService: SignatureListService) {}

  @Get()
  async findLists(
    @Query() { tag }: FindSignatureListByTagDto,
  ): Promise<SignatureList[]> {
    // TODO: Add dto for tags here?
    // TODO: Add pagination
    return await this.signatureListService.findListsByTag(tag)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SignatureList> {
    const response = await this.signatureListService.findSingleList(id)
    if (!response) {
      throw new NotFoundException(['This signature list does not exist.'])
    } else {
      return response
    }
  }

  @Get(':id/signatures')
  async findSignatures(@Param('id') id: string): Promise<SignatureList> {
    // TODO: Add auth here
    // TODO: Add pagination
    const response = await this.signatureListService.findSingleListSignatures(
      id,
    )
    if (!response) {
      throw new NotFoundException(['This signature list does not exist.'])
    } else {
      return response
    }
  }

  @Put(':id/close')
  async close(@Param('id') id: string): Promise<SignatureList> {
    // TODO: Add auth here
    const response = await this.signatureListService.close(id)
    if (!response) {
      throw new NotFoundException(['This signature list does not exist.'])
    } else {
      return response
    }
  }

  @Post()
  async create(
    @Body() signatureList: SignatureListDto,
  ): Promise<SignatureList> {
    // TODO: Add auth here
    return await this.signatureListService.create({
      ...signatureList,
      owner: '0000000000',
    })
  }
}
