import {
  PastCasesTable,
  getDurationDate,
} from '@island.is/judicial-system-web/src/components/Table'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import userEvent from '@testing-library/user-event'
import { cases } from './TestData'
import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '@island.is/localization'
import { MockedProvider } from '@apollo/client/testing'
import { mockProsecutorQuery } from '@island.is/judicial-system-web/src/utils/mocks'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'

const date1 = '2022-08-04T19:50:08.033Z'
const date2 = '2022-09-04T19:30:08.033Z'
const date3 = '2022-09-13T19:50:07.033Z'
const date4 = '2022-12-24T18:00:00.033Z'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

describe('getDurationDate', () => {
  test.each`
    state
    ${CaseState.REJECTED}
    ${CaseState.DISMISSED}
  `('should return null if state is REJECTED or DISMISSED', ({ state }) => {
    expect(getDurationDate(state, date1, date2, date4)).toBe(null)
  })

  test('should use initial ruling date if it is set', () => {
    const initialRulingDate = date1
    const validToDate = date2

    const res = getDurationDate(
      CaseState.ACCEPTED,
      validToDate,
      initialRulingDate,
    )

    expect(res).toBe('04.08.2022 - 04.09.2022')
  })

  test('should use ruling date if initialRulingDate is not set', () => {
    const initialRulingDate = undefined
    const rulingDate = date2
    const validToDate = date3

    const res = getDurationDate(
      CaseState.ACCEPTED,
      validToDate,
      initialRulingDate,
      rulingDate,
    )

    expect(res).toBe('04.09.2022 - 13.09.2022')
  })

  test('should fallback to use validToDate', () => {
    const initialRulingDate = undefined
    const rulingDate = undefined
    const validToDate = date4

    const res = getDurationDate(
      CaseState.ACCEPTED,
      validToDate,
      initialRulingDate,
      rulingDate,
    )

    expect(res).toBe('24.12.2022')
  })

  test('should return null if all dates are undefined', () => {
    const initialRulingDate = undefined
    const rulingDate = undefined
    const validToDate = undefined

    const res = getDurationDate(
      CaseState.ACCEPTED,
      validToDate,
      initialRulingDate,
      rulingDate,
    )

    expect(res).toBeNull()
  })
})

describe('Sorting', () => {
  let user: UserEvent

  beforeEach(() => {
    user = userEvent.setup()
    window.localStorage.clear()
  })

  test('should order the table data by accused name in ascending order when the user clicks the accused name table header', async () => {
    render(
      <MockedProvider mocks={mockProsecutorQuery}>
        <LocaleProvider locale="is" messages={{}}>
          <PastCasesTable cases={cases} />
        </LocaleProvider>
      </MockedProvider>,
    )

    await user.click(await screen.findByTestId('defendantsSortButton'))

    const tableRows = await screen.findAllByTestId('tableRow')

    expect(tableRows[0]).toHaveTextContent('D. M. Kil')
    expect(tableRows[1]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[2]).toHaveTextContent('Jon Harring')
    expect(tableRows[3]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[4]).toHaveTextContent('Mikki Refur')
    expect(tableRows[5]).toHaveTextContent('Moe')
  })

  test('should order the table data by accused name in descending order when the user clicks the accused name table header twice', async () => {
    render(
      <MockedProvider mocks={mockProsecutorQuery}>
        <LocaleProvider locale="is" messages={{}}>
          <PastCasesTable cases={cases} />
        </LocaleProvider>
      </MockedProvider>,
    )

    await user.dblClick(await screen.findByTestId('defendantsSortButton'))

    const tableRows = await screen.findAllByTestId('tableRow')

    expect(tableRows[0]).toHaveTextContent('Moe')
    expect(tableRows[1]).toHaveTextContent('Mikki Refur')
    expect(tableRows[2]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[3]).toHaveTextContent('Jon Harring')
    expect(tableRows[4]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[5]).toHaveTextContent('D. M. Kil')
  })

  test('should order the table data by created in ascending order when the user clicks the created table header', async () => {
    render(
      <MockedProvider mocks={mockProsecutorQuery}>
        <LocaleProvider locale="is" messages={{}}>
          <PastCasesTable cases={cases} />
        </LocaleProvider>
      </MockedProvider>,
    )

    await user.click(await screen.findByTestId('createdSortButton'))

    const tableRows = await screen.findAllByTestId('tableRow')

    expect(tableRows[0]).toHaveTextContent('Mikki Refur')
    expect(tableRows[1]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[2]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[3]).toHaveTextContent('Jon Harring')
    expect(tableRows[4]).toHaveTextContent('D. M. Kil')
    expect(tableRows[5]).toHaveTextContent('Moe')
  })

  test('should order the table data by created in acending order when the user clicks the created table header twice', async () => {
    render(
      <MockedProvider mocks={mockProsecutorQuery}>
        <LocaleProvider locale="is" messages={{}}>
          <PastCasesTable cases={cases} />
        </LocaleProvider>
      </MockedProvider>,
    )

    await user.dblClick(await screen.findByTestId('createdSortButton'))

    const tableRows = await screen.findAllByTestId('tableRow')

    expect(tableRows[0]).toHaveTextContent('Moe')
    expect(tableRows[1]).toHaveTextContent('D. M. Kil')
    expect(tableRows[2]).toHaveTextContent('Jon Harring')
    expect(tableRows[3]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[4]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[5]).toHaveTextContent('Mikki Refur')
  })
})
