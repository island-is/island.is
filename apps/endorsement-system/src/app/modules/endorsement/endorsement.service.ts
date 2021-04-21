import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isPerson } from 'kennitala'
import { Endorsement } from './endorsement.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementMetadataService } from '../endorsementMetadata/endorsementMetadata.service'
import { EndorsementValidatorService } from '../endorsementValidator/endorsementValidator.service'

interface EndorsementListInput {
  listId: string
  nationalId: string
}
@Injectable()
export class EndorsementService {
  constructor(
    @InjectModel(EndorsementList)
    private readonly endorsementListModel: typeof EndorsementList,
    @InjectModel(Endorsement)
    private endorsementModel: typeof Endorsement,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly metadataService: EndorsementMetadataService,
    private readonly validatorService: EndorsementValidatorService,
  ) {}

  async findSingleEndorsementByNationalId({
    nationalId,
    listId,
  }: EndorsementListInput) {
    this.logger.debug(
      `Finding endorsement in list "${listId}" by nationalId "${nationalId}"`,
    )

    const result = await this.endorsementModel.findOne({
      where: { endorser: nationalId, endorsementListId: listId },
    })

    if (!result) {
      throw new NotFoundException(["This endorsement doesn't exist"])
    }

    return result
  }

  async createEndorsementOnList({ listId, nationalId }: EndorsementListInput) {
    this.logger.debug(`Creating resource with nationalId - ${nationalId}`)

    // parent list contains rules and metadata field
    const parentEndorsementList = await this.endorsementListModel.findOne({
      where: { id: listId },
    })
    if (!parentEndorsementList) {
      this.logger.debug('Failed to find endorsement list', {
        listId,
        nationalId,
      })
      throw new NotFoundException('Failed to find endorsement list')
    }

    // we can't add endorsement if it already exists in list
    const endorsementExistsInList = await this.findSingleEndorsementByNationalId(
      {
        listId,
        nationalId,
      },
    ).catch(() => false) // we return false if endorsement is not found
    if (endorsementExistsInList) {
      this.logger.debug('Endorsement already exists in list', {
        listId,
        nationalId,
      })
      throw new BadRequestException('Endorsement already exists in list')
    }

    // get all metadata required for this endorsement
    const allEndorsementMetadata = await this.metadataService.getMetadata({
      fields: parentEndorsementList.endorsementMeta, // TODO: Add fields required by validation here
      nationalId,
    })

    const isValid = this.validatorService.validate({
      validations: parentEndorsementList.validationRules,
      meta: { ...allEndorsementMetadata, nationalId },
    })
    if (!isValid || !isPerson(nationalId)) {
      this.logger.debug('Failed validation rules', {
        listId,
        nationalId,
      })
      throw new BadRequestException('Failed list validation rules')
    }

    return this.endorsementModel.create({
      endorser: nationalId,
      endorsementListId: listId,
      // this removes validation fields fetched by meta service
      meta: this.metadataService.pruneMetadataFields(
        allEndorsementMetadata,
        parentEndorsementList.endorsementMeta,
      ),
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
    const results = await this.endorsementModel.destroy({
      where: {
        endorser: nationalId,
        endorsementListId: listId,
      },
    })

    if (results === 0) {
      this.logger.warn(
        'Failed to remove endorsement for list, list might not exist',
        { listId },
      )
      throw new NotFoundException(["This endorsement doesn't exist"])
    }
  }
}
