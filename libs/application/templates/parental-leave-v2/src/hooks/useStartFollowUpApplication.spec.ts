import { act, renderHook } from '@testing-library/react'
import { ApplicationTypes } from '@island.is/application/types'

import { ApplicationAction } from '../constants'
import { useStartFollowUpApplication } from './useStartFollowUpApplication'

const mockNavigate = jest.fn()
const mockUpdateApplication = jest.fn()
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
      if (document === documents.CREATE_APPLICATION)
        return [mockCreateApplication, { loading: false }]
      throw new Error('Unexpected mutation')
    },
  }
})

describe('useStartFollowUpApplication', () => {
  const previousApplicationId = 'previous-application'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates the follow-up for the leave, marks its action and opens it', async () => {
    mockCreateApplication.mockResolvedValue({
      data: { createApplication: { id: 'new-application' } },
    })
    const { result } = renderHook(() =>
      useStartFollowUpApplication(ApplicationAction.RESIDENCE_GRANT),
    )

    await act(() =>
      result.current.start({
        previousApplicationId,
        previousAnswersPatch: {
          applicationId: 'current-application',
          answers: { hasAppliedForReidenceGrant: 'yes' },
        },
      }),
    )

    expect(mockCreateApplication).toHaveBeenCalledWith({
      variables: {
        input: {
          typeId: ApplicationTypes.PARENTAL_LEAVE_V2,
          initialQuery: previousApplicationId,
        },
      },
    })
    expect(mockUpdateApplication).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'new-application',
          answers: { applicationAction: ApplicationAction.RESIDENCE_GRANT },
        },
        locale: 'is',
      },
    })
    expect(mockUpdateApplication).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'current-application',
          answers: { hasAppliedForReidenceGrant: 'yes' },
        },
        locale: 'is',
      },
    })
    expect(mockNavigate).toHaveBeenCalledWith(
      '/faedingarorlof-v2/new-application',
    )
    expect(result.current.error).toBeNull()
  })

  it('reports an error and stays put when the application is not created', async () => {
    mockCreateApplication.mockResolvedValue({ data: {} })
    const { result } = renderHook(() =>
      useStartFollowUpApplication(ApplicationAction.RESIDENCE_GRANT),
    )

    await act(() => result.current.start({ previousApplicationId }))

    expect(mockUpdateApplication).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
    expect(result.current.error).toBeInstanceOf(Error)
  })
})
