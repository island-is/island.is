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
import { ApiTags } from '@nestjs/swagger'
import { BulkEndorsementDto } from './dto/bulkEndorsement.dto'
import { Endorsement } from './endorsement.model'
import { EndorsementService } from './endorsement.service'

@ApiTags('endorsement')
@Controller('endorsement-list/:listId/endorsement')
export class EndorsementController {
  constructor(private readonly endorsementService: EndorsementService) {}

  @Get()
  async findAll(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<Endorsement[]> {
    // TODO: Add auth here
    return await this.endorsementService.findEndorsements({ listId })
  }

  @Get('/exists')
  async findByUser(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<Endorsement> {
    // TODO: Add auth here
    return await this.endorsementService.findSingleEndorsementByNationalId({
      listId,
      nationalId: '0000000000',
    })
  }

  @Post()
  async create(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<Endorsement> {
    // TODO: Add auth here
    return await this.endorsementService.createEndorsementOnList({
      nationalId: '0101302989', // TODO: Replace this with requesting user
      listId,
    })
  }

  @Post('/bulk')
  async bulkCreate(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
    @Body() { nationalIds }: BulkEndorsementDto,
  ): Promise<Endorsement[]> {
    // TODO: Add auth here (only owner of list can bulk import)
    return await this.endorsementService.bulkCreateEndorsementOnList({
      nationalIds,
      listId,
    })
  }

  @Delete()
  @HttpCode(204)
  async delete(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<unknown> {
    // TODO: Add auth here
    await this.endorsementService.deleteFromListByNationalId({
      nationalId: '0000000000', // TODO: Replace this with requesting user
      listId,
    })
    return
  }
}
