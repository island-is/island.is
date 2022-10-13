import { Op } from 'sequelize'
import CryptoJS from 'crypto-js'
import { Sequelize } from 'sequelize-typescript'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CaseFileState,
  CaseOrigin,
  CaseState,
  UserRole,
} from '@island.is/judicial-system/types'

import { uuidFactory } from '../../factories'
import { CaseEvent, EventService } from '../event'
import { Institution } from '../institution'
import { User, UserService } from '../user'
import { Defendant, DefendantService } from '../defendant'
import { CaseFile, FileService } from '../file'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { oldFilter } from './filters/case.filters'
import { Case } from './models/case.model'
import { CaseArchive } from './models/caseArchive.model'
import { ArchiveResponse } from './models/archive.response'
import { caseModuleConfig } from './case.config'

const caseEncryptionProperties: (keyof Case)[] = [
  'description',
  'demands',
  'lawsBroken',
  'legalBasis',
  'requestedOtherRestrictions',
  'caseFacts',
  'legalArguments',
  'prosecutorOnlySessionRequest',
  'comments',
  'caseFilesComments',
  'courtAttendees',
  'prosecutorDemands',
  'courtDocuments',
  'sessionBookings',
  'courtCaseFacts',
  'introduction',
  'courtLegalArguments',
  'ruling',
  'conclusion',
  'endOfSessionBookings',
  'accusedAppealAnnouncement',
  'prosecutorAppealAnnouncement',
  'caseModifiedExplanation',
  'caseResentExplanation',
]

const defendantEncryptionProperties: (keyof Defendant)[] = [
  'nationalId',
  'name',
  'address',
]

const caseFileEncryptionProperties: (keyof CaseFile)[] = ['name', 'key']

function collectEncryptionProperties(
  properties: string[],
  unknownSource: unknown,
): [{ [key: string]: string | null }, { [key: string]: unknown }] {
  const source = unknownSource as { [key: string]: unknown }
  return properties.reduce<
    [{ [key: string]: string | null }, { [key: string]: unknown }]
  >(
    (data, property) => [
      {
        ...data[0],
        [property]: typeof source[property] === 'string' ? '' : null,
      },
      { ...data[1], [property]: source[property] },
    ],
    [{}, {}],
  )
}

@Injectable()
export class InternalCaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @InjectModel(CaseArchive)
    private readonly caseArchiveModel: typeof CaseArchive,
    @Inject(caseModuleConfig.KEY)
    private readonly config: ConfigType<typeof caseModuleConfig>,
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(caseToCreate: InternalCreateCaseDto): Promise<Case> {
    let prosecutorId: string | undefined
    let courtId: string | undefined

    if (caseToCreate.prosecutorNationalId) {
      const prosecutor = await this.userService.findByNationalId(
        caseToCreate.prosecutorNationalId,
      )

      if (!prosecutor || prosecutor.role !== UserRole.PROSECUTOR) {
        throw new BadRequestException(
          `User ${
            prosecutor?.id ?? 'unknown'
          } is not registered as a prosecutor`,
        )
      }

      prosecutorId = prosecutor.id
      courtId = prosecutor.institution?.defaultCourtId
    }

    return this.sequelize.transaction(async (transaction) => {
      return this.caseModel
        .create(
          {
            ...caseToCreate,
            origin: CaseOrigin.LOKE,
            creatingProsecutorId: prosecutorId,
            prosecutorId,
            courtId,
          },
          { transaction },
        )
        .then((theCase) =>
          this.defendantService.create(
            theCase.id,
            {
              nationalId: caseToCreate.accusedNationalId,
              name: caseToCreate.accusedName,
              gender: caseToCreate.accusedGender,
              address: caseToCreate.accusedAddress,
            },
            transaction,
          ),
        )
        .then(
          (defendant) =>
            this.caseModel.findByPk(defendant.caseId, {
              include: [
                { model: Institution, as: 'court' },
                {
                  model: User,
                  as: 'creatingProsecutor',
                  include: [{ model: Institution, as: 'institution' }],
                },
                {
                  model: User,
                  as: 'prosecutor',
                  include: [{ model: Institution, as: 'institution' }],
                },
              ],
              transaction,
            }) as Promise<Case>,
        )
    })
  }

  async archive(): Promise<ArchiveResponse> {
    const theCase = await this.caseModel.findOne({
      include: [
        { model: Defendant, as: 'defendants' },
        {
          model: CaseFile,
          as: 'caseFiles',
          required: false,
          where: { state: { [Op.not]: CaseFileState.DELETED } },
        },
      ],
      order: [
        [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
        [{ model: CaseFile, as: 'caseFiles' }, 'created', 'ASC'],
      ],
      where: {
        isArchived: false,
        [Op.or]: [{ state: CaseState.DELETED }, oldFilter],
      },
    })

    if (!theCase) {
      return { caseArchived: false }
    }

    await this.sequelize.transaction(async (transaction) => {
      const [clearedCaseProperties, caseArchive] = collectEncryptionProperties(
        caseEncryptionProperties,
        theCase,
      )

      const defendantsArchive = []
      for (const defendant of theCase.defendants ?? []) {
        const [
          clearedDefendantProperties,
          defendantArchive,
        ] = collectEncryptionProperties(
          defendantEncryptionProperties,
          defendant,
        )
        defendantsArchive.push(defendantArchive)

        await this.defendantService.update(
          theCase.id,
          defendant.id,
          clearedDefendantProperties,
          transaction,
        )
      }

      const caseFilesArchive = []
      for (const caseFile of theCase.caseFiles ?? []) {
        const [
          clearedCaseFileProperties,
          caseFileArchive,
        ] = collectEncryptionProperties(caseFileEncryptionProperties, caseFile)
        caseFilesArchive.push(caseFileArchive)

        await this.fileService.updateCaseFile(
          theCase.id,
          caseFile.id,
          clearedCaseFileProperties,
          transaction,
        )
      }

      await this.caseArchiveModel.create(
        {
          caseId: theCase.id,
          archive: CryptoJS.AES.encrypt(
            JSON.stringify({
              ...caseArchive,
              defendants: defendantsArchive,
              caseFiles: caseFilesArchive,
            }),
            this.config.archiveEncryptionKey,
            { iv: CryptoJS.enc.Hex.parse(uuidFactory()) },
          ).toString(),
        },
        { transaction },
      )

      await this.caseModel.update(
        { ...clearedCaseProperties, isArchived: true },
        { where: { id: theCase.id }, transaction },
      )
    })

    this.eventService.postEvent(CaseEvent.ARCHIVE, theCase)

    return { caseArchived: true }
  }
}
