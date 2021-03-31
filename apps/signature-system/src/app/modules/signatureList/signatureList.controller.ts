import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { SignatureList } from './signatureList.model'
import { SignatureListService } from './signatureList.service'
import { SignatureListDto } from './dto/signatureList.dto'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { FindSignatureListByTagDto } from './dto/findSignatureListsByTag.dto'

@ApiTags('signatureList')
@Controller('signature-list')
export class SignatureListController {
  constructor (private readonly signatureListService: SignatureListService) {}

  @Get()
  @ApiCreatedResponse({ type: SignatureList })
  async findLists (
    @Query() { tag }: FindSignatureListByTagDto,
  ): Promise<SignatureList[]> {
    // TODO: Add dto for tags here?
    // TODO: Add pagination
    return await this.signatureListService.findListsByTag(tag)
  }

  @Get(':id')
  @ApiCreatedResponse({ type: SignatureList })
  async findOne (@Param('id') id: string): Promise<SignatureList | null> {
    return await this.signatureListService.findSingleList(id)
  }

  @Get(':id/signatures')
  @ApiCreatedResponse({ type: SignatureList })
  async findSignatures (
    @Param('id') id: string,
  ): Promise<SignatureList | null> {
    // TODO: Add auth here
    // TODO: Add pagination
    return await this.signatureListService.findSingleListSignatures(id)
  }

  @Put(':id/close')
  @ApiCreatedResponse({ type: SignatureList })
  async close (@Param('id') id: string): Promise<SignatureList> {
    // TODO: Add auth here
    return await this.signatureListService.close(id)
  }

  @Post()
  @ApiCreatedResponse({ type: SignatureList })
  async create (
    @Body() signatureList: SignatureListDto,
  ): Promise<SignatureList> {
    // TODO: Add auth here
    return await this.signatureListService.create({
      ...signatureList,
      owner: '0000000000',
    })
  }
}
