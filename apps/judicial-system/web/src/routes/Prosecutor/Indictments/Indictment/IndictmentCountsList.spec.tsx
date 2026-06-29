import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Case,
  CaseType,
  IndictmentCount,
  IndictmentSubtype,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useIndictmentCounts } from '@island.is/judicial-system-web/src/utils/hooks'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'
import {
  getIndictmentCountWarningMessage,
  isIndictmentCountComplete,
} from '@island.is/judicial-system-web/src/utils/validate'

import { IndictmentCountsList } from './IndictmentCountsList'

jest.mock('./IndictmentCount', () => ({
  IndictmentCount: () => <div data-testid="indictment-count" />,
}))

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useIndictmentCounts',
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
)

jest.mock('@island.is/judicial-system-web/src/utils/validate', () => ({
  ...jest.requireActual('@island.is/judicial-system-web/src/utils/validate'),
  isIndictmentCountComplete: jest.fn(),
  getIndictmentCountWarningMessage: jest.fn(),
}))

const mockUseIndictmentCounts = useIndictmentCounts as jest.MockedFunction<
  typeof useIndictmentCounts
>
const mockIsIndictmentCountComplete =
  isIndictmentCountComplete as jest.MockedFunction<
    typeof isIndictmentCountComplete
  >
const mockGetIndictmentCountWarningMessage =
  getIndictmentCountWarningMessage as jest.MockedFunction<
    typeof getIndictmentCountWarningMessage
  >

const POLICE_CASE_NUMBER_EARLIER = '007-2021-001'
const POLICE_CASE_NUMBER_LATER = '007-2021-002'

const createWorkingCase = (indictmentCounts: IndictmentCount[]): Case => ({
  ...mockCase(CaseType.INDICTMENT),
  id: 'test-case-id',
  indictmentCounts,
  crimeScenes: {
    [POLICE_CASE_NUMBER_EARLIER]: { date: '2021-01-01T00:00:00.000Z' },
    [POLICE_CASE_NUMBER_LATER]: { date: '2021-02-01T00:00:00.000Z' },
  },
  indictmentSubtypes: {
    [POLICE_CASE_NUMBER_EARLIER]: [IndictmentSubtype.THEFT],
    [POLICE_CASE_NUMBER_LATER]: [IndictmentSubtype.THEFT],
  },
})

describe('IndictmentCountsList', () => {
  let user: ReturnType<typeof userEvent.setup>
  const reorderIndictmentCounts = jest.fn()
  const setWorkingCase = jest.fn()
  const handleUpdateIndictmentCount = jest.fn()
  const handleDeleteIndictmentCount = jest.fn()
  const updateIndictmentCountState = jest.fn()

  beforeEach(() => {
    user = userEvent.setup()
    jest.clearAllMocks()
    localStorage.clear()

    mockUseIndictmentCounts.mockReturnValue({
      reorderIndictmentCounts,
    } as unknown as ReturnType<typeof useIndictmentCounts>)

    mockIsIndictmentCountComplete.mockReturnValue(true)
    mockGetIndictmentCountWarningMessage.mockReturnValue(undefined)
    reorderIndictmentCounts.mockResolvedValue({ id: 'test-case-id' })
  })

  const renderComponent = (workingCase: Case) =>
    render(
      <IntlProviderWrapper>
        <IndictmentCountsList
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          handleUpdateIndictmentCount={handleUpdateIndictmentCount}
          handleDeleteIndictmentCount={handleDeleteIndictmentCount}
          updateIndictmentCountState={updateIndictmentCountState}
        />
      </IntlProviderWrapper>,
    )

  it('renders section title Ákæruliðir', async () => {
    const workingCase = createWorkingCase([
      {
        id: 'count-1',
        displayOrder: 0,
        policeCaseNumber: POLICE_CASE_NUMBER_EARLIER,
        incidentDescription: 'Incident',
        legalArguments: 'Legal arguments',
      } as IndictmentCount,
    ])

    renderComponent(workingCase)

    expect(await screen.findByText('Ákæruliðir')).toBeInTheDocument()
  })

  it('calls reorder with chronological displayOrder when sort button is clicked', async () => {
    const workingCase = createWorkingCase([
      {
        id: 'count-later',
        displayOrder: 0,
        policeCaseNumber: POLICE_CASE_NUMBER_LATER,
        incidentDescription: 'Later incident',
        legalArguments: 'Legal arguments',
      } as IndictmentCount,
      {
        id: 'count-earlier',
        displayOrder: 1,
        policeCaseNumber: POLICE_CASE_NUMBER_EARLIER,
        incidentDescription: 'Earlier incident',
        legalArguments: 'Legal arguments',
      } as IndictmentCount,
    ])

    renderComponent(workingCase)

    await user.click(
      screen.getByRole('button', { name: 'Raða ákæruliðum í tímaröð' }),
    )

    await waitFor(() => {
      expect(reorderIndictmentCounts).toHaveBeenCalledWith('test-case-id', [
        { id: 'count-earlier', displayOrder: 0 },
        { id: 'count-later', displayOrder: 1 },
      ])
    })
  })

  it('shows warning icon on incomplete count accordion label', async () => {
    mockGetIndictmentCountWarningMessage.mockReturnValue('Vantar atvikalýsingu')

    const workingCase = createWorkingCase([
      {
        id: 'count-incomplete',
        displayOrder: 0,
        policeCaseNumber: POLICE_CASE_NUMBER_EARLIER,
      } as IndictmentCount,
    ])

    renderComponent(workingCase)

    expect(mockGetIndictmentCountWarningMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'count-incomplete' }),
      workingCase,
    )

    const dragHandle = screen.getByTestId('indictmentCountDragHandle')
    const warningIconPlaceholder = Array.from(
      document.querySelectorAll('[class*="Icon_placeholder"]'),
    ).find((element) => !dragHandle.contains(element))

    expect(warningIconPlaceholder).toBeDefined()
    await user.hover(warningIconPlaceholder as Element)

    expect(await screen.findByText('Vantar atvikalýsingu')).toBeInTheDocument()
  })

  it('expands and collapses all indictment count accordions', async () => {
    const workingCase = createWorkingCase([
      {
        id: 'count-1',
        displayOrder: 0,
        policeCaseNumber: POLICE_CASE_NUMBER_EARLIER,
        incidentDescription: 'Incident 1',
        legalArguments: 'Legal arguments',
      } as IndictmentCount,
      {
        id: 'count-2',
        displayOrder: 1,
        policeCaseNumber: POLICE_CASE_NUMBER_LATER,
        incidentDescription: 'Incident 2',
        legalArguments: 'Legal arguments',
      } as IndictmentCount,
    ])

    renderComponent(workingCase)

    const countOneAccordion = screen.getByRole('button', {
      name: /1\. 007-2021-001/,
    })
    const countTwoAccordion = screen.getByRole('button', {
      name: /2\. 007-2021-002/,
    })

    expect(countOneAccordion).toHaveAttribute('aria-expanded', 'true')
    expect(countTwoAccordion).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: 'Loka öllum' }))

    await waitFor(() => {
      expect(countOneAccordion).toHaveAttribute('aria-expanded', 'false')
      expect(countTwoAccordion).toHaveAttribute('aria-expanded', 'false')
    })

    expect(
      screen.getByRole('button', { name: 'Opna alla' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Opna alla' }))

    await waitFor(() => {
      expect(countOneAccordion).toHaveAttribute('aria-expanded', 'true')
      expect(countTwoAccordion).toHaveAttribute('aria-expanded', 'true')
    })

    expect(
      screen.getByRole('button', { name: 'Loka öllum' }),
    ).toBeInTheDocument()
  })
})
