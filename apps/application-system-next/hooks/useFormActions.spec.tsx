import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import type { SdfScreen } from '../lib/graphql'
import { executeAction } from '../lib/graphql'
import { useFormActions } from './useFormActions'

jest.mock('../lib/graphql', () => ({
  executeAction: jest.fn(),
  fetchScreen: jest.fn(),
}))

// useFormActions reads the active locale via useLocale(), which relies on
// react-intl's IntlProvider being in the tree. LocaleContext's default already
// reports `lang: 'is'`, so no LocaleProvider is needed for these tests.
const wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="is" messages={{}}>
    {children}
  </IntlProvider>
)

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

    const { result } = renderHook(() => useFormActions('app-1', screen), {
      wrapper,
    })

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

  it('publishes a fresh answer snapshot when local answers change', () => {
    const { result } = renderHook(() => useFormActions('app-1', screen), {
      wrapper,
    })

    act(() => {
      result.current.onAnswerChange('input1', '23')
    })

    expect(result.current.answers.current).toEqual({ input1: '23' })
    expect(result.current.answerSnapshot).toEqual({ input1: '23' })
  })
})
