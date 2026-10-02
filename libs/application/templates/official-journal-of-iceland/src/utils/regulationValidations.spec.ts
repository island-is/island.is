import { RegulationImpactSchema } from '../lib/dataSchema'
import { regulation } from '../lib/messages'
import {
  getEffectiveDateWarnings,
  getImpactsAfterEffectiveDate,
} from './regulationValidations'

const impact = (
  id: string,
  date: string | undefined,
  name = '0870/2007',
  type: 'amend' | 'repeal' = 'amend',
): RegulationImpactSchema => ({ id, type, name, date })

describe('getImpactsAfterEffectiveDate', () => {
  it('returns impacts dated after the effective date', () => {
    const later = impact('a', '2026-05-19')
    expect(getImpactsAfterEffectiveDate('2026-05-18', [later])).toEqual([later])
  })

  it('ignores impacts on or before the effective date', () => {
    expect(
      getImpactsAfterEffectiveDate('2026-05-18', [
        impact('same', '2026-05-18'),
        impact('earlier', '2026-05-17'),
      ]),
    ).toEqual([])
  })

  it('includes repeals', () => {
    const repeal = impact('r', '2026-06-01', '0100/2020', 'repeal')
    expect(getImpactsAfterEffectiveDate('2026-05-18', [repeal])).toEqual([
      repeal,
    ])
  })

  it('ignores self-impacts and impacts without a date', () => {
    expect(
      getImpactsAfterEffectiveDate('2026-05-18', [
        impact('self', '2026-06-01', 'self'),
        impact('nodate', undefined),
      ]),
    ).toEqual([])
  })

  it('compares by day when dates carry a time part', () => {
    expect(
      getImpactsAfterEffectiveDate('2026-05-18', [
        impact('a', '2026-05-18T23:00:00.000Z'),
      ]),
    ).toEqual([])
  })

  it('returns nothing without an effective date', () => {
    expect(
      getImpactsAfterEffectiveDate(undefined, [impact('a', '2026-05-19')]),
    ).toEqual([])
  })
})

describe('getEffectiveDateWarnings', () => {
  const { effectiveBeforePublish, effectiveDateEarly } =
    regulation.summary.dateWarnings

  beforeEach(() => {
    jest.useFakeTimers()
    // Friday 2 October 2026
    jest.setSystemTime(new Date('2026-10-02T09:00:00'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('warns when the effective date is before the publish date', () => {
    expect(getEffectiveDateWarnings('2026-10-19', '2026-10-20')).toEqual([
      effectiveBeforePublish,
    ])
  })

  it('does not warn when the effective date is on or after the publish date', () => {
    expect(getEffectiveDateWarnings('2026-10-20', '2026-10-20')).toEqual([])
    expect(getEffectiveDateWarnings('2026-10-21', '2026-10-20')).toEqual([])
  })

  it('moves a weekend effective date to the next workday before comparing', () => {
    // Saturday 17 Oct counts as Monday 19 Oct
    expect(getEffectiveDateWarnings('2026-10-17', '2026-10-19')).toEqual([])
  })

  it('warns when the effective date is in the past', () => {
    expect(getEffectiveDateWarnings('2026-10-01', '2026-10-01')).toEqual([
      effectiveDateEarly,
    ])
  })

  it('warns about both when the effective date is past and before publish', () => {
    expect(getEffectiveDateWarnings('2026-09-30', '2026-10-20')).toEqual([
      effectiveBeforePublish,
      effectiveDateEarly,
    ])
  })

  it('warns on fast-track when the effective date is before the next workday', () => {
    // Friday 2 Oct is a workday, so Thursday 1 Oct is before it
    expect(getEffectiveDateWarnings('2026-10-01', '2026-10-01', true)).toEqual([
      effectiveBeforePublish,
      effectiveDateEarly,
    ])
  })

  it('does not warn without a publish date unless the effective date is past', () => {
    expect(getEffectiveDateWarnings('2026-10-20', undefined)).toEqual([])
  })
})
