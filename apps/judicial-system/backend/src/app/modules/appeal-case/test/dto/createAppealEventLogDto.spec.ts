import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

import { AppealEventType } from '@island.is/judicial-system/types'

import { CreateAppealEventLogDto } from '../../dto/createAppealEventLog.dto'

const errorsOf = (plain: Record<string, unknown>) =>
  validateSync(plainToInstance(CreateAppealEventLogDto, plain))

describe('CreateAppealEventLogDto', () => {
  it.each(
    Object.values(AppealEventType).filter(
      (eventType) => eventType !== AppealEventType.APPEAL_COMPLETED,
    ),
  )('should accept %s', (eventType) => {
    expect(errorsOf({ eventType })).toEqual([])
  })

  // A verdict appeal is recorded as completed only by completing it.
  it('should refuse APPEAL_COMPLETED', () => {
    const errors = errorsOf({ eventType: AppealEventType.APPEAL_COMPLETED })

    expect(errors).toHaveLength(1)
    expect(errors[0].property).toBe('eventType')
  })

  it('should refuse an unknown event type', () => {
    expect(errorsOf({ eventType: 'NOT_AN_EVENT' })).toHaveLength(1)
  })
})
