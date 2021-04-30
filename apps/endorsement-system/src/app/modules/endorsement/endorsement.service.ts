import {
  BadRequestException,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isPerson } from 'kennitala'
import { Endorsement } from './endorsement.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  EndorsementList,
  EndorsementTag,
} from '../endorsementList/endorsementList.model'
import { EndorsementMetadataService } from '../endorsementMetadata/endorsementMetadata.service'
import {
  EndorsementValidatorService,
  ValidationRule,
} from '../endorsementValidator/endorsementValidator.service'
import { EndorsementMetadata } from '../endorsementMetadata/endorsementMetadata.model'
import { Op, Sequelize } from 'sequelize'
import { ValidationRuleDto } from '../endorsementList/dto/validationRule.dto'

interface EndorsementInput {
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
  listId: string
  validationRules: ValidationRuleDto[]
  nationalId: string
  metadata: EndorsementMetadata
}

interface FindEndorsementsInput {
  listId: string
}

interface InvalidateEndorsementsInput {
  nationalId: string
  tags: EndorsementTag[]
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
    listId,
    validationRules,
    metadata,
  }: ValidateEndorsementInput) => {
    // we want this validation for all endorsements (in case request is made on behalf of a company)
    if (!isPerson(nationalId)) {
      throw new BadRequestException('National id must be a person')
    }

    // run requested validators with fetched metadata
    const isValid = this.validatorService.validate({
      validations: validationRules,
      meta: { ...metadata, nationalId },
    })

    // throw error if not valid
    if (!isValid) {
      this.logger.debug('Failed validation rules', {
        listId: listId,
        nationalId,
      })
      throw new BadRequestException('Failed list validation rules')
    }

    return true
  }

  private invalidateEndorsementsIfExist = async (
    input: InvalidateEndorsementsInput,
  ) => {
    const endorsementsToInvalidate = await this.findUserEndorsementsByTags(
      input,
    )

    // we have no endorsements to invalidate, return false to indicate so
    if (!endorsementsToInvalidate.length) {
      return false
    }

    await Promise.all(
      endorsementsToInvalidate.map((endorsement) => {
        return endorsement.update({
          meta: Sequelize.literal(
            `meta || '${JSON.stringify({ invalidated: true })}'`, // || operator in postgres concatenates objects in jsonb fields
          ),
        })
      }),
    )

    return true
  }

  async findEndorsements({ listId }: FindEndorsementsInput) {
    this.logger.debug(`Finding endorsements by list id "${listId}"`)

    const result = await this.endorsementListModel.findOne({
      where: { id: listId },
      include: [Endorsement],
    })

    if (!result || !result.endorsements) {
      throw new NotFoundException(["This endorsement list doesn't exist"])
    }

    return result.endorsements
  }

  async findSingleUserEndorsement({ nationalId, listId }: EndorsementInput) {
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

  async findUserEndorsementsByTags({
    nationalId,
    tags,
  }: InvalidateEndorsementsInput) {
    this.logger.debug(
      `Finding endorsements by tags "${tags.join(
        ', ',
      )}" for user "${nationalId}"`,
    )

    return await this.endorsementModel.findAll({
      where: { endorser: nationalId },
      include: [
        { model: EndorsementList, where: { tags: { [Op.contains]: tags } } },
      ],
    })
  }

  async createEndorsementOnList({ listId, nationalId }: EndorsementInput) {
    this.logger.debug(`Creating resource with nationalId - ${nationalId}`)

    // parent list contains rules and metadata field
    const parentEndorsementList = await this.getEndorsementList(listId)

    // we don't allow endorsements on closed lists
    if (parentEndorsementList.closedDate) {
      throw new MethodNotAllowedException(['Unable to endorse closed list'])
    }

    // get all metadata required for this endorsement
    const allEndorsementMetadata = await this.getEndorsementMetadataForNationalId(
      { nationalId, endorsementList: parentEndorsementList },
    )

    // run requested validators with fetched metadata
    await this.validateEndorsement({
      listId: parentEndorsementList.id,
      validationRules: parentEndorsementList.validationRules,
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
        invalidated: false,
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

    // we don't allow endorsements on closed lists
    if (parentEndorsementList.closedDate) {
      throw new MethodNotAllowedException(['Unable to endorse closed list'])
    }

    // create an endorsement document for each national id
    const endorsements = await Promise.all(
      nationalIds.map(async (nationalId) => {
        // get metadata for this national id
        const metadata = await this.getEndorsementMetadataForNationalId({
          nationalId,
          endorsementList: parentEndorsementList,
        })

        // we remove unique within tag cause bulk imports invalidate existing signatures
        const bulkValidationRules = parentEndorsementList.validationRules.filter(
          (rule) => rule.type !== ValidationRule.UNIQUE_WITHIN_TAGS,
        )
        // run all validations for this national id
        await this.validateEndorsement({
          listId: parentEndorsementList.id,
          validationRules: bulkValidationRules,
          metadata,
          nationalId,
        })

        /**
         * Bulk imported endorsement might already exist.
         * If we find an endorsement belonging to the same set of tags as the bulk imported endorsement
         * all endorsements are invalidated as instructed by the Ministry of Justice
         */
        const invalidated = await this.invalidateEndorsementsIfExist({
          nationalId,
          tags: parentEndorsementList.tags,
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
            invalidated,
          },
        }
      }),
    )

    return this.endorsementModel.bulkCreate(endorsements, {
      ignoreDuplicates: true, // this ignores existing endorsements in this list conflicting
      returning: true,
    })
  }

  async deleteFromListByNationalId({ nationalId, listId }: EndorsementInput) {
    this.logger.debug(
      `Removing endorsement from list "${listId}" by nationalId "${nationalId}"`,
    )

    // parent list contains rules and metadata field
    const parentEndorsementList = await this.getEndorsementList(listId)

    // we don't allow endorsements on closed lists
    if (parentEndorsementList.closedDate) {
      throw new MethodNotAllowedException([
        'Unable to remove endorsement form closed list',
      ])
    }

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
