import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { v4 as uuid } from 'uuid'

import {
  CompleteVerdictAppealsDto,
  MAX_COMPLETED_VERDICT_APPEALS,
} from '../../dto/completeVerdictAppeals.dto'

const errorsOf = (plain: Record<string, unknown>) =>
  validateSync(plainToInstance(CompleteVerdictAppealsDto, plain))

describe('CompleteVerdictAppealsDto', () => {
  it('should accept a list of distinct appeal case ids', () => {
    expect(errorsOf({ appealCaseIds: [uuid(), uuid(), uuid()] })).toEqual([])
  })

  it(`should accept ${MAX_COMPLETED_VERDICT_APPEALS} ids`, () => {
    expect(
      errorsOf({
        appealCaseIds: Array.from(
          { length: MAX_COMPLETED_VERDICT_APPEALS },
          () => uuid(),
        ),
      }),
    ).toEqual([])
  })

  it.each([
    ['no list', {}],
    ['something other than a list', { appealCaseIds: uuid() }],
    ['an empty list', { appealCaseIds: [] }],
    ['an id that is not a uuid', { appealCaseIds: [uuid(), 'not-a-uuid'] }],
    ['the same id twice', { appealCaseIds: ((id) => [id, id])(uuid()) }],
    [
      `more than ${MAX_COMPLETED_VERDICT_APPEALS} ids`,
      {
        appealCaseIds: Array.from(
          { length: MAX_COMPLETED_VERDICT_APPEALS + 1 },
          () => uuid(),
        ),
      },
    ],
  ])('should refuse %s', (_, plain) => {
    const errors = errorsOf(plain)

    expect(errors).toHaveLength(1)
    expect(errors[0].property).toBe('appealCaseIds')
  })
})
