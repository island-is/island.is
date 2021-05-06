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
import { ApiOAuth2, ApiParam, ApiTags } from '@nestjs/swagger'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementListByIdPipe } from '../endorsementList/pipes/endorsementListById.pipe'
import { IsEndorsementListOwnerValidationPipe } from '../endorsementList/pipes/isEndorsementListOwnerValidation.pipe'
import { BulkEndorsementDto } from './dto/bulkEndorsement.dto'
import { Endorsement } from './endorsement.model'
import { EndorsementService } from './endorsement.service'

@ApiTags('endorsement')
@ApiOAuth2([])
@Controller('endorsement-list/:listId/endorsement')
export class EndorsementController {
  constructor(private readonly endorsementService: EndorsementService) {}

  @Get()
  @ApiParam({ name: 'listId', type: 'string' })
  async findAll(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<Endorsement[]> {
    return await this.endorsementService.findEndorsements({
      listId: endorsementList.id,
    })
  }

  @Get('/exists')
  @ApiParam({ name: 'listId', type: 'string' })
  async findByUser(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementService.findSingleUserEndorsement({
      listId: endorsementList.id,
      nationalId: user.nationalId,
    })
  }

  @Post()
  @ApiParam({ name: 'listId', type: 'string' })
  async create(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementService.createEndorsementOnList({
      nationalId: user.nationalId,
      endorsementList,
    })
  }

  @Post('/bulk')
  @ApiParam({ name: 'listId', type: 'string' })
  async bulkCreate(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
      IsEndorsementListOwnerValidationPipe,
    )
    endorsementList: EndorsementList,
    @Body() { nationalIds }: BulkEndorsementDto,
  ): Promise<Endorsement[]> {
    return await this.endorsementService.bulkCreateEndorsementOnList({
      nationalIds,
      endorsementList,
    })
  }

  @Delete()
  @HttpCode(204)
  @ApiParam({ name: 'listId', type: 'string' })
  async delete(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
    @CurrentUser() user: User,
  ): Promise<unknown> {
    await this.endorsementService.deleteFromListByNationalId({
      nationalId: user.nationalId,
      endorsementList,
    })
    return
  }
}
