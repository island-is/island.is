import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { Domain } from '../models/domain.model'
import { DomainsInput } from '../dto/domains.input'

const MOCK_DATA: Domain[] = [
  {
    name: '@island.is',
    displayName: 'Ísland.is',
    description: 'Island.is',
    organisationLogoKey: 'Stafrænt Ísland',
    nationalId: '...',
  },
  {
    name: '@landsspitalinn.is',
    displayName: 'Landsspítalaappið',
    description: '',
    organisationLogoKey: 'Landsspítalinn',
    nationalId: '...',
  },
]

@Injectable()
export class DomainService {
  getDomains(_user: User, _input: DomainsInput): Promise<Domain[]> {
    return Promise.resolve(MOCK_DATA)
  }
}
