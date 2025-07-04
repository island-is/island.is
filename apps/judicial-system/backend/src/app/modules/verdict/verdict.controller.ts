import { Controller } from '@nestjs/common'

import { VerdictService } from './verdict.service'

@Controller('api/case/:caseId/defendant/:defendantId/verdict')
export class VerdictController {
  constructor(private readonly verdictService: VerdictService) {}
}
