import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Delegation } from '../models/delegation.model'
import { DelegationAdminCustomDto } from '../dto/delegation-admin-custom.dto'

@Injectable()
export class DelegationAdminCustomService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
  ) {}

  async getAllDelegationsByNationalId(
    nationalId: string,
  ): Promise<DelegationAdminCustomDto> {
    const incomingDelegations = await this.delegationModel.findAll({
      useMaster: true,
      where: {
        toNationalId: nationalId,
      },
    })

    const outgoingDelegations = await this.delegationModel.findAll({
      useMaster: true,
      where: {
        fromNationalId: nationalId,
      },
    })

    return {
      incoming: incomingDelegations.map((delegation) => delegation.toDTO()),
      outgoing: outgoingDelegations.map((delegation) => delegation.toDTO()),
    }
  }
}
