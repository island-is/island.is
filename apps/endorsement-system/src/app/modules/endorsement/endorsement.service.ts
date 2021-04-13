import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Endorsement } from './endorsement.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  EndorsementMetaField,
  MetadataService,
} from '../metadata/metadata.service'
import { EndorsementList } from '../endorsementList/endorsementList.model'

interface EndorsementListInput {
  listId: string
  nationalId: string
}
@Injectable()
export class EndorsementService {
  constructor (
    @InjectModel(EndorsementList)
    private readonly endorsementListModel: typeof EndorsementList,
    @InjectModel(Endorsement)
    private endorsementModel: typeof Endorsement,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly metadataService: MetadataService,
  ) {}

  async findSingleEndorsementByNationalId ({
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

  async createEndorsementOnList ({ listId, nationalId }: EndorsementListInput) {
    this.logger.debug(`Creating resource with nationalId - ${nationalId}`)

    // TODO: Prevent this from adding multiple endorsements to same list
    // parent list is used to evaluate rules and metadata
    const parentEndorsementList = await this.endorsementListModel.findOne({
      where: { id: listId },
    })

    if (!parentEndorsementList) {
      throw new Error('Failed to find parent endorsement list')
    }
    const allEndorsementMetadata = await this.metadataService.getMetadata({
      fields: parentEndorsementList.endorsementMeta, // TODO: Add fields required by validation here
      nationalId,
    })
    // TODO: Validate rules here

    // some meta fields are only required for validation and should not be persisted, we remove them here
    const prunedEndorsementMetadata = Object.entries(
      allEndorsementMetadata,
    ).reduce(
      (metadata, [metadataKey, metadataValue]) =>
        parentEndorsementList.endorsementMeta.includes(
          metadataKey as EndorsementMetaField,
        )
          ? {
              ...metadata,
              [metadataKey]: metadataValue,
            }
          : metadata,
      {},
    )

    return this.endorsementModel.create({
      endorser: nationalId,
      endorsementListId: listId,
      meta: prunedEndorsementMetadata,
    })
  }

  async deleteFromListByNationalId ({
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
