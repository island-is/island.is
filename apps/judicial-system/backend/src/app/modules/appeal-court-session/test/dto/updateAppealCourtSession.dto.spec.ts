import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

import { AppealCourtSessionType } from '@island.is/judicial-system/types'

import { UpdateAppealCourtSessionDto } from '../../dto/updateAppealCourtSession.dto'

const failingProperties = (plain: Record<string, unknown>) =>
  validateSync(plainToInstance(UpdateAppealCourtSessionDto, plain)).map(
    (error) => error.property,
  )

describe('UpdateAppealCourtSessionDto', () => {
  it('accepts an empty update', () => {
    expect(failingProperties({})).toEqual([])
  })

  it('accepts any subset of valid fields', () => {
    expect(
      failingProperties({
        sessionType: AppealCourtSessionType.MAIN_HEARING,
        sessionDate: '2026-12-12T14:00:00.000Z',
        courtRoom: '1',
      }),
    ).toEqual([])
    expect(failingProperties({ courtRoom: '2' })).toEqual([])
  })

  // The GraphQL input is nullable, so a client can send null where the
  // column is NOT NULL. It has to fail validation, not the insert.
  it('rejects an explicit null', () => {
    expect(
      failingProperties({
        sessionType: null,
        sessionDate: null,
        courtRoom: null,
      }).sort(),
    ).toEqual(['courtRoom', 'sessionDate', 'sessionType'])
  })

  it('rejects bad values', () => {
    expect(
      failingProperties({
        sessionType: 'TEA_BREAK',
        sessionDate: 'not a date',
        courtRoom: '',
      }).sort(),
    ).toEqual(['courtRoom', 'sessionDate', 'sessionType'])
  })
})
