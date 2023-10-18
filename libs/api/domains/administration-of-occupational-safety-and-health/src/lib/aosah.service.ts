import { User } from '@island.is/auth-nest-tools'
import { TransferOfMachineOwnershipClientModule, TransferOfMachineOwnershipClient, MachineDetails } from '@island.is/clients/aosah/transfer-of-machine-ownership'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AosahApi {
    constructor(
        //private readonly machinesApi: MachinesApi,
        private readonly transferOfMachineOwnershipClient: TransferOfMachineOwnershipClient,
    ) {}
    
    async getMachineDetails(auth: User, id: string): Promise<MachineDetails> {
        const result = await this.transferOfMachineOwnershipClient.getMachineDetail(auth, id)

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
            _links: result._links || null,
        }

        return machine
    }

}
