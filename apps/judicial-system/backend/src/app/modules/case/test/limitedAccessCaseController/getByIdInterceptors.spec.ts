import { INTERCEPTORS_METADATA } from '@nestjs/common/constants'

import { CaseInterceptor } from '../../interceptors/case.interceptor'
import { CompletedAppealAccessedInterceptor } from '../../interceptors/completedAppealAccessed.interceptor'
import { LimitedAccessCaseFileInterceptor } from '../../interceptors/limitedAccessCaseFile.interceptor'
import { LimitedAccessCaseController } from '../../limitedAccessCase.controller'

describe('LimitedAccessCaseController - Get by id interceptors', () => {
  it('registers file filtering after CaseInterceptor so it runs first on the response', () => {
    // Nest runs response interceptors in reverse registration order. File
    // filtering must see full appealEventLogs (including co-party
    // APPEAL_STATEMENT_SENT) before CaseInterceptor redacts those rows.
    const interceptors = Reflect.getMetadata(
      INTERCEPTORS_METADATA,
      LimitedAccessCaseController.prototype.getById,
    )

    expect(interceptors).toEqual([
      CompletedAppealAccessedInterceptor,
      CaseInterceptor,
      LimitedAccessCaseFileInterceptor,
    ])
  })
})
