import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class CriminalRecordService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    console.log('TODO sendApplication')
  }

  async getCriminalRecord({ application }: TemplateApiModuleActionProps) {
    console.log('TODO getCriminalRecord')
  }
}
