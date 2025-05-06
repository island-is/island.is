import { IntlProvider } from 'react-intl'
import { render, screen } from '@testing-library/react'

import {
  Case,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import CaseDates, { Props } from './CaseDates'

const renderCaseDates = (theCase: Case, button?: Props['button']) =>
  render(
    <IntlProvider locale="is" onError={jest.fn}>
      <CaseDates workingCase={theCase} button={button} />
    </IntlProvider>,
  )

describe('<CaseDates /> expired', () => {
  test('should render expired custody case', () => {
    const theCase = {
      isValidToDateInThePast: true,
      type: CaseType.CUSTODY,
      validToDate: '2022-06-15T19:50:08.033Z',
    } as Case

    renderCaseDates(theCase)
    expect(
      screen.getByText('Gæslu lauk 15. júní 2022 kl. 19:50'),
    ).toBeInTheDocument()
  })

  test('should render expired admission case', () => {
    const theCase = {
      isValidToDateInThePast: true,
      type: CaseType.ADMISSION_TO_FACILITY,
      validToDate: '2022-06-15T19:50:08.033Z',
    } as Case

    renderCaseDates(theCase)
    expect(
      screen.getByText('Vistun lauk 15. júní 2022 kl. 19:50'),
    ).toBeInTheDocument()
  })

  test('should render expired travel ban case', () => {
    const theCase = {
      isValidToDateInThePast: true,
      type: CaseType.TRAVEL_BAN,
      validToDate: '2022-06-15T19:50:08.033Z',
    } as Case

    renderCaseDates(theCase)
    expect(
      screen.getByText('Farbanni lauk 15. júní 2022 kl. 19:50'),
    ).toBeInTheDocument()
  })
})

describe('<CaseDates /> still valid', () => {
  test('should render valid custody case', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      validToDate: '2022-06-15T19:50:08.033Z',
    } as Case

    renderCaseDates(theCase)
    expect(
      screen.getByText('Gæsla til 15. júní 2022 kl. 19:50'),
    ).toBeInTheDocument()
  })

  test('should render valid travel ban case', () => {
    const theCase = {
      type: CaseType.TRAVEL_BAN,
      validToDate: '2022-06-15T19:50:08.033Z',
    } as Case

    renderCaseDates(theCase)
    expect(
      screen.getByText('Farbann til 15. júní 2022 kl. 19:50'),
    ).toBeInTheDocument()
  })

  test('should render valid admission case', () => {
    const theCase = {
      type: CaseType.ADMISSION_TO_FACILITY,
      validToDate: '2022-06-15T19:50:08.033Z',
    } as Case

    renderCaseDates(theCase)
    expect(
      screen.getByText('Vistun til 15. júní 2022 kl. 19:50'),
    ).toBeInTheDocument()
  })

  test('should render valid custody case with isolation', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      isCustodyIsolation: true,
      validToDate: '2022-06-15T19:50:08.033Z',
      isolationToDate: '2022-06-15T19:50:08.033Z',
    } as Case

    renderCaseDates(theCase)
    expect(
      screen.getByText('Gæsla til 15. júní 2022 kl. 19:50'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Einangrun til 15. júní 2022 kl. 19:50'),
    ).toBeInTheDocument()
  })
})
