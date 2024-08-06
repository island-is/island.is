import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import { Endorsement } from '../modules/endorsement/models/endorsement.model'
import { Op } from 'sequelize'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'

@Injectable()
export class EndorsementSystemCleanupWorkerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(Endorsement)
    private readonly endorsementModel: typeof Endorsement,
    private readonly nationalRegistryApiV3: NationalRegistryV3ClientService,
  ) {}

  public async run() {
    await this.fixLocality()
  }

  async fixLocality() {
    this.logger.info('Cleanup worker starting...')
    // Find all rows with COUNTRY_CODE as locality value
    const rows = await this.endorsementModel.findAll({
      where: {
        created: {
         //filtering rows created after May 6th this year
          [Op.gt]: new Date(new Date().getFullYear(), 4, 6)
        },
        meta: {
          locality: {
            [Op.regexp]: '^[A-Z]{2}$',
          },
        },
      },
    })
    this.logger.info(`Found ${rows.length} rows with invalid locality`)
    // Loop through rows and fix the locality value
    for (const row of rows) {
      try {
        const person = await this.nationalRegistryApiV3.getAllDataIndividual(
          row.endorser,
        )
        if (person) {
          const oldLocality = row.meta.locality
          const newLocality = person?.heimilisfang?.sveitarfelag || ''
          const newMeta = {
            ...row.meta,
            locality: newLocality,
          }
          try {
            await this.endorsementModel.update(
              { meta: newMeta },
              { where: { id: row.id } },
            )
            this.logger.info(
              `Fixed locality for row id:${row.id} from ${oldLocality} to ${newLocality}`,
            )
          } catch (error) {
            this.logger.error(
              `Error fixing locality for row id:${row.id} from ${oldLocality} to ${newLocality}`,
            )
          }
        }
      } catch (error) {
        this.logger.error(
          `Error fixing locality for row id:${row.id} locality ${row.meta.locality}`,
        )
      }
    }
  }
}
