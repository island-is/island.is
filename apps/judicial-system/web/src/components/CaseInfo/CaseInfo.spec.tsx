import { IntlProvider } from 'react-intl'
import { render, screen } from '@testing-library/react'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseState,
  CaseType,
  Gender,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { createFormatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers.logic'

import { CourtCaseInfo, getDefendantLabel } from './CaseInfo'

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

describe('<CourtCaseInfo /> completed indictment', () => {
  const renderCourtCaseInfo = (theCase: WorkingCase) =>
    render(
      <IntlProvider locale="is" onError={jest.fn}>
        <CourtCaseInfo workingCase={theCase} />
      </IntlProvider>,
    )

  test('should render the ruling date', () => {
    renderCourtCaseInfo({
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      rulingDate: '2026-09-23T12:00:00.000Z',
    } as WorkingCase)

    expect(
      screen.getByText('Máli lokið 23. september 2026'),
    ).toBeInTheDocument()
  })

  test('should render the label without a date while the ruling date is missing', () => {
    renderCourtCaseInfo({
      type: CaseType.INDICTMENT,
      state: CaseState.COMPLETED,
      rulingDate: null,
    } as WorkingCase)

    expect(screen.getByText('Máli lokið')).toBeInTheDocument()
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument()
  })
})
