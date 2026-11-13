import { RegulationImpactSchema } from '../lib/dataSchema'
import { regulation } from '../lib/messages'
import {
  getEffectiveDateWarnings,
  getImpactsOffEffectiveDate,
} from './regulationValidations'

const impact = (
  id: string,
  date: string | undefined,
  name = '0870/2007',
  type: 'amend' | 'repeal' = 'amend',
): RegulationImpactSchema => ({ id, type, name, date })

describe('getImpactsOffEffectiveDate', () => {
  it('returns impacts dated after the effective date', () => {
    const later = impact('a', '2026-05-19')
    expect(getImpactsOffEffectiveDate('2026-05-18', [later])).toEqual([later])
  })

  it('returns impacts dated before the effective date', () => {
    const earlier = impact('a', '2026-05-17')
    expect(getImpactsOffEffectiveDate('2026-05-18', [earlier])).toEqual([
      earlier,
    ])
  })

  it('ignores impacts on the effective date', () => {
    expect(
      getImpactsOffEffectiveDate('2026-05-18', [impact('same', '2026-05-18')]),
    ).toEqual([])
  })

  it('includes repeals', () => {
    const repeal = impact('r', '2026-06-01', '0100/2020', 'repeal')
    expect(getImpactsOffEffectiveDate('2026-05-18', [repeal])).toEqual([repeal])
  })

  it('ignores self-impacts and impacts without a date', () => {
    expect(
      getImpactsOffEffectiveDate('2026-05-18', [
        impact('self', '2026-06-01', 'self'),
        impact('nodate', undefined),
      ]),
    ).toEqual([])
  })

  it('compares by day when dates carry a time part', () => {
    expect(
      getImpactsOffEffectiveDate('2026-05-18', [
        impact('a', '2026-05-18T23:00:00.000Z'),
      ]),
    ).toEqual([])
  })

  it('returns nothing without an effective date', () => {
    expect(
      getImpactsOffEffectiveDate(undefined, [impact('a', '2026-05-19')]),
    ).toEqual([])
  })
})

describe('getEffectiveDateWarnings', () => {
  const { effectiveOnOrBeforePublish, effectiveDateEarly } =
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
      effectiveOnOrBeforePublish,
    ])
  })

  it('warns when the effective date is the publish date', () => {
    expect(getEffectiveDateWarnings('2026-10-20', '2026-10-20')).toEqual([
      effectiveOnOrBeforePublish,
    ])
  })

  it('does not warn when the effective date is after the publish date', () => {
    expect(getEffectiveDateWarnings('2026-10-21', '2026-10-20')).toEqual([])
  })

  it('warns when a weekend effective date comes before the publish date', () => {
    // Saturday 17 Oct, published Monday 19 Oct
    expect(getEffectiveDateWarnings('2026-10-17', '2026-10-19')).toEqual([
      effectiveOnOrBeforePublish,
    ])
  })

  it('warns when the effective date is in the past', () => {
    expect(getEffectiveDateWarnings('2026-10-01', '2026-10-05')).toEqual([
      effectiveOnOrBeforePublish,
      effectiveDateEarly,
    ])
  })

  it('warns about both when the effective date is past and before publish', () => {
    expect(getEffectiveDateWarnings('2026-09-30', '2026-10-20')).toEqual([
      effectiveOnOrBeforePublish,
      effectiveDateEarly,
    ])
  })

  it('warns on fast-track when the effective date is before the next workday', () => {
    // Friday 2 Oct is a workday, so Thursday 1 Oct is before it
    expect(getEffectiveDateWarnings('2026-10-01', '2026-10-01', true)).toEqual([
      effectiveOnOrBeforePublish,
      effectiveDateEarly,
    ])
  })

  it('does not warn without a publish date unless the effective date is past', () => {
    expect(getEffectiveDateWarnings('2026-10-20', undefined)).toEqual([])
    expect(getEffectiveDateWarnings('2026-10-01', undefined)).toEqual([
      effectiveDateEarly,
    ])
  })
})
