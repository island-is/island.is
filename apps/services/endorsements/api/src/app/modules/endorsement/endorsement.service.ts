import {
  BadRequestException,
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isPerson } from 'kennitala'
import { Endorsement } from './models/endorsement.model'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { EndorsementList } from '../endorsementList/endorsementList.model'
import { EndorsementMetadataService } from '../endorsementMetadata/endorsementMetadata.service'
import { EndorsementValidatorService } from '../endorsementValidator/endorsementValidator.service'
import { EndorsementMetadata } from '../endorsementMetadata/endorsementMetadata.model'
import { Op, UniqueConstraintError } from 'sequelize'
import { ValidationRuleDto } from '../endorsementList/dto/validationRule.dto'
import { EndorsementTag } from '../endorsementList/constants'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { ExistsEndorsementResponse } from './dto/existsEndorsement.response'

import { paginate } from '@island.is/nest/pagination'
import { ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS } from '../../../environments/environment'

import { EmailService } from '@island.is/email-service'
import PDFDocument from 'pdfkit'
import getStream from 'get-stream'
import model from 'sequelize/types/lib/model'
import { emailDto } from './dto/email.dto'

interface FindEndorsementInput {
  listId: string
  nationalId: string
}

interface EndorsementInput {
  endorsementList: EndorsementList
  nationalId: string
  showName: boolean
}

interface DeleteEndorsementInput {
  endorsementList: EndorsementList
  nationalId: string
}
interface EndorsementListsInput {
  endorsementList: EndorsementList
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

interface FindUserEndorsementsByTagsInput {
  nationalId: string
  tags: EndorsementTag[]
}

interface ProcessEndorsementInput {
  nationalId: string
  endorsementList: EndorsementList
  showName: boolean
}

export interface NationalIdError {
  nationalId: string
  message: string
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
    @Inject(EmailService)
    private emailService: EmailService,
  ) {}

  private getEndorsementMetadataForNationalId = async (
    { nationalId, endorsementList }: GetEndorsementMetadataForNationalIdInput,
    auth: Auth,
  ) => {
    // find all requested validation types
    const requestedValidationRules = endorsementList.validationRules.map(
      (validation) => validation.type,
    )
    // find all metadata fields required for these types of validations
    const metadataFieldsRequiredByValidation = this.validatorService.getRequiredValidationMetadataFields(
      requestedValidationRules,
    )

    // get all metadata required for this endorsement
    return this.metadataService.getMetadata(
      {
        fields: [
          ...endorsementList.endorsementMetadata.map(({ field }) => field),
          ...metadataFieldsRequiredByValidation,
        ],
        nationalId,
      },
      auth,
    )
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
        validationRules,
        metadata,
      })
      throw new BadRequestException('Failed list validation rules')
    }

    return true
  }

  private processEndorsement = async (
    { nationalId, endorsementList, showName }: ProcessEndorsementInput,
    auth: Auth,
  ) => {
    // get metadata for this national id
    const metadata = await this.getEndorsementMetadataForNationalId(
      {
        nationalId,
        endorsementList,
      },
      auth,
    )

    // run all validations for this national id
    await this.validateEndorsement({
      listId: endorsementList.id,
      validationRules: endorsementList.validationRules,
      metadata,
      nationalId,
    })

    const meta = this.metadataService.pruneMetadataFields(
      // apply metadata service pruning logic
      metadata, // the metadata we have e.g. {fullName: 'Some name', lastName: 'SomeOtherName'}
      endorsementList.endorsementMetadata.map(({ field }) => field), // the fields we want to keep e.g. ['fullName']
    )

    return {
      endorser: nationalId,
      endorsementListId: endorsementList.id,
      // this removes validation fields fetched by meta service
      meta: {
        ...meta, // add all allowed metadata fields
        ...(showName ? {} : { fullName: '' }), // if showName is false overwrite full name field),
        bulkEndorsement: false, // defaults to false we overwrite this value in bulk import
        showName: showName,
      },
    }
  }

  async findEndorsements({ listId }: FindEndorsementsInput, query: any) {
    this.logger.debug(`Finding endorsements by list id "${listId}"`)

    return await paginate({
      Model: this.endorsementModel,
      limit: query.limit || 10,
      after: query.after,
      before: query.before,
      primaryKeyField: 'counter',
      orderOption: [['counter', 'DESC']],
      where: { endorsementListId: listId },
    })
  }

  async findEndorsementsGeneralPetition(
    { listId }: FindEndorsementsInput,
    query: any,
  ) {
    // check if list exists and belongs to general petitions
    const result = await this.endorsementListModel.findOne({
      where: {
        id: listId,
        tags: { [Op.eq]: ENDORSEMENT_SYSTEM_GENERAL_PETITION_TAGS },
      },
    })
    if (!result) {
      throw new NotFoundException(['Not found - not a General Petition List'])
    }
    return this.findEndorsements({ listId }, query)
  }

  async findSingleUserEndorsement({
    nationalId,
    listId,
  }: FindEndorsementInput) {
    this.logger.debug(
      `Finding endorsement in list "${listId}" by nationalId "${nationalId}"`,
    )

    const result = await this.endorsementModel.findOne({
      where: { endorser: nationalId, endorsementListId: listId },
    })

    if (!result) {
      return { hasEndorsed: false }
    }

    return { hasEndorsed: true }
  }

  async findUserEndorsementsByTags({
    nationalId,
    tags,
  }: FindUserEndorsementsByTagsInput) {
    this.logger.debug(
      `Finding endorsements by tags "${tags.join(
        ', ',
      )}" for user "${nationalId}"`,
    )

    return await this.endorsementModel.findAll({
      where: { endorser: nationalId },
      include: [
        { model: EndorsementList, where: { tags: { [Op.overlap]: tags } } },
      ],
    })
  }

  // FIXME: Find a way to combine with create bulk endorsements
  async createEndorsementOnList(
    { endorsementList, nationalId, showName }: EndorsementInput,
    auth: User,
  ) {
    this.logger.debug(`Creating resource with nationalId - ${nationalId}`)

    // we don't allow endorsements on closed lists
    if (new Date() >= endorsementList.closedDate) {
      throw new MethodNotAllowedException(['Unable to endorse closed list'])
    }

    const endorsement = await this.processEndorsement(
      {
        nationalId: auth.nationalId,
        endorsementList,
        showName: showName,
      },
      auth,
    )

    return this.endorsementModel.create(endorsement).catch((error) => {
      // map meaningful sequelize errors to custom errors, else return error
      switch (error.constructor) {
        case UniqueConstraintError: {
          throw new MethodNotAllowedException([
            'Endorsement already exists in list',
          ])
        }
        default: {
          throw error
        }
      }
    })
  }

  // FIXME: Find a way to combine with create single endorsement
  async bulkCreateEndorsementOnList(
    { nationalIds, endorsementList }: EndorsementListsInput,
    auth: Auth,
  ) {
    this.logger.debug('Creating resource with nationalIds:', nationalIds)

    // we don't allow endorsements on closed lists
    if (new Date() >= endorsementList.closedDate) {
      throw new MethodNotAllowedException(['Unable to endorse closed list'])
    }

    const failedNationalIds: NationalIdError[] = []

    // create an endorsement document for each national id
    const endorsements = await Promise.all(
      nationalIds.map(async (nationalId) => {
        const endorsement = await this.processEndorsement(
          {
            nationalId,
            endorsementList,
            showName: true,
          },
          auth,
        ).catch((error: Error) => {
          // we swallow the error here and return undefined
          failedNationalIds.push({
            nationalId,
            message: error.message,
          })
          return undefined
        })

        // we return false here to be able to remove this result from the bulk create query
        if (!endorsement) {
          return false
        }

        return {
          ...endorsement,
          meta: { ...endorsement.meta, bulkEndorsement: true }, // we overwrite the bulk import value
        }
      }),
    )

    const validEndorsements = endorsements.filter(
      (endorsement): endorsement is Exclude<typeof endorsement, false> =>
        Boolean(endorsement),
    )

    const createdEndorsements = await this.endorsementModel.bulkCreate(
      validEndorsements,
      {
        ignoreDuplicates: true, // this ignores endorsements that would cause unique constraint errors when inserting into this list
        returning: true,
      },
    )

    return {
      succeeded: createdEndorsements,
      failed: failedNationalIds,
    }
  }

  async deleteFromListByNationalId({
    nationalId,
    endorsementList,
  }: DeleteEndorsementInput) {
    this.logger.debug(
      `Removing endorsement from list "${endorsementList.id}" by nationalId "${nationalId}"`,
    )

    // we don't allow endorsements on closed lists
    if (new Date() >= endorsementList.closedDate) {
      throw new MethodNotAllowedException([
        'Unable to remove endorsement form closed list',
      ])
    }

    const results = await this.endorsementModel.destroy({
      where: {
        endorser: nationalId,
        endorsementListId: endorsementList.id,
      },
    })

    if (results === 0) {
      this.logger.warn(
        'Failed to remove endorsement from list, endorsement does not exist',
        { listId: endorsementList.id },
      )
      throw new NotFoundException(["This endorsement doesn't exist"])
    }
  }

  async createDocumentBuffer(endorsementList: any) {
    // build pdf
    const doc = new PDFDocument()
    const locale = 'is-IS'
    const big = 16
    const regular = 8
    doc
      .fontSize(big)
      .text('ISLAND.IS - þetta skjal og kerfi er í vinnslu')
      .fontSize(regular)
      .text(
        'þetta skjal var framkallað sjálfvirkt þann: ' +
          new Date().toLocaleDateString(locale),
      )
      .moveDown()
      .fontSize(big)
      .text('Meðmælendalisti')
      .fontSize(regular)
      .text('id: ' + endorsementList.id)
      .text('titill: ' + endorsementList.title)
      .text('lýsing: ' + endorsementList.description)
      .text('eigandi: ' + endorsementList.owner)
      .text(
        'listi opnaður: ' +
          endorsementList.openedDate.toLocaleDateString(locale),
      )
      .text(
        'listi lokaður: ' +
          endorsementList.closedDate.toLocaleDateString(locale),
      )
      .text(`Alls undirskriftir: ${endorsementList.endorsements.length}`)
      .moveDown()
    if (endorsementList.endorsements.length) {
      doc.fontSize(big).text('Meðmælendur').fontSize(regular)
      for (const val of endorsementList.endorsements) {
        doc.text(
          val.created.toLocaleDateString(locale) + ' ' + val.meta.fullName,
        )
      }
    }
    doc.end()
    return await getStream.buffer(doc)
  }

  async emailPDF(
    listId: string,
    recipientEmail: string,
  ): Promise<{ success: boolean }> {
    // OWNERNAME
    const endorsementList = await this.endorsementListModel.findOne({
      where: { id: listId },
      include: [
        {
          model: Endorsement,
        },
      ],
    })
    try {
      const result = this.emailService.sendEmail({
        from: {
          name: 'TEST:Meðmælendakerfi island.is',
          address: 'noreply@island.is',
        },
        to: [
          {
            // message can be sent to any email so recipient name is unknown
            name: recipientEmail,
            address: recipientEmail,
          },
        ],
        subject: 'TEST:Afrit af meðmælendalista',
        template: {
          title: 'Afrit af meðmælendalista',
          body: [
            {
              component: 'Heading',
              context: { copy: 'Afrit af meðmælendalista' },
            },
            { component: 'Copy', context: { copy: 'Góðan dag.' } },
            {
              component: 'Copy',
              context: {
                copy: `... copy copy copy`,
              },
            },
            {
              component: 'Copy',
              context: {
                copy: `Þetta kjal er í þróun ...`,
              },
            },
            {
              component: 'Button',
              context: {
                copy: 'Takki',
                href: 'http://www.island.is',
              },
            },
            { component: 'Copy', context: { copy: 'Með kveðju,' } },
            { component: 'Copy', context: { copy: 'TEST' } },
          ],
        },
        attachments: [
          {
            filename: 'Meðmælendalisti.pdf',
            content: await this.createDocumentBuffer(endorsementList),
          },
        ],
      })
      return { success: true }
    } catch (error) {
      this.logger.error('Failed to send email', error)
      return { success: false }
    }
  }
}
