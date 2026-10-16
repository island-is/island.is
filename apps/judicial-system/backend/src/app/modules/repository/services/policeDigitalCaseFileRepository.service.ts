import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { PoliceDigitalCaseFile } from '../models/policeDigitalCaseFile.model'

@Injectable()
export class PoliceDigitalCaseFileRepositoryService {
  constructor(
    @InjectModel(PoliceDigitalCaseFile)
    private readonly model: typeof PoliceDigitalCaseFile,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    data: Partial<PoliceDigitalCaseFile>,
    options: { transaction: Transaction },
  ): Promise<PoliceDigitalCaseFile> {
    try {
      this.logger.debug('Creating a new police digital case file')

      const result = await this.model.create(data, options)

      this.logger.debug(`Created police digital case file ${result.id}`)

      return result
    } catch (error) {
      this.logger.error('Error creating police digital case file', { error })

      throw error
    }
  }

  async findByCaseId(caseId: string): Promise<PoliceDigitalCaseFile[]> {
    try {
      this.logger.debug(`Finding police digital case files for case ${caseId}`)

      const results = await this.model.findAll({ where: { caseId } })

      this.logger.debug(
        `Found ${results.length} police digital case files for case ${caseId}`,
      )

      return results
    } catch (error) {
      this.logger.error('Error finding police digital case files for case', {
        error,
      })

      throw error
    }
  }

  async findByCaseAndPoliceCaseNumber(
    caseId: string,
    policeCaseNumber: string,
  ): Promise<PoliceDigitalCaseFile[]> {
    try {
      this.logger.debug(
        `Finding police digital case files for case ${caseId} and police case number ${policeCaseNumber}`,
      )

      const results = await this.model.findAll({
        where: { caseId, policeCaseNumber },
      })

      this.logger.debug(
        `Found ${results.length} police digital case files for case ${caseId} and police case number ${policeCaseNumber}`,
      )

      return results
    } catch (error) {
      this.logger.error(
        'Error finding police digital case files for police case number',
        { error },
      )

      throw error
    }
  }

  async update(
    caseId: string,
    id: string,
    data: Partial<PoliceDigitalCaseFile>,
    options?: { transaction?: Transaction },
  ): Promise<PoliceDigitalCaseFile> {
    try {
      this.logger.debug(
        `Updating police digital case file ${id} for case ${caseId}`,
      )

      const [, [result]] = await this.model.update(data, {
        where: { caseId, id },
        returning: true,
        ...options,
      })

      this.logger.debug(
        `Updated police digital case file ${id} for case ${caseId}`,
      )

      return result
    } catch (error) {
      this.logger.error('Error updating police digital case file', { error })

      throw error
    }
  }

  async delete(
    caseId: string,
    id: string,
    options?: { transaction?: Transaction },
  ): Promise<boolean> {
    try {
      this.logger.debug(
        `Deleting police digital case file ${id} from case ${caseId}`,
      )

      const results = await this.model.destroy({
        where: { caseId, id },
        ...options,
      })

      this.logger.debug(
        `Deleted police digital case file ${id} from case ${caseId}`,
      )

      return results > 0
    } catch (error) {
      this.logger.error('Error deleting police digital case file', { error })

      throw error
    }
  }

  async deleteAllForPoliceCaseNumber(
    caseId: string,
    policeCaseNumber: string,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    try {
      this.logger.debug(
        `Deleting all police digital case files for case ${caseId} and police case number ${policeCaseNumber}`,
      )

      await this.model.destroy({
        where: { caseId, policeCaseNumber },
        ...options,
      })

      this.logger.debug(
        `Deleted all police digital case files for case ${caseId} and police case number ${policeCaseNumber}`,
      )
    } catch (error) {
      this.logger.error(
        'Error deleting all police digital case files for police case number',
        { error },
      )

      throw error
    }
  }
}
