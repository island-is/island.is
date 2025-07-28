import {
  CaseType,
  Defendant,
  Gender,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { createFormatMessage } from '../../utils/testHelpers.logic'
import { getDefendantLabel } from './CaseInfo'

describe('getDefendantLabel - Indictment', () => {
  const formatMessage = createFormatMessage()
  const fn = (defendants: Defendant[]) =>
    getDefendantLabel(formatMessage, defendants, CaseType.INDICTMENT)

  test('should render label for female', () => {
    const defendants = [{ gender: Gender.FEMALE }] as Defendant[]
    expect(fn(defendants)).toBe('ákærða')
  })

  test('should render label for male', () => {
    const defendants = [{ gender: Gender.MALE }] as Defendant[]
    expect(fn(defendants)).toBe('ákærði')
  })

  test('should render label for other', () => {
    const defendants = [{ gender: Gender.OTHER }] as Defendant[]
    expect(fn(defendants)).toBe('ákærða')
  })

  test('should render label for missing gender', () => {
    const defendants = [{}] as Defendant[]
    expect(fn(defendants)).toBe('ákærða')
  })

  test('should render label for multiple defendants', () => {
    const defendants = [{}, {}] as Defendant[]
    expect(fn(defendants)).toBe('ákærðu')
  })
})

describe('getDefendantLabel - RestrictionCase/InvestigationCase', () => {
  const formatMessage = createFormatMessage()
  const fn = (defendants: Defendant[]) =>
    getDefendantLabel(formatMessage, defendants, CaseType.CUSTODY)

  test('should render label for signle defendant', () => {
    const defendants = [{}] as Defendant[]
    expect(fn(defendants)).toBe('varnaraðili')
  })

  test('should render label for multiple defendants', () => {
    const defendants = [{}, {}] as Defendant[]
    expect(fn(defendants)).toBe('varnaraðilar')
  })
})
