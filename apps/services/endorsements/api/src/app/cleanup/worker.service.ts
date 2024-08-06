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
    await this.fixSveitafelag()
  }

  async fixSveitafelag() {
    console.log("RUNNING ***********************")
    const rowCountBeforeCleanup = await this.endorsementModel.count()
    console.log("rowCountBeforeCleanup", rowCountBeforeCleanup)

    const rows = await this.endorsementModel.findAll({
      limit: 10,
      order: [['created', 'DESC']],
    });

    const person = await this.nationalRegistryApiV3.getAllDataIndividual(
      "1305775399",
    )
    console.log("person",person)
    // loop rows and console log meta property  
    // rows.forEach(async row => {
    //   console.log("endorser",row.endorser)
    //   const person = await this.nationalRegistryApiV3.getAllDataIndividual(
    //     "0101302989",
    //   )
    //   console.log("person",person)
    //   console.log(row.meta)
    // })
  }
}
