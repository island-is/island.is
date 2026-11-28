import {
  buildForm,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import type { BffUser } from '@island.is/shared/types'

import { screenHasBeenAnswered } from '../answerUtils'
import { convertFormToScreens } from '../convertFormToScreens'
import { findCurrentScreen } from '../moveToScreen'

const applicationWith = (answers: FormValue, state = 'draft') =>
  ({ answers, state } as Application)
const userWith = (nationalId: string) =>
  ({ scopes: [], profile: { nationalId } } as unknown as BffUser)

// An id that depends on the user, so each user keeps a separate answer.
const perUserId = (_application: Application, user?: BffUser) =>
  `answer-${user?.profile.nationalId}`

const screensFor = (children: ReturnType<typeof buildTextField>[]) =>
  convertFormToScreens(
    buildForm({ id: 'form', title: 'Form', children }),
    {},
    {},
    null,
  )

describe('screenHasBeenAnswered', () => {
  it('looks up the answer by a static id', () => {
    const [screen] = screensFor([buildTextField({ id: 'name', title: 'Name' })])

    expect(screenHasBeenAnswered(screen, applicationWith({ name: 'a' }))).toBe(
      true,
    )
    expect(screenHasBeenAnswered(screen, applicationWith({}))).toBe(false)
  })

  it('resolves an id that depends on the user', () => {
    const [screen] = screensFor([
      buildTextField({ id: perUserId, title: 'Name' }),
    ])
    const application = applicationWith({ 'answer-1': 'x' })

    expect(
      screenHasBeenAnswered(screen, application, false, userWith('1')),
    ).toBe(true)
    expect(
      screenHasBeenAnswered(screen, application, false, userWith('2')),
    ).toBe(false)
  })

  it('resolves an id that depends on the application', () => {
    const [screen] = screensFor([
      buildTextField({
        id: (application: Application) => `answer-${application.state}`,
        title: 'Name',
      }),
    ])

    expect(
      screenHasBeenAnswered(
        screen,
        applicationWith({ 'answer-draft': 'x' }, 'draft'),
      ),
    ).toBe(true)
    expect(
      screenHasBeenAnswered(
        screen,
        applicationWith({ 'answer-draft': 'x' }, 'other'),
      ),
    ).toBe(false)
  })

  it('treats a screen whose id resolves to nothing as not answered', () => {
    const [screen] = screensFor([
      buildTextField({ id: () => '', title: 'Name' }),
    ])

    expect(screenHasBeenAnswered(screen, applicationWith({ '': 'x' }))).toBe(
      false,
    )
  })

  it('resolves the ids of the fields inside a multifield for the same user', () => {
    const [screen] = convertFormToScreens(
      buildForm({
        id: 'form',
        title: 'Form',
        children: [
          buildMultiField({
            id: 'page',
            title: 'Page',
            children: [
              buildTextField({ id: perUserId, title: 'First' }),
              buildTextField({ id: 'second', title: 'Second' }),
            ],
          }),
        ],
      }),
      {},
      {},
      null,
    )
    const application = applicationWith({ 'answer-1': 'x' })

    expect(
      screenHasBeenAnswered(screen, application, true, userWith('1')),
    ).toBe(true)
    expect(
      screenHasBeenAnswered(screen, application, false, userWith('1')),
    ).toBe(false)
    expect(
      screenHasBeenAnswered(screen, application, true, userWith('2')),
    ).toBe(false)
  })

  it('works without a user', () => {
    const [screen] = screensFor([buildTextField({ id: 'name', title: 'Name' })])

    expect(
      screenHasBeenAnswered(screen, applicationWith({ name: 'a' }), false),
    ).toBe(true)
    expect(
      screenHasBeenAnswered(
        screen,
        applicationWith({ name: 'a' }),
        false,
        null,
      ),
    ).toBe(true)
  })
})

describe('findCurrentScreen', () => {
  const screens = screensFor([
    buildTextField({ id: perUserId, title: 'Per user' }),
    buildTextField({ id: 'plain', title: 'Plain' }),
  ])
  const application = applicationWith({ 'answer-1': 'x' })

  it('moves past a screen with a per-user id once that user has answered it', () => {
    expect(findCurrentScreen(screens, application, userWith('1'))).toBe(1)
  })

  it('stops at a per-user screen that only another user has answered', () => {
    expect(findCurrentScreen(screens, application, userWith('2'))).toBe(0)
  })

  it('finds the screen to resume on with static ids and no user', () => {
    const staticScreens = screensFor([
      buildTextField({ id: 'a', title: 'A' }),
      buildTextField({ id: 'b', title: 'B' }),
      buildTextField({ id: 'c', title: 'C' }),
    ])

    expect(findCurrentScreen(staticScreens, applicationWith({}))).toBe(0)
    expect(findCurrentScreen(staticScreens, applicationWith({ a: '1' }))).toBe(
      1,
    )
    expect(
      findCurrentScreen(
        staticScreens,
        applicationWith({ a: '1', b: '2' }),
        null,
      ),
    ).toBe(2)
  })
})
