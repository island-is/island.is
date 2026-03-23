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

interface CreateCaseArchiveOptions {
  transaction: Transaction
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
    options: CreateCaseArchiveOptions,
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
          // To decrypt:
          // JSON.parse(
          //   Base64.fromBase64(
          //     CryptoJS.AES.decrypt(
          //       archive,
          //       this.config.archiveEncryptionKey,
          //     ).toString(CryptoJS.enc.Base64),
          //   ),
          // )
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
}
