import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Endorsement } from './endorsement.model'
import { EndorsementService } from './endorsement.service'

@ApiTags('endorsement')
@Controller('endorsement-list/:listId/endorsement')
export class EndorsementController {
  constructor(private readonly endorsementService: EndorsementService) {}

  @Get()
  async findOne(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<Endorsement> {
    // TODO: Add auth here
    return await this.endorsementService.findSingleEndorsementByNationalId({
      nationalId: '0000000000', // TODO: Replace this with requesting user
      listId,
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
