import CryptoJS from 'crypto-js'
import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { uuidFactory } from '../../../factories'
import { CaseArchive } from '../models/caseArchive.model'
import { repositoryModuleConfig } from '../repository.config'

interface CreateArchive {
  archiveJson: string
}

// An archive read back: `content` is the decrypted archive JSON, or undefined
// when the stored archive cannot be decrypted into a JSON object.
export interface DecryptedCaseArchive {
  id: string
  created: Date
  content?: { [key: string]: unknown }
}

@Injectable()
export class CaseArchiveRepositoryService {
  constructor(
    @InjectModel(CaseArchive)
    private readonly caseArchiveModel: typeof CaseArchive,
    @Inject(repositoryModuleConfig.KEY)
    private readonly config: ConfigType<typeof repositoryModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    caseId: string,
    data: CreateArchive,
    options: { transaction: Transaction },
  ): Promise<CaseArchive> {
    try {
      this.logger.debug(
        `Creating a new case archive for case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      // Encrypt the archive JSON
      const encryptedArchive = CryptoJS.AES.encrypt(
        data.archiveJson,
        this.config.archiveEncryptionKey,
        { iv: CryptoJS.enc.Hex.parse(uuidFactory()) },
      ).toString()

      const result = await this.caseArchiveModel.create(
        {
          caseId,
          archive: encryptedArchive,
        },
        options,
      )

      this.logger.debug(
        `Created a new case archive ${result.id} for case ${caseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error creating a new case archive for case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  // A case that was restored and archived again has more than one archive, and
  // only the latest one matches the case as it is now.
  async findLatestByCaseId(
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<DecryptedCaseArchive | null> {
    try {
      this.logger.debug(`Finding the latest case archive for case ${caseId}`)

      const caseArchive = await this.caseArchiveModel.findOne({
        where: { caseId },
        order: [['created', 'DESC']],
        transaction: options.transaction,
      })

      if (!caseArchive) {
        this.logger.debug(`No case archive found for case ${caseId}`)

        return null
      }

      return {
        id: caseArchive.id,
        created: caseArchive.created,
        content: this.decrypt(caseArchive),
      }
    } catch (error) {
      this.logger.error(
        `Error finding the latest case archive for case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  private decrypt(
    caseArchive: CaseArchive,
  ): { [key: string]: unknown } | undefined {
    try {
      const content: unknown = JSON.parse(
        CryptoJS.AES.decrypt(
          caseArchive.archive,
          this.config.archiveEncryptionKey,
        ).toString(CryptoJS.enc.Utf8),
      )

      if (!content || typeof content !== 'object' || Array.isArray(content)) {
        throw new Error('The decrypted archive is not a JSON object')
      }

      return content as { [key: string]: unknown }
    } catch {
      // A fixed reason only - the archive itself must never reach the logs, and
      // the message of a parse error quotes the text it could not parse
      this.logger.error(`Error decrypting case archive ${caseArchive.id}:`, {
        reason: 'The archive could not be decrypted and read as a JSON object',
      })

      return undefined
    }
  }
}
