import { act, renderHook } from '@testing-library/react'

import useSerializedSave from './index'

// A persist whose outcome the test decides later
const deferred = () => {
  let settle: (saved: boolean) => void = () => undefined
  const persist = jest.fn(
    () =>
      new Promise<boolean>((resolve) => {
        settle = resolve
      }),
  )

  return { persist, settle: (saved: boolean) => settle(saved) }
}

describe('useSerializedSave', () => {
  const setup = () => {
    const { result } = renderHook(() => useSerializedSave<string>())
    const rollback = jest.fn()
    const save = (
      value: string,
      persist: () => Promise<boolean>,
      key = 'field',
    ) =>
      result.current({ key, confirmed: 'confirmed', value, persist, rollback })

    return { save, rollback }
  }

  it('runs the saves of a key one at a time, in order', async () => {
    const { save } = setup()
    const first = deferred()
    const second = deferred()

    save('a', first.persist)
    save('b', second.persist)

    expect(first.persist).toHaveBeenCalledTimes(1)
    expect(second.persist).not.toHaveBeenCalled()

    await act(async () => {
      first.settle(true)
    })

    expect(second.persist).toHaveBeenCalledTimes(1)
  })

  it('rolls a failed save back to the confirmed value', async () => {
    const { save, rollback } = setup()

    const result = await save('a', () => Promise.resolve(false))

    expect(result).toBe(false)
    expect(rollback).toHaveBeenCalledWith('confirmed')
  })

  it('treats a throwing persist as a failed save', async () => {
    const { save, rollback } = setup()

    const result = await save('a', () => Promise.reject(new Error('boom')))

    expect(result).toBe(false)
    expect(rollback).toHaveBeenCalledWith('confirmed')
  })

  // The first save's value was never confirmed, so it must not become the
  // rollback target of the second.
  it('rolls back to the confirmed value when two queued saves both fail', async () => {
    const { save, rollback } = setup()
    const first = deferred()
    const second = deferred()

    const firstResult = save('a', first.persist)
    const secondResult = save('b', second.persist)

    await act(async () => {
      first.settle(false)
    })
    expect(rollback).not.toHaveBeenCalled()

    await act(async () => {
      second.settle(false)
    })

    expect(await firstResult).toBe(false)
    expect(await secondResult).toBe(false)
    expect(rollback).toHaveBeenCalledTimes(1)
    expect(rollback).toHaveBeenCalledWith('confirmed')
  })

  it('does not roll back a failed save that a later successful save superseded', async () => {
    const { save, rollback } = setup()
    const first = deferred()
    const second = deferred()

    const firstResult = save('a', first.persist)
    const secondResult = save('b', second.persist)

    await act(async () => {
      first.settle(false)
    })
    await act(async () => {
      second.settle(true)
    })

    expect(await firstResult).toBe(false)
    expect(await secondResult).toBe(true)
    expect(rollback).not.toHaveBeenCalled()
  })

  it('rolls back to the value an earlier save confirmed', async () => {
    const { save, rollback } = setup()
    const first = deferred()
    const second = deferred()

    const firstResult = save('a', first.persist)
    const secondResult = save('b', second.persist)

    await act(async () => {
      first.settle(true)
    })
    await act(async () => {
      second.settle(false)
    })

    // The first save is no longer the latest, so its success drives nothing
    expect(await firstResult).toBe(false)
    expect(await secondResult).toBe(false)
    expect(rollback).toHaveBeenCalledWith('a')
  })

  it('keeps the saves of different keys independent', async () => {
    const { save, rollback } = setup()
    const first = deferred()

    save('a', first.persist, 'one')
    const otherResult = await save('b', () => Promise.resolve(true), 'two')

    expect(otherResult).toBe(true)
    expect(rollback).not.toHaveBeenCalled()

    await act(async () => {
      first.settle(false)
    })

    expect(rollback).toHaveBeenCalledWith('confirmed')
  })
})
