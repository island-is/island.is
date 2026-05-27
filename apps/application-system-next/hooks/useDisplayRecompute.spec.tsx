import { act, renderHook } from '@testing-library/react'

import { validateAction } from '../lib/graphql'
import { useDisplayRecompute } from './useDisplayRecompute'

jest.mock('../lib/graphql', () => ({
  validateAction: jest.fn(),
}))

const components = [
  {
    __typename: 'SdfTextField',
    id: 'input1',
    label: 'Input 1',
  },
  {
    __typename: 'SdfDisplayField',
    id: 'displayField',
    label: 'Display Field',
  },
]

const clientComputedComponents = [
  {
    __typename: 'SdfDisplayField',
    id: 'displayField',
    label: 'Display Field',
    clientValueExpression: {
      operator: 'SUM',
      args: [
        { operator: 'GET', args: ['input1'] },
        { operator: 'GET', args: ['input2'] },
        { operator: 'GET', args: ['input3'] },
      ],
    },
  },
]

describe('useDisplayRecompute', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('ignores stale validate responses after answers change while debounce is pending', async () => {
    let resolveFirst: (value: { displayValues: Record<string, string> }) => void =
      () => undefined

    ;(validateAction as jest.Mock)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirst = resolve
        }),
      )
      .mockResolvedValueOnce({ displayValues: { displayField: '356' } })

    const { result, rerender } = renderHook(
      ({ answers }) =>
        useDisplayRecompute('app-1', components, answers, 'is', 7),
      {
        initialProps: { answers: {} as Record<string, unknown> },
      },
    )

    await act(async () => {
      jest.advanceTimersByTime(300)
    })

    rerender({ answers: { input1: '2', input2: '32', input3: '322' } })

    await act(async () => {
      resolveFirst({ displayValues: { displayField: '0' } })
      await Promise.resolve()
    })

    expect(result.current).toEqual({})

    await act(async () => {
      jest.advanceTimersByTime(300)
      await Promise.resolve()
    })

    expect(result.current).toEqual({ displayField: '356' })
    expect(validateAction).toHaveBeenLastCalledWith(
      'app-1',
      { input1: '2', input2: '32', input3: '322' },
      [],
      'is',
      7,
    )
  })

  it('does not validate when every display field is client-computed', async () => {
    renderHook(() =>
      useDisplayRecompute(
        'app-1',
        clientComputedComponents,
        { input1: '23', input2: '23', input3: '31' },
        'is',
        7,
      ),
    )

    await act(async () => {
      jest.advanceTimersByTime(300)
      await Promise.resolve()
    })

    expect(validateAction).not.toHaveBeenCalled()
  })

  it('does not validate when only answers outside the current page change', async () => {
    ;(validateAction as jest.Mock).mockResolvedValue({
      displayValues: { displayField: '1' },
    })

    const { rerender } = renderHook(
      ({ answers }) =>
        useDisplayRecompute('app-1', components, answers, 'is', 7),
      {
        initialProps: {
          answers: { input1: '1', previousPageAnswer: 'a' } as Record<
            string,
            unknown
          >,
        },
      },
    )

    await act(async () => {
      jest.advanceTimersByTime(300)
      await Promise.resolve()
    })

    expect(validateAction).toHaveBeenCalledTimes(1)

    rerender({ answers: { input1: '1', previousPageAnswer: 'b' } })

    await act(async () => {
      jest.advanceTimersByTime(300)
      await Promise.resolve()
    })

    expect(validateAction).toHaveBeenCalledTimes(1)
  })

  it('warns in development when display recompute fails', async () => {
    ;(validateAction as jest.Mock).mockRejectedValue(new Error('network down'))

    renderHook(() =>
      useDisplayRecompute('app-1', components, { input1: '1' }, 'is', 7),
    )

    await act(async () => {
      jest.advanceTimersByTime(300)
      await Promise.resolve()
    })

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('SDF display recompute failed'),
      expect.any(Error),
    )
  })
})
