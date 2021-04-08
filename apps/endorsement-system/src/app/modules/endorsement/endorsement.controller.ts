import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Endorsement } from './endorsement.model'
import { EndorsementService } from './endorsement.service'
import { EndorsementDto } from './dto/endorsement.dto'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@ApiTags('endorsement')
@Controller('endorsement-list/:listId/endorsement')
export class EndorsementController {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly endorsementService: EndorsementService,
  ) {}

  @Get()
  async findOne(@Param() { listId }: EndorsementDto): Promise<Endorsement> {
    // TODO: Add auth here
    const endorsement = await this.endorsementService.findEndorsementByNationalId(
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
  async create(@Param() { listId }: EndorsementDto): Promise<Endorsement> {
    // TODO: Add auth here
    // TODO: Validate rules here
    try {
      return await this.endorsementService.createEndorsementOnList({
        nationalId: '0000000000', // TODO: Replace this with requesting user
        listId,
      })
    } catch (error) {
      this.logger.warn('Failed to create endorsement for list', { listId })
      throw new NotFoundException(["This list doesn't exist"])
    }
  }

  @Delete()
  async delete(@Param() { listId }: EndorsementDto): Promise<boolean> {
    // TODO: Add auth here
    const endorsement = await this.endorsementService.deleteFromListByNationalId(
      {
        nationalId: '0000000000', // TODO: Replace this with requesting user
        listId,
      },
    )

    if (endorsement === 0) {
      this.logger.warn('Failed to remove endorsement for list', { listId })
      throw new NotFoundException(["This endorsement doesn't exist"])
    }

    return endorsement > 0
  }
}
