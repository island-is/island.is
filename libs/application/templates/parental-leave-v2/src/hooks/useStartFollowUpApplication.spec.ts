import { act, renderHook } from '@testing-library/react'
import { DefaultEvents } from '@island.is/application/types'

import { ApplicationAction } from '../constants'
import { useStartFollowUpApplication } from './useStartFollowUpApplication'

const mockNavigate = jest.fn()
const mockUpdateApplication = jest.fn()
const mockSubmitApplication = jest.fn()
const mockCreateApplication = jest.fn()

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ locale: 'is' }),
}))

jest.mock('@apollo/client', () => {
  const documents = jest.requireActual('@island.is/application/graphql')

  return {
    ...jest.requireActual('@apollo/client'),
    useMutation: (document: unknown) => {
      if (document === documents.UPDATE_APPLICATION)
        return [mockUpdateApplication]
      if (document === documents.SUBMIT_APPLICATION)
        return [mockSubmitApplication]
      if (document === documents.CREATE_APPLICATION)
        return [mockCreateApplication, { loading: false }]
      throw new Error('Unexpected mutation')
    },
  }
})

describe('useStartFollowUpApplication – in place', () => {
  const previousApplicationId = 'previous-application'
  const applicationId = 'current-application'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const startChange = async (refetch = jest.fn()) => {
    const { result } = renderHook(() =>
      useStartFollowUpApplication(ApplicationAction.CHANGE),
    )

    await act(() =>
      result.current.start({ previousApplicationId, applicationId, refetch }),
    )

    return { result, refetch }
  }

  it('sends the follow-up answers only with the submit', async () => {
    mockSubmitApplication.mockResolvedValue({ data: {} })

    const { refetch } = await startChange()

    expect(mockUpdateApplication).not.toHaveBeenCalled()
    expect(mockSubmitApplication).toHaveBeenCalledWith({
      variables: {
        input: {
          id: applicationId,
          event: DefaultEvents.SUBMIT,
          answers: {
            applicationAction: ApplicationAction.CHANGE,
            initialQuery: previousApplicationId,
          },
        },
        locale: 'is',
      },
    })
    expect(refetch).toHaveBeenCalled()
  })

  it('leaves the application untouched when the submit fails', async () => {
    const failure = new Error('VMST does not list the leave')
    mockSubmitApplication.mockRejectedValue(failure)

    const { result, refetch } = await startChange()

    // Nothing saved before the submit, so the application is still a regular
    // one and the applicant can go back and pick another child.
    expect(mockUpdateApplication).not.toHaveBeenCalled()
    expect(refetch).not.toHaveBeenCalled()
    expect(result.current.error).toBe(failure)
  })
})
