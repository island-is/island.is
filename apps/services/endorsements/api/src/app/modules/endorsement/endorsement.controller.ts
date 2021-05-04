import { CurrentUser, User } from '@island.is/auth-nest-tools'
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
    @CurrentUser() user: User,
  ): Promise<Endorsement[]> {
    return await this.endorsementService.findEndorsements({ listId })
  }

  @Get('/exists')
  async findByUser(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementService.findSingleUserEndorsement({
      listId,
      nationalId: user.nationalId,
    })
  }

  @Post()
  async create(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementService.createEndorsementOnList({
      nationalId: user.nationalId,
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
    @CurrentUser() user: User,
  ): Promise<unknown> {
    await this.endorsementService.deleteFromListByNationalId({
      nationalId: user.nationalId,
      listId,
    })
    return
  }
}
