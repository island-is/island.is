import { Injectable } from '@nestjs/common'
import { GrantBase } from './grant.types'
import { RannisGrantService } from './clients/rannis/rannisGrants.service'

@Injectable()
export class GrantsService {
  constructor(private readonly rannisGrantService: RannisGrantService) {}

  getGrants(): Promise<Array<GrantBase>> {
    return this.rannisGrantService.getGrants()
  }

  getGrantById(id: string) {
    // Implementation goes here
  }
}
