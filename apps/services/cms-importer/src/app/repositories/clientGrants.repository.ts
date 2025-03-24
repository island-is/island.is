import { Injectable } from '@nestjs/common'
import { GrantsClientService } from '@island.is/clients/grants'

@Injectable()
export class ClientGrantsRepository {
  constructor(private readonly grantsClientService: GrantsClientService) {}

  async getGrants() {
    return this.grantsClientService.getGrants()
  }
}
