import { act, renderHook } from '@testing-library/react'

import { validateAction } from '../lib/graphql'
import { useDisplayRecompute } from './useDisplayRecompute'

jest.mock('../lib/graphql', () => ({
  validateAction: jest.fn(),
}))

const components = [
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
  })

  afterEach(() => {
    jest.useRealTimers()
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
})
