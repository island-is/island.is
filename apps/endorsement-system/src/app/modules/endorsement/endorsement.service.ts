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
import { EndorsementMetadata } from '../endorsementMetadata/endorsementMetadata.model'

interface EndorsementListInput {
  listId: string
  nationalId: string
}
interface EndorsementListsInput {
  listId: string
  nationalIds: string[]
}
interface GetEndorsementMetadataForNationalIdInput {
  endorsementList: EndorsementList
  nationalId: string
}
interface ValidateEndorsementInput {
  endorsementList: EndorsementList
  nationalId: string
  metadata: EndorsementMetadata
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

  private getEndorsementList = async (listId: string) => {
    const endorsementList = await this.endorsementListModel.findOne({
      where: { id: listId },
    })
    if (!endorsementList) {
      throw new NotFoundException(`Failed to find endorsement list: ${listId}`)
    }
    return endorsementList
  }

  private getEndorsementMetadataForNationalId = async ({
    nationalId,
    endorsementList,
  }: GetEndorsementMetadataForNationalIdInput) => {
    // find all requested validation types
    const requestedValidationRules = endorsementList.validationRules.map(
      (validation) => validation.type,
    )
    // find all metadata fields required for these types of validations
    const metadataFieldsRequiredByValidation = this.validatorService.getRequiredValidationMetadataFields(
      requestedValidationRules,
    )
    // get all metadata required for this endorsement
    return this.metadataService.getMetadata({
      fields: [
        ...endorsementList.endorsementMeta,
        ...metadataFieldsRequiredByValidation,
      ],
      nationalId,
    })
  }

  private validateEndorsement = ({
    nationalId,
    endorsementList,
    metadata,
  }: ValidateEndorsementInput) => {
    // we want this validation for all endorsements (in case request is made on behalf of a company)
    if (!isPerson(nationalId)) {
      throw new BadRequestException('National id must be a person')
    }

    // run requested validators with fetched metadata
    const isValid = this.validatorService.validate({
      validations: endorsementList.validationRules,
      meta: { ...metadata, nationalId },
    })

    // throw error if not valid
    if (!isValid) {
      this.logger.debug('Failed validation rules', {
        listId: endorsementList.id,
        nationalId,
      })
      throw new BadRequestException('Failed list validation rules')
    }

    return true
  }

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
    const parentEndorsementList = await this.getEndorsementList(listId)

    // get all metadata required for this endorsement
    const allEndorsementMetadata = await this.getEndorsementMetadataForNationalId(
      { nationalId, endorsementList: parentEndorsementList },
    )

    // run requested validators with fetched metadata
    await this.validateEndorsement({
      endorsementList: parentEndorsementList,
      metadata: allEndorsementMetadata,
      nationalId,
    })

    return this.endorsementModel.create({
      endorser: nationalId,
      endorsementListId: listId,
      // this removes validation fields fetched by meta service
      meta: {
        ...this.metadataService.pruneMetadataFields(
          allEndorsementMetadata,
          parentEndorsementList.endorsementMeta,
        ),
        bulkEndorsement: false,
      },
    })
  }

  async bulkCreateEndorsementOnList({
    listId,
    nationalIds,
  }: EndorsementListsInput) {
    this.logger.debug('Creating resource with nationalIds:', nationalIds)

    // parent list contains rules and metadata field
    const parentEndorsementList = await this.getEndorsementList(listId)

    // create an endorsement document for each national id
    const endorsements = await Promise.all(
      nationalIds.map(async (nationalId) => {
        // get metadata for this national id
        const metadata = await this.getEndorsementMetadataForNationalId({
          nationalId,
          endorsementList: parentEndorsementList,
        })

        // run all validations for this national id
        await this.validateEndorsement({
          endorsementList: parentEndorsementList,
          metadata,
          nationalId,
        })

        return {
          endorser: nationalId,
          endorsementListId: parentEndorsementList.id,
          // this removes validation fields fetched by meta service
          meta: {
            ...this.metadataService.pruneMetadataFields(
              metadata,
              parentEndorsementList.endorsementMeta,
            ),
            bulkEndorsement: true,
          },
        }
      }),
    )

    return this.endorsementModel.bulkCreate(endorsements, {
      ignoreDuplicates: true, // this ignores existing endorsements conflicts
      returning: true,
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
