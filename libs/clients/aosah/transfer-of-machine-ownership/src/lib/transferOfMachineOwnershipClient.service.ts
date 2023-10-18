import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { MachinesApi } from '../../gen/fetch/apis'
import { Machine, MachineDetails } from './transferOfMachineOwnershipClient.types'

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
       onlyShowOwnedMachines: true,
      // locale: 'is',
    })
    console.log('rsult', result);

    const machines: Machine[] = result.value?.map((m) => ({
      id: m.id,
      registrationNumber: m.registrationNumber || null,
      type: m.type || null,
      owner: m.owner || null,
      supervisor: m.supervisor || null,
      status: m.status || null,
      dateLastInspection: m.dateLastInspection || null,
      category: m.category || null,
      subCategory: m.subCategory || null,
      _links: result.links || null,
    })) || [];
    
    return machines;
  }

  public async getMachineDetail(auth: User, id: string): Promise<MachineDetails> {
    const result = await this.machinesApiWithAuth(auth).getMachine({
      id,
      // locale: 'is',
    })

    const machine: MachineDetails = {
      id: result.id,
      registrationNumber: result.registrationNumber || null,
      type: result.type || null,
      status: result.status || null,
      category: result.category || null,
      subCategory: result.subCategory || null,
      productionYear: result.productionYear || null,
      registrationDate: result.registrationDate || null,
      ownerNumber: result.ownerNumber || null,
      productionNumber: result.productionNumber || null,
      productionCountry: result.productionCountry || null,
      licensePlateNumber: result.licensePlateNumber || null,
      importer: result.importer || null,
      insurer: result.insurer || null,
      ownerName: result.ownerName || null,
      ownerNationalId: result.ownerNationalId || null,
      ownerAddress: result.ownerAddress || null,
      ownerPostcode: result.ownerPostcode || null,
      supervisorName: result.supervisorName || null,
      supervisorNationalId: result.supervisorNationalId || null,
      supervisorAddress: result.supervisorAddress || null,
      supervisorPostcode: result.supervisorPostcode || null,
      _links: result.links || null,
    }

    return machine;
  }
}
