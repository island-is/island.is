import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Endorsement } from './endorsement.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Op } from 'sequelize'

interface FindEndorsementsByNationalIdInput {
  nationalId: string
  listId?: string
}

interface CreateEndorsementOnListInput {
  listId: string
  nationalId: string
}

interface DeleteFromListByNationalIdInput {
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

  async findEndorsementsByNationalId({
    nationalId,
    listId,
  }: FindEndorsementsByNationalIdInput) {
    this.logger.debug(
      `Finding endorsement in list "${listId}" by nationalId "${nationalId}"`,
    )

    // we get all endorsements for given national id and optionally scope that to a list (returns single nationalId in the given list)
    const whereConditions: object[] = [
      { endorser: nationalId },
      ...(listId ? [{ endorsementListId: listId }] : []),
    ]

    return this.endorsementModel.findAll({
      where: { [Op.and]: whereConditions },
    })
  }

  async createEndorsementOnList({
    listId,
    nationalId,
  }: CreateEndorsementOnListInput) {
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
  }: DeleteFromListByNationalIdInput) {
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
