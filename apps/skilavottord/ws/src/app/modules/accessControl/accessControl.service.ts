import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Role } from '../auth'
import { AccessControlModel } from './accessControl.model'
import {
  CreateAccessControlInput,
  DeleteAccessControlInput,
  UpdateAccessControlInput,
} from './accessControl.input'

@Injectable()
export class AccessControlService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  async findAll(): Promise<AccessControlModel[]> {
    this.logger.info('---- Starting findAll Access Controls ----')

    // TODO replace mock data with actual db query
    const res = await Promise.resolve([
      {
        nationalId: '1234567777',
        name: 'Gervimaður',
        role: Role.recyclingCompany,
        partnerId: '8888888888',
      },
      {
        nationalId: '1234567888',
        name: 'Gervimaður2',
        role: Role.recyclingCompany,
        partnerId: '9999999999',
      },
      {
        nationalId: '1234567899',
        name: 'Gervimaður3',
        role: Role.recyclingCompany,
        partnerId: '9999999999',
      },
    ] as AccessControlModel[])
    return res
  }

  async createAccess(
    input: CreateAccessControlInput,
  ): Promise<AccessControlModel> {
    // TODO replace mock data with actual db query
    return Promise.resolve({
      nationalId: '1234567890',
      name: 'Gervimaður3',
      role: Role.recyclingCompany,
      partnerId: '9999999999',
    })
  }

  async updateAccess(
    input: UpdateAccessControlInput,
  ): Promise<AccessControlModel> {
    // TODO replace mock data with actual db query
    return Promise.resolve({
      nationalId: '1234567890',
      name: 'Gervimaður3',
      role: Role.recyclingCompany,
      partnerId: '9999999999',
    })
  }

  async deleteAccess(input: DeleteAccessControlInput): Promise<Boolean> {
    // TODO do actual delete
    return true
  }
}
