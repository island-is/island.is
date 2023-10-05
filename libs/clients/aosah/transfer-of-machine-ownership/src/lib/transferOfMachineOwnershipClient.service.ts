import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { MachinesApi } from '../../gen/fetch/apis'
import { Machine } from './transferOfMachineOwnershipClient.types'

@Injectable()
export class TransferOfMachineOwnershipClient {
  constructor(private readonly machinesApi: MachinesApi) {}

  private machinesApiWithAuth(auth: Auth) {
    return this.machinesApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getMachines(auth: User): Promise<Machine[]> {
    const result = await this.machinesApiWithAuth(auth).apiMachinesGet({
      // searchQuery: undefined,
      // pageNumber: undefined,
      // pageSize: undefined,
      // orderBy: undefined,
      // showDeregisteredMachines: undefined,
      // supervisorRegistered: undefined,
      // onlyInOwnerChangeProcess: undefined,
      // onlyShowOwnedMachines: true,
      // locale: 'is',
    })

    return (
      result.value?.map((m) => ({
        id: m.id,
        registrationNumber: m.registrationNumber,
        type: m.type,
        owner: m.owner,
        supervisor: m.supervisor,
        status: m.status,
        dateLastInspection: m.dateLastInspection,
      })) || []
    )
  }
}
