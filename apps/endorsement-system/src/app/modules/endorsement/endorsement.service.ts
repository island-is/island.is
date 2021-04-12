import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Endorsement } from './endorsement.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

interface EndorsementListInput {
  listId: string
  nationalId: string
}
@Injectable()
export class EndorsementService {
  constructor(
    @InjectModel(Endorsement)
    private endorsementModel: typeof Endorsement,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findEndorsementByNationalId({
    nationalId,
    listId,
  }: EndorsementListInput) {
    this.logger.debug(
      `Finding endorsement in list "${listId}" by nationalId "${nationalId}"`,
    )

    return this.endorsementModel.findOne({
      where: { endorser: nationalId, endorsementListId: listId },
    })
  }

  async createEndorsementOnList({ listId, nationalId }: EndorsementListInput) {
    this.logger.debug(`Creating resource with nationalId - ${nationalId}`)

    // TODO: Prevent this from adding multiple endorsements to same list

    return this.endorsementModel.create({
      endorser: nationalId,
      endorsementListId: listId,
      meta: [], // TODO: Add list metadata here
    })
  }

  async deleteFromListByNationalId({
    nationalId,
    listId,
  }: EndorsementListInput) {
    this.logger.debug(
      `Removing endorsement from list "${listId}" by nationalId "${nationalId}"`,
    )
    // TODO: Prevent this from deleting from a closed list
    return this.endorsementModel.destroy({
      where: {
        endorser: nationalId,
        endorsementListId: listId,
      },
    })
  }
}
