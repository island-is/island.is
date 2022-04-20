import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class NationalRegistryService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async nationalRegistry({ auth }: TemplateApiModuleActionProps) {
    return {
      nationalId: auth.nationalId,
      name: 'Justin Trudeau',
      age: '42',
      address: '123 Fake St',
      phone: '123-456-7890',
      city: 'Toronto',
    }
  }
}
