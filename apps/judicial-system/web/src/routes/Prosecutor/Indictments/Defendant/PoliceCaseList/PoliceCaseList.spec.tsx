import { useState } from 'react'
import faker from 'faker'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  Case,
  CaseOrigin,
  CaseState,
  CaseType,
  IndictmentSubtype,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockUser } from '@island.is/judicial-system-web/src/utils/mocks'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import { PoliceCaseList } from './PoliceCaseList'

const mockUpdateCaseMutation = jest.fn()

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useCase/updateCase.generated',
  () => ({
    useUpdateCaseMutation: () => [mockUpdateCaseMutation, { loading: false }],
  }),
)

const policeCaseNumber = '007-2024-042535'

const mockIndictment = (): Case => ({
  id: faker.datatype.uuid(),
  created: faker.date.past().toISOString(),
  modified: faker.date.past().toISOString(),
  type: CaseType.INDICTMENT,
  origin: CaseOrigin.UNKNOWN,
  state: CaseState.DRAFT,
  policeCaseNumbers: [policeCaseNumber],
  indictmentSubtypes: {
    [policeCaseNumber]: [IndictmentSubtype.TRAFFIC_VIOLATION],
  },
  crimeScenes: {},
})

const renderPoliceCaseList = (theCase: Case) => {
  const PoliceCaseListWrapper = () => {
    const [workingCase, setWorkingCase] = useState<Case>(theCase)

    return (
      <MockedProvider mocks={[]} addTypename={false}>
        <IntlProviderWrapper>
          <UserContext.Provider value={{ user: mockUser(UserRole.PROSECUTOR) }}>
            <FormContext.Provider
              value={{
                workingCase,
                setWorkingCase,
                isLoadingWorkingCase: false,
                caseNotFound: false,
                isCaseUpToDate: true,
                isCreating: false,
                refreshCase: jest.fn(),
                getCase: jest.fn(),
              }}
            >
              <PoliceCaseList />
            </FormContext.Provider>
          </UserContext.Provider>
        </IntlProviderWrapper>
      </MockedProvider>
    )
  }

  return render(<PoliceCaseListWrapper />)
}

describe('PoliceCaseList', () => {
  beforeEach(() => {
    mockUpdateCaseMutation.mockReset()
    mockUpdateCaseMutation.mockResolvedValue({ data: { updateCase: {} } })
  })

  it('should not send a police case which has not been given a number to the server', async () => {
    // Arrange
    const user = userEvent.setup()
    renderPoliceCaseList(mockIndictment())

    // Act
    await user.click(screen.getByTestId('addPoliceCaseInfoButton'))

    // Assert
    expect(await screen.findByTestId('policeCaseNumber1')).toBeInTheDocument()
    expect(mockUpdateCaseMutation).not.toHaveBeenCalled()
  })

  it('should focus the number of a police case which has just been added', async () => {
    // Arrange
    const user = userEvent.setup()
    renderPoliceCaseList(mockIndictment())

    // Act
    await user.click(screen.getByTestId('addPoliceCaseInfoButton'))

    // Assert
    expect(await screen.findByTestId('policeCaseNumber1')).toHaveFocus()
  })

  it('should not focus a police case number when the case is opened', async () => {
    // Arrange
    renderPoliceCaseList(mockIndictment())

    // Assert
    expect(screen.getByTestId('policeCaseNumber0')).not.toHaveFocus()
  })

  it('should not send a police case number which has been cleared to the server', async () => {
    // Arrange
    const user = userEvent.setup()
    renderPoliceCaseList(mockIndictment())

    // Act
    await user.clear(screen.getByTestId('policeCaseNumber0'))
    await user.tab()

    // Assert
    expect(screen.getByTestId('policeCaseNumber0')).toHaveValue('')
    expect(mockUpdateCaseMutation).not.toHaveBeenCalled()
  })

  it('should send a police case to the server once it has been given a number', async () => {
    // Arrange
    const user = userEvent.setup()
    renderPoliceCaseList(mockIndictment())

    // Act
    await user.click(screen.getByTestId('addPoliceCaseInfoButton'))
    await user.type(await screen.findByTestId('policeCaseNumber1'), '00720241')
    await user.tab()

    // Assert
    expect(mockUpdateCaseMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          input: expect.objectContaining({
            policeCaseNumbers: [policeCaseNumber, '007-2024-1'],
          }),
        }),
      }),
    )
  })
})
