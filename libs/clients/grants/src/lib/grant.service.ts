import { Injectable } from '@nestjs/common'
import { GrantBase } from './grant.types'
import { RannisGrantsClientService } from './clients/rannis/rannisGrants.service'

@Injectable()
export class GrantsClientService {
  constructor(private readonly rannisGrantService: RannisGrantsClientService) {}

  getGrants(): Promise<Array<GrantBase>> {
    return this.rannisGrantService.getGrants()
  }
}
