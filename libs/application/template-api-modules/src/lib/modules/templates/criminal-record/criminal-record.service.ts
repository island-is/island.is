import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'


@Injectable()
export class CriminalRecordService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    // Pretend to be doing stuff for a short while
    console.log('---------------------------!!!YEEEEEEEEEEEEEHAWWWWWWW!!!---------------------------')
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
}