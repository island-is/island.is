import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import type { SdfScreen } from '../lib/graphql'
import { executeAction, fetchScreen } from '../lib/graphql'
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

  describe('screen navigation', () => {
    const page2: SdfScreen = {
      ...screen,
      page: { ...screen.page, id: 'page-2', index: 1 },
    }
    let pushState: jest.SpyInstance
    let replaceState: jest.SpyInstance

    beforeEach(() => {
      pushState = jest.spyOn(window.history, 'pushState')
      replaceState = jest.spyOn(window.history, 'replaceState')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('sends the current screen id with every action and pushes the new one', async () => {
      ;(executeAction as jest.Mock).mockResolvedValue(page2)
      const { result } = renderHook(() => useFormActions('app-1', screen), {
        wrapper,
      })

      await act(async () => {
        await result.current.nextPage()
      })

      expect(executeAction).toHaveBeenCalledWith(
        'app-1',
        'NEXT_PAGE',
        'page-1',
        undefined,
        'is',
        undefined,
        undefined,
        undefined,
      )
      expect(result.current.screen.page.id).toBe('page-2')
      expect(pushState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining('screen=page-2'),
      )

      await act(async () => {
        await result.current.prevPage()
      })

      expect(executeAction).toHaveBeenLastCalledWith(
        'app-1',
        'PREV_PAGE',
        'page-2',
        undefined,
        'is',
        undefined,
        undefined,
        undefined,
      )
    })

    it('replaces the history entry when the response carries a notice', async () => {
      ;(executeAction as jest.Mock).mockResolvedValue({
        ...page2,
        notice: { code: 'SCREEN_UNAVAILABLE', message: 'Not available' },
      })
      const { result } = renderHook(() => useFormActions('app-1', screen), {
        wrapper,
      })

      await act(async () => {
        await result.current.nextPage()
      })

      expect(pushState).not.toHaveBeenCalled()
      expect(replaceState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining('screen=page-2'),
      )
      expect(result.current.screen.notice?.message).toBe('Not available')
    })

    it('leaves the address bar alone when the screen does not change', async () => {
      ;(executeAction as jest.Mock).mockResolvedValue(screen)
      const { result } = renderHook(() => useFormActions('app-1', screen), {
        wrapper,
      })

      await act(async () => {
        await result.current.nextPage()
      })

      expect(pushState).not.toHaveBeenCalled()
      expect(replaceState).not.toHaveBeenCalled()
    })

    it('fetches the screen named by the address bar on back/forward', async () => {
      ;(fetchScreen as jest.Mock).mockResolvedValue(page2)
      const { result } = renderHook(() => useFormActions('app-1', screen), {
        wrapper,
      })

      window.history.replaceState(null, '', '/?screen=page-2')
      replaceState.mockClear()
      await act(async () => {
        window.dispatchEvent(new PopStateEvent('popstate'))
        await Promise.resolve()
      })

      expect(fetchScreen).toHaveBeenCalledWith('app-1', 'page-2', 'is')
      expect(result.current.screen.page.id).toBe('page-2')
      // The address bar already names the screen that was shown.
      expect(pushState).not.toHaveBeenCalled()
      expect(replaceState).not.toHaveBeenCalled()
    })

    describe('responses arriving out of order', () => {
      const page3: SdfScreen = {
        ...screen,
        page: { ...screen.page, id: 'page-3', index: 2 },
      }
      const deferred = <T,>() => {
        let resolve: (value: T) => void = () => undefined
        const promise = new Promise<T>((r) => {
          resolve = r
        })
        return { promise, resolve }
      }

      it('drops a slow action response once the user has gone back', async () => {
        const nextPageResponse = deferred<SdfScreen>()
        ;(executeAction as jest.Mock).mockReturnValue(nextPageResponse.promise)
        ;(fetchScreen as jest.Mock).mockResolvedValue(screen)
        const { result } = renderHook(() => useFormActions('app-1', screen), {
          wrapper,
        })

        await act(async () => {
          await result.current.nextPage()
        })
        window.history.replaceState(null, '', '/?screen=page-0')
        await act(async () => {
          window.dispatchEvent(new PopStateEvent('popstate'))
          await Promise.resolve()
        })
        await act(async () => {
          nextPageResponse.resolve(page2)
          await Promise.resolve()
        })

        expect(result.current.screen.page.id).toBe('page-1')
        expect(pushState).not.toHaveBeenCalled()
      })

      it('drops a slow refresh once a navigation has completed', async () => {
        const refetchResponse = deferred<SdfScreen>()
        ;(executeAction as jest.Mock).mockImplementation(
          (_id: string, actionType: string) =>
            actionType === 'REFETCH'
              ? refetchResponse.promise
              : Promise.resolve(page2),
        )
        const { result } = renderHook(() => useFormActions('app-1', screen), {
          wrapper,
        })

        await act(async () => {
          await result.current.refetch()
        })
        await act(async () => {
          await result.current.nextPage()
        })
        expect(result.current.screen.page.id).toBe('page-2')

        await act(async () => {
          refetchResponse.resolve(screen)
          await Promise.resolve()
        })

        expect(result.current.screen.page.id).toBe('page-2')
        expect(replaceState).not.toHaveBeenCalled()
      })

      it('drops a refresh that started during a navigation and finishes after it', async () => {
        const nextPageResponse = deferred<SdfScreen>()
        const refetchResponse = deferred<SdfScreen>()
        ;(executeAction as jest.Mock).mockImplementation(
          (_id: string, actionType: string) =>
            actionType === 'NEXT_PAGE'
              ? nextPageResponse.promise
              : refetchResponse.promise,
        )
        const { result } = renderHook(() => useFormActions('app-1', screen), {
          wrapper,
        })

        await act(async () => {
          await result.current.nextPage()
        })
        await act(async () => {
          await result.current.refetch()
        })
        await act(async () => {
          nextPageResponse.resolve(page2)
          await Promise.resolve()
        })
        await act(async () => {
          refetchResponse.resolve(screen)
          await Promise.resolve()
        })

        expect(result.current.screen.page.id).toBe('page-2')
        expect(replaceState).not.toHaveBeenCalled()
        expect(window.location.search).toContain('screen=page-2')
      })

      it('still applies a navigation when a refresh started after it', async () => {
        const nextPageResponse = deferred<SdfScreen>()
        ;(executeAction as jest.Mock).mockImplementation(
          (_id: string, actionType: string) =>
            actionType === 'NEXT_PAGE'
              ? nextPageResponse.promise
              : Promise.resolve(screen),
        )
        const { result } = renderHook(() => useFormActions('app-1', screen), {
          wrapper,
        })

        await act(async () => {
          await result.current.nextPage()
        })
        await act(async () => {
          await result.current.refetch()
        })
        await act(async () => {
          nextPageResponse.resolve(page3)
          await Promise.resolve()
        })

        expect(result.current.screen.page.id).toBe('page-3')
        expect(pushState).toHaveBeenCalledWith(
          null,
          '',
          expect.stringContaining('screen=page-3'),
        )
      })
    })

    it('goToScreen fetches the screen and pushes it', async () => {
      ;(fetchScreen as jest.Mock).mockResolvedValue(page2)
      const { result } = renderHook(() => useFormActions('app-1', screen), {
        wrapper,
      })

      await act(async () => {
        result.current.goToScreen('page-2')
        await Promise.resolve()
      })

      expect(fetchScreen).toHaveBeenCalledWith('app-1', 'page-2', 'is')
      expect(result.current.screen.page.id).toBe('page-2')
      expect(pushState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining('screen=page-2'),
      )
    })
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
