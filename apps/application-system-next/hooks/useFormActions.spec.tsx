import { act, renderHook } from '@testing-library/react'

import type { SdfScreen } from '../lib/graphql'
import { executeAction } from '../lib/graphql'
import { useFormActions } from './useFormActions'

jest.mock('../lib/graphql', () => ({
  executeAction: jest.fn(),
}))

const screen: SdfScreen = {
  applicationId: 'app-1',
  locale: 'is',
  header: {
    title: 'Title',
  },
  stepper: {
    sections: [],
    activeSectionIndex: 0,
    activeSubSectionIndex: 0,
  },
  page: {
    id: 'page-1',
    index: 0,
    sectionIndex: 0,
    subSectionIndex: 0,
    components: [],
    errors: [],
  },
  footer: {
    buttons: [],
    canGoBack: false,
  },
  answers: {},
}

describe('useFormActions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('tracks pending component ids for targeted refetch actions', async () => {
    let resolveAction: (value: SdfScreen) => void = () => undefined
    ;(executeAction as jest.Mock).mockReturnValue(
      new Promise<SdfScreen>((resolve) => {
        resolveAction = resolve
      }),
    )

    const { result } = renderHook(() => useFormActions('app-1', screen))

    await act(async () => {
      await result.current.dispatch(
        'REFETCH',
        undefined,
        undefined,
        undefined,
        ['getPropertyInfo'],
        ['propertyInfoTable'],
      )
    })

    expect(result.current.pendingRefetchTargets).toEqual(['propertyInfoTable'])

    await act(async () => {
      resolveAction(screen)
      await Promise.resolve()
    })

    expect(result.current.pendingRefetchTargets).toEqual([])
  })
})
