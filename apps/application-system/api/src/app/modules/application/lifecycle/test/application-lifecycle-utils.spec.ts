import { createApplication } from '@island.is/application/testing'
import { PruningApplication } from '@island.is/application/types'
import addMilliseconds from 'date-fns/addMilliseconds'
import {
  DEFAULT_POST_PRUNE_DELAY,
  getPostPruneAt,
} from '../application-lifecycle.utils'

describe('getPostPruneAt', () => {
  const now = new Date('2026-01-15T12:00:00.000Z')
  const application = createApplication({
    answers: { childDate: '2026-06-01' },
  }) as PruningApplication

  it('uses the default delay without an override', () => {
    expect(getPostPruneAt(application, undefined, { now })).toEqual(
      addMilliseconds(now, DEFAULT_POST_PRUNE_DELAY),
    )
  })

  it('adds a delay given in milliseconds', () => {
    const day = 24 * 3600 * 1000

    expect(getPostPruneAt(application, day, { now })).toEqual(
      addMilliseconds(now, day),
    )
  })

  it('takes the date a function gives for the application', () => {
    const override = jest.fn(
      (app: PruningApplication) => new Date(app.answers.childDate as string),
    )

    expect(getPostPruneAt(application, override, { now })).toEqual(
      new Date('2026-06-01'),
    )
    expect(override).toHaveBeenCalledWith(application)
  })

  it('uses the default delay when the function gives no date', () => {
    expect(getPostPruneAt(application, () => undefined, { now })).toEqual(
      addMilliseconds(now, DEFAULT_POST_PRUNE_DELAY),
    )
  })

  it('uses the default delay and reports the error when the function throws', () => {
    const error = new Error('No child')
    const onError = jest.fn()

    expect(
      getPostPruneAt(
        application,
        () => {
          throw error
        },
        { now, onError },
      ),
    ).toEqual(addMilliseconds(now, DEFAULT_POST_PRUNE_DELAY))
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('uses the default delay and reports the error when the function gives an invalid date', () => {
    const onError = jest.fn()

    expect(
      getPostPruneAt(application, () => new Date(''), { now, onError }),
    ).toEqual(addMilliseconds(now, DEFAULT_POST_PRUNE_DELAY))
    expect(onError).toHaveBeenCalledWith(expect.any(Error))
  })
})
