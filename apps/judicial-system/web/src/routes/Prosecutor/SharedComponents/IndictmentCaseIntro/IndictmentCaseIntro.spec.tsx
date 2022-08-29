import { createIntl } from 'react-intl'

import { Defendant, Gender } from '@island.is/judicial-system/types'

import { getDefentantLabel } from './IndictmentCaseIntro'

describe('getDefendantLabel', () => {
  const formatMessage = createIntl({ locale: 'is', onError: jest.fn })
    .formatMessage

  const fn = (defendants: Defendant[]) =>
    getDefentantLabel(formatMessage, defendants)

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
