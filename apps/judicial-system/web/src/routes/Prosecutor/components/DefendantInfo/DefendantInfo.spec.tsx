import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react'

import {
  Case,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { LocaleProvider } from '@island.is/localization'

import DefendantInfo from './DefendantInfo'

const mockUseNationalRegistry = jest.fn()

// Mock the national registry hook so we can assert on the `skip` option the
// component computes, without performing real lookups.
jest.mock('@island.is/judicial-system-web/src/utils/hooks', () => ({
  __esModule: true,
  useNationalRegistry: (...args: unknown[]) => mockUseNationalRegistry(...args),
}))

const renderDefendantInfo = (defendant: Partial<Defendant>) => {
  const workingCase = { id: 'case_id', type: 'CUSTODY' } as Case

  render(
    <MockedProvider>
      <LocaleProvider locale="is" messages={{}}>
        <DefendantInfo
          defendant={{ id: 'def_id', ...defendant } as Defendant}
          workingCase={workingCase}
          setWorkingCase={jest.fn()}
          onChange={jest.fn()}
          updateDefendantState={jest.fn()}
        />
      </LocaleProvider>
    </MockedProvider>,
  )
}

const lastSkip = () => {
  const lastCall = mockUseNationalRegistry.mock.calls.at(-1)
  return lastCall?.[1]?.skip
}

describe('DefendantInfo national registry skip behaviour', () => {
  beforeEach(() => {
    mockUseNationalRegistry.mockReturnValue({
      personData: undefined,
      businessData: undefined,
      error: undefined,
      isLoading: false,
      notFound: false,
    })
    mockUseNationalRegistry.mockClear()
  })

  test('skips the lookup for an existing defendant that already has data', async () => {
    renderDefendantInfo({
      nationalId: '0101302399',
      name: 'Jón Jónsson',
      address: 'Gata 1',
    })

    await screen.findByTestId('inputNationalId')

    expect(lastSkip()).toBe(true)
  })

  test('does not skip the lookup when there is no existing data', async () => {
    renderDefendantInfo({ nationalId: '0101302399' })

    await screen.findByTestId('inputNationalId')

    expect(lastSkip()).toBe(false)
  })

  test('re-runs the lookup once the user edits the national id', async () => {
    renderDefendantInfo({
      nationalId: '0101302399',
      name: 'Jón Jónsson',
      address: 'Gata 1',
    })

    const input = await screen.findByTestId('inputNationalId')

    expect(lastSkip()).toBe(true)

    // Simulate the user actively changing the national id.
    fireEvent.change(input, { target: { value: '0202304499' } })

    expect(lastSkip()).toBe(false)
  })
})
