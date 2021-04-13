import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Endorsement } from './endorsement.model'
import { EndorsementService } from './endorsement.service'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import * as faker from 'faker'

@ApiTags('endorsement')
@Controller('endorsement-list/:listId/endorsement')
export class EndorsementController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly endorsementService: EndorsementService,
  ) {}

  @Get()
  async findOne(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<Endorsement> {
    // TODO: Add auth here
    const endorsement = await this.endorsementService.findSingleEndorsementByNationalId(
      {
        nationalId: '0000000000', // TODO: Replace this with requesting user
        listId,
      },
    )

    if (!endorsement) {
      throw new NotFoundException(["This endorsement doesn't exist"])
    }

    return endorsement
  }

  @Post()
  async create(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<Endorsement> {
    // TODO: Add auth here
    try {
      return await this.endorsementService.createEndorsementOnList({
        nationalId: faker.phone.phoneNumber('##########'), // TODO: Replace this with requesting user
        listId,
      })
    } catch (error) {
      this.logger.error('Failed to create endorsement for list', {
        listId,
        error,
      })

      throw new NotFoundException(["This list doesn't exist"]) // TODO: Improve error response here in development
    }
  }

  @Delete()
  @HttpCode(204)
  async delete(
    @Param('listId', new ParseUUIDPipe({ version: '4' })) listId: string,
  ): Promise<unknown> {
    // TODO: Add auth here
    const endorsement = await this.endorsementService.deleteFromListByNationalId(
      {
        nationalId: '0000000000', // TODO: Replace this with requesting user
        listId,
      },
    )

    if (endorsement === 0) {
      this.logger.warn(
        'Failed to remove endorsement for list, list might not exist',
        { listId },
      )
      throw new NotFoundException(["This endorsement doesn't exist"])
    }

    return
  }
}
