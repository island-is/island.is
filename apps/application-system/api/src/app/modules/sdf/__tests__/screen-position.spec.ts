import { FormBuilder } from '@island.is/application/core'
import { convertFormToScreens } from '@island.is/application/screen-compiler'
import type { Application, FormValue } from '@island.is/application/types'

import {
  resolveClaimedScreen,
  resumeIndex,
  toApplicationSnapshot,
  toWorkingApplication,
} from '../screen-position'

const application = { answers: {}, externalData: {} } as unknown as Application

// Three pages in one section; the middle one is only shown when
// `wantsExtra` is 'yes'.
const buildScreens = (answers: FormValue = {}) => {
  const form = new FormBuilder('form', 'Form')
    .addSection('section', 'Section', (section) => {
      section
        .addPage('first', 'First', (page) => {
          page.addTextField('firstField', 'First field')
        })
        .addPage(
          'extra',
          'Extra',
          (page) => {
            page.addTextField('extraField', 'Extra field')
          },
          { showWhen: (answers) => answers.wantsExtra === 'yes' },
        )
        .addPage('last', 'Last', (page) => {
          page.addTextField('lastField', 'Last field')
        })
    })
    .build()

  return convertFormToScreens(form, answers, {}, null)
}

describe('resolveClaimedScreen', () => {
  it('finds a shown screen by its id', () => {
    expect(resolveClaimedScreen(buildScreens(), 'last', application)).toEqual({
      valid: true,
      index: 2,
    })
  })

  it('rejects an id that no screen has', () => {
    expect(
      resolveClaimedScreen(buildScreens(), 'nowhere', application),
    ).toEqual({ valid: false })
  })

  it('rejects a screen hidden by its conditions', () => {
    expect(resolveClaimedScreen(buildScreens(), 'extra', application)).toEqual({
      valid: false,
    })
  })

  it('accepts the same screen once the answers show it', () => {
    expect(
      resolveClaimedScreen(
        buildScreens({ wantsExtra: 'yes' }),
        'extra',
        application,
      ),
    ).toEqual({ valid: true, index: 1 })
  })

  it('never matches an empty id', () => {
    expect(resolveClaimedScreen(buildScreens(), '', application)).toEqual({
      valid: false,
    })
  })

  it('counts the first screen when several share an id', () => {
    const screens = [...buildScreens(), ...buildScreens()]

    expect(resolveClaimedScreen(screens, 'last', application)).toEqual({
      valid: true,
      index: 2,
    })
  })
})

describe('resumeIndex', () => {
  it('starts at the first screen when nothing is answered', () => {
    expect(resumeIndex(buildScreens(), {})).toBe(0)
  })

  it('stops at the first screen that is not fully answered', () => {
    const answers = { wantsExtra: 'yes', firstField: 'a' }

    expect(resumeIndex(buildScreens(answers), answers)).toBe(1)
  })

  it('moves past a hidden screen to the next shown one', () => {
    const answers = { firstField: 'a' }

    expect(resumeIndex(buildScreens(answers), answers)).toBe(2)
  })

  it('lands on the last screen when every shown screen is answered', () => {
    const answers = { firstField: 'a', lastField: 'b' }

    expect(resumeIndex(buildScreens(answers), answers)).toBe(2)
  })
})

describe('toWorkingApplication', () => {
  const stored = {
    id: 'application-id',
    state: 'draft',
    answers: { firstField: 'stored' },
    externalData: { provider: { status: 'success', date: new Date(0) } },
  } as unknown as Application

  it('replaces the answers and keeps the rest as saved', () => {
    const working = toWorkingApplication(stored, { firstField: 'merged' })

    expect(working.answers).toEqual({ firstField: 'merged' })
    expect(working.id).toBe('application-id')
    expect(working.state).toBe('draft')
    expect(working.externalData).toBe(stored.externalData)
  })

  it('leaves the application it was given untouched', () => {
    toWorkingApplication(stored, { firstField: 'merged' })

    expect(stored.answers).toEqual({ firstField: 'stored' })
  })

  it('reads a model instance through its toJSON', () => {
    const model = {
      answers: { ignored: true },
      toJSON: () => ({ id: 'from-json', answers: { firstField: 'stored' } }),
    }

    const working = toWorkingApplication(model, { firstField: 'merged' })

    expect(working.id).toBe('from-json')
    expect(working.answers).toEqual({ firstField: 'merged' })
    expect(working).not.toHaveProperty('toJSON')
  })
})

describe('toApplicationSnapshot', () => {
  it('returns what toJSON returns for a model instance', () => {
    const plain = { id: 'from-json' }

    expect(toApplicationSnapshot({ toJSON: () => plain })).toBe(plain)
  })

  it('copies a plain object instead of returning it', () => {
    const plain = { id: 'plain' }
    const snapshot = toApplicationSnapshot(plain)

    expect(snapshot).toEqual(plain)
    expect(snapshot).not.toBe(plain)
  })
})
