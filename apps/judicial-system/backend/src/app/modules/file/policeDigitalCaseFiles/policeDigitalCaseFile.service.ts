import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { Inject, Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import type { User } from '@island.is/judicial-system/types'

import { PoliceService } from '../../police/police.service'
import { PoliceDigitalCaseFileRepositoryService } from '../../repository'
import { UpdatePoliceDigitalCaseFileDto } from '../dto/updatePoliceDigitalCaseFiles.dto'
import { PoliceDigitalCaseFileSyncResult } from '../models/policeDigitalCaseFileSyncResult.model'
import { getFilesToCreate } from './getFilesToCreate'

@Injectable()
export class PoliceDigitalCaseFileService {
  constructor(
    private readonly policeDigitalCaseFileRepositoryService: PoliceDigitalCaseFileRepositoryService,
    private readonly policeService: PoliceService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async syncAndGetPoliceDigitalCaseFiles(
    caseId: string,
    policeCaseNumbers: string[],
    user: User,
  ): Promise<PoliceDigitalCaseFileSyncResult[]> {
    this.logger.debug(`Syncing police digital case files for case ${caseId}`)

    const [policeSystemDigitalCaseFiles, currentPoliceDigitalCaseFiles] =
      await Promise.all([
        this.policeService.getAllPoliceSystemDigitalCaseFiles(caseId, user),
        this.policeDigitalCaseFileRepositoryService.findAll({
          where: { caseId },
        }),
      ])

    // Only consider files from the police system whose policeCaseNumber is among the stored ones on the case
    const relevantDigitalCaseFiles = policeSystemDigitalCaseFiles.filter((f) =>
      policeCaseNumbers.includes(f.policeCaseNumber),
    )

    const policeSystemDigitalCaseFileIds = new Set(
      relevantDigitalCaseFiles.map((f) => f.id),
    )

    // Auto-create DB entries for relevant police digital case files not yet stored from the police system
    const filesToCreate = getFilesToCreate(
      policeSystemDigitalCaseFiles,
      currentPoliceDigitalCaseFiles,
      policeCaseNumbers,
    )

    if (filesToCreate.length > 0) {
      await this.sequelize.transaction(async (transaction) => {
        await Promise.all(
          filesToCreate.map((f) =>
            this.policeDigitalCaseFileRepositoryService.create(
              {
                caseId,
                policeCaseNumber: f.policeCaseNumber,
                policeDigitalFileId: f.id,
                policeExternalVendorId: f.policeExternalVendorId,
                name: f.name,
                displayDate: f.displayDate,
              },
              { transaction },
            ),
          ),
        )
      })
    }

    // Re-fetch only if we inserted new records
    const currentDigitalCaseFiles =
      filesToCreate.length > 0
        ? await this.policeDigitalCaseFileRepositoryService.findAll({
            where: { caseId },
          })
        : currentPoliceDigitalCaseFiles

    return currentDigitalCaseFiles
      .filter((f) => policeCaseNumbers.includes(f.policeCaseNumber)) // sanity step, if police case number is removed, we should clean up relevant digital case files
      .map((f) => ({
        id: f.id,
        caseId: f.caseId,
        policeCaseNumber: f.policeCaseNumber,
        policeDigitalFileId: f.policeDigitalFileId,
        policeExternalVendorId: f.policeExternalVendorId,
        name: f.name,
        displayDate: f.displayDate,
        orderWithinChapter: f.orderWithinChapter,
        isDeletable: !policeSystemDigitalCaseFileIds.has(f.policeDigitalFileId),
      }))
  }

  async getTokenUrl(
    caseId: string,
    user: User,
    policeDigitalFileId: string,
  ): Promise<string> {
    return this.policeService.getTokenUrl(
      caseId,
      user.nationalId,
      policeDigitalFileId,
      user,
      'getPoliceDigitalCaseFileTokenUrl',
    )
  }

  async updatePoliceDigitalCaseFileOrders(
    caseId: string,
    updates: UpdatePoliceDigitalCaseFileDto[],
    transaction: Transaction,
  ): Promise<void> {
    this.logger.debug(
      `Updating police digital case file orders for case ${caseId}`,
    )

    await Promise.all(
      updates.map((update) =>
        this.policeDigitalCaseFileRepositoryService.update(
          caseId,
          update.id,
          { orderWithinChapter: update.orderWithinChapter },
          { transaction },
        ),
      ),
    )
  }

  async deletePoliceDigitalCaseFile(
    caseId: string,
    id: string,
  ): Promise<boolean> {
    this.logger.debug(`Deleting police digital case file ${id}`)

    return this.policeDigitalCaseFileRepositoryService.delete(caseId, id)
  }

  async deleteAllForPoliceCaseNumber(
    caseId: string,
    policeCaseNumber: string,
    transaction: Transaction,
  ): Promise<void> {
    this.logger.debug(
      `Deleting all police digital case files for case ${caseId} and police case number ${policeCaseNumber}`,
    )

    return this.policeDigitalCaseFileRepositoryService.deleteAllForPoliceCaseNumber(
      caseId,
      policeCaseNumber,
      { transaction },
    )
  }
}
