import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  CriminalRecordService,
} from '@island.is/api/domains/criminal-record'
import { CriminalRecord } from '@island.is/clients/criminal-record'

@Injectable()
export class CriminalRecordSubmissionService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly criminalRecordService: CriminalRecordService,
  ) {}

  async createCharge({
    application: { id },
    auth,
  }: TemplateApiModuleActionProps) {
    console.log('halló')
    console.log(id)
    const result = this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      'AY101',
    )
    return result
  }

  async getCriminalRecord({ application }: TemplateApiModuleActionProps): Promise<CriminalRecord> {
    return this.criminalRecordService.getCriminalRecord()
  }
}
