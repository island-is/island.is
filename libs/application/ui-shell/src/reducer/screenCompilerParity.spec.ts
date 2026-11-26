import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRepeater,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import * as screenCompiler from '@island.is/application/screen-compiler'
import { Application, FormNode, FormValue } from '@island.is/application/types'
import type { BffUser } from '@island.is/shared/types'

import * as reducerUtils from './reducerUtils'

// The server-driven forms compile screens with `screen-compiler`, which started
// as a copy of the functions in `reducerUtils`. The two must agree, so the same
// forms, answers and users go through both and the results are compared.

const userWith = (nationalId: string) =>
  ({ scopes: [], profile: { nationalId } } as unknown as BffUser)

// An id that depends on the user, so each user keeps a separate answer.
const perUserId = (_application: Application, user?: BffUser) =>
  `answer-${user?.profile.nationalId}`

const customWithChildren = {
  ...buildCustomField({
    id: 'custom',
    title: 'Custom',
    component: 'CustomComponent',
  }),
  childInputIds: ['c1', 'c2'],
} as unknown as FormNode

const form = buildForm({
  id: 'parity',
  title: 'Parity',
  children: [
    buildDescriptionField({
      id: 'intro',
      title: 'Introduction',
      description: 'welcome',
    }),
    buildSection({
      id: 'sectionOne',
      title: 'One',
      children: [
        buildTextField({ id: 'name', title: 'Name' }),
        buildTextField({ id: perUserId, title: 'Per user' }),
        buildMultiField({
          id: 'contact',
          title: 'Contact',
          children: [
            buildTextField({ id: 'email', title: 'Email' }),
            buildTextField({ id: 'phone', title: 'Phone' }),
          ],
        }),
        buildTextField({
          id: 'hidden',
          title: 'Hidden unless asked for',
          condition: (answers) => answers?.showHidden === 'yes',
        }),
      ],
    }),
    buildSection({
      id: 'sectionTwo',
      title: 'Two',
      condition: (answers) => answers?.showTwo === 'yes',
      children: [buildTextField({ id: 'extra', title: 'Extra' })],
    }),
    buildRepeater({
      id: 'people',
      title: 'People',
      component: 'SomeComponent',
      children: [
        buildTextField({ id: 'a', title: 'A' }),
        buildTextField({ id: 'b', title: 'B' }),
      ],
    }),
    customWithChildren,
    // Hidden unless asked for, so moving forward can run off the end.
    buildTextField({
      id: 'tail',
      title: 'Tail',
      condition: (answers) => answers?.showTail === 'yes',
    }),
  ],
})

const everything: FormValue = {
  name: 'n',
  'answer-1': 'x',
  'answer-2': 'y',
  email: 'e',
  phone: 'p',
  showHidden: 'yes',
  hidden: 'h',
  showTwo: 'yes',
  extra: 'x',
  people: [{ a: '1', b: '2' }],
  c1: '1',
  c2: '2',
  showTail: 'yes',
  tail: 't',
}

const answerSets: Array<[string, FormValue]> = [
  ['no answers', {}],
  ['the first field', { name: 'n' }],
  ['a per-user answer for the first user', { name: 'n', 'answer-1': 'x' }],
  ['half of the multifield', { name: 'n', 'answer-1': 'x', email: 'e' }],
  [
    'the visible fields and the hidden ones switched on',
    { ...everything, extra: undefined, people: undefined, c1: undefined },
  ],
  ['a partly answered repeater', { ...everything, people: [{ a: '1' }] }],
  ['everything', everything],
]

const users: Array<[string, BffUser | null | undefined]> = [
  ['no user', undefined],
  ['a null user', null],
  ['the first user', userWith('1')],
  ['the second user', userWith('2')],
]

describe.each(answerSets)('with %s', (_answersLabel, answers) => {
  describe.each(users)('and %s', (_userLabel, user) => {
    const application = {
      answers,
      externalData: {},
      state: 'draft',
    } as unknown as Application

    // Each implementation is given its own screens, as its types require.
    const reducerScreens = reducerUtils.convertFormToScreens(
      form,
      answers,
      {},
      user ?? null,
    )
    const compilerScreens = screenCompiler.convertFormToScreens(
      form,
      answers,
      {},
      user ?? null,
    )

    it('compiles the same screens', () => {
      expect(compilerScreens).toEqual(reducerScreens)
    })

    it('finds the same navigable sections', () => {
      expect(
        screenCompiler.getNavigableSectionsInForm(
          form,
          answers,
          {},
          user ?? null,
        ),
      ).toEqual(
        reducerUtils.getNavigableSectionsInForm(
          form,
          answers,
          {},
          user ?? null,
        ),
      )
    })

    it('finds the same screen to resume on', () => {
      expect(
        screenCompiler.findCurrentScreen(compilerScreens, application, user),
      ).toBe(reducerUtils.findCurrentScreen(reducerScreens, application, user))
    })

    it('agrees, screen by screen, on what needs and has an answer', () => {
      expect(compilerScreens.length).toBe(reducerScreens.length)
      reducerScreens.forEach((reducerScreen, index) => {
        const compilerScreen = compilerScreens[index]

        expect(screenCompiler.screenRequiresAnswer(compilerScreen)).toBe(
          reducerUtils.screenRequiresAnswer(reducerScreen),
        )
        for (const partly of [false, true]) {
          expect(
            screenCompiler.screenHasBeenAnswered(
              compilerScreen,
              application,
              partly,
              user,
            ),
          ).toBe(
            reducerUtils.screenHasBeenAnswered(
              reducerScreen,
              application,
              partly,
              user,
            ),
          )
        }
      })
    })

    it('agrees on moving and going back, including outside the list', () => {
      const indexes = [
        -1,
        ...reducerScreens.map((_screen, index) => index),
        reducerScreens.length,
        reducerScreens.length + 1,
      ]
      indexes.forEach((index) => {
        for (const forward of [false, true]) {
          expect(
            screenCompiler.moveToScreen(compilerScreens, index, forward),
          ).toBe(reducerUtils.moveToScreen(reducerScreens, index, forward))
        }
      })
      // Both read the screen before the index, so an index further out than
      // the end of the list is not a valid input.
      indexes
        .filter((index) => index <= reducerScreens.length)
        .forEach((index) => {
          expect(screenCompiler.canGoBack(compilerScreens, index)).toBe(
            reducerUtils.canGoBack(reducerScreens, index),
          )
        })
    })
  })
})
