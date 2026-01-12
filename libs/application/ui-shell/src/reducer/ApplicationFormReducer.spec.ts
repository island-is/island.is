import {
  buildForm,
  buildRepeater,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  ExternalData,
  Form,
  ApplicationTypes,
  FormValue,
  FormModes,
  FormItemTypes,
  ApplicationStatus,
} from '@island.is/application/types'
import { z } from 'zod'
import { ApplicationReducer, initializeReducer } from './ApplicationFormReducer'
import { ActionTypes, ApplicationUIState } from './ReducerTypes'

const dataSchema = z.object({
  person: z
    .array(
      z.object({
        age: z.string().refine((x) => {
          const asNumber = parseInt(x)
          if (isNaN(asNumber)) {
            return false
          }
          return asNumber > 15
        }),
        name: z.string().min(1).max(256), // unique in the repeater hmm?
        pets: z
          .array(
            z.object({
              name: z.string(),
              animal: z.enum(['cat', 'dog', 'parrot', 'snake']),
            }),
          )
          .optional(),
      }),
    )
    .max(5)
    .nonempty(),
  familyName: z.string().min(1),
  house: z.string().optional(),
})
type SchemaFormValues = z.infer<typeof dataSchema>
const form: Form = buildForm({
  id: 'ExampleForm',
  title: 'Family and pets',
  children: [
    buildSection({
      id: 'family',
      title: 'Family',
      children: [
        buildRepeater({
          id: 'person',
          title: 'Family Member',
          component: 'SomeComponent',
          children: [
            buildTextField({
              id: 'name',
              title: 'Name',
            }),
            buildTextField({
              id: 'age',
              title: 'Age',
            }),
          ],
        }),
        buildTextField({
          id: 'familyName',
          title: 'What is the family name?',
          condition: (formValue: FormValue) => {
            return (formValue as SchemaFormValues).person?.length
              ? (formValue as SchemaFormValues).person[0].name !== 'bad name'
              : true
          },
        }),
      ],
    }),
    buildSection({
      id: 'houses',
      title: 'Houses',
      children: [
        buildTextField({ id: 'house', title: 'House' }),
        buildTextField({
          id: 'garden',
          title: 'Do you have a garden?',
        }),
      ],
    }),
  ],
})

const application: Application = {
  id: '12315151515',
  assignees: [],
  typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
  attachments: {},
  externalData: {},
  answers: {},
  applicant: '123123',
  state: 'draft',
  modified: new Date(),
  created: new Date(),
  status: ApplicationStatus.IN_PROGRESS,
}

describe('ApplicationFormReducer', () => {
  const initialState: ApplicationUIState = {
    application,
    activeScreen: 0,
    dataSchema,
    form,
    nationalRegistryId: '1111112199',
    screens: [],
    sections: [],
    historyReason: 'initial',
  }
  let initializedState: ApplicationUIState
  beforeAll(() => {
    initializedState = initializeReducer(initialState)
  })
  describe('initialize reducer', () => {
    it('should convert the form into valid leaves, screens, and sections', () => {
      expect(initializedState.form).toBe(form)
      expect(initializedState.screens.length).toBe(4)
      expect(initializedState.screens[0].isNavigable).toBe(true)
      expect(initializedState.screens[1].isNavigable).toBe(true)
      expect(initializedState.sections.length).toBe(2)
      expect(initializedState.activeScreen).toBe(0)
      expect(initializedState.application).toEqual(application)
    })
    it('should apply conditions to show or hide some screens', () => {
      const answers = {
        person: [{ name: 'bad name' }],
      }
      const stateWhichViolatesOneCondition = {
        ...initialState,
        application: {
          ...application,
          answers,
        },
      }
      const newState = initializeReducer(stateWhichViolatesOneCondition)
      expect(newState.screens[0].isNavigable).toBe(true)
      expect(newState.screens[3].isNavigable).toBe(false)
      expect(newState.application.answers).toEqual(answers)
    })
    it('should go to the screen where the last answer belongs to the screen before', () => {
      const answers = {
        person: [{ age: '19', name: 'Ingolfur' }],
        familyName: 'Arnarson',
      }
      const state = {
        ...initialState,
        application: {
          ...application,
          answers,
        },
      }
      const initializedState = initializeReducer(state)
      expect(initializedState.activeScreen).toBe(4)
    })
    it('should go to the first screen although there are answers, if and only if the current form is in review mode', () => {
      const answers = {
        person: [{ age: '19', name: 'Ingolfur' }],
        familyName: 'Arnarson',
      }
      const state = {
        ...initialState,
        form: { ...form, mode: FormModes.IN_PROGRESS },
        application: {
          ...application,
          answers,
        },
      }
      const initializedState = initializeReducer(state)
      expect(initializedState.activeScreen).toBe(0)
    })
  })
  describe('next screen', () => {
    const action = { type: ActionTypes.ANSWER_AND_GO_NEXT_SCREEN, payload: {} }
    it('should go to the next screen', () => {
      const updatedState = ApplicationReducer(initializedState, action)
      expect(updatedState.activeScreen).toBe(1)
    })
    it('should not be able to go to the next screen, if the current screen is the last one', () => {
      const updatedState = ApplicationReducer(
        ApplicationReducer(
          ApplicationReducer(
            ApplicationReducer(initializedState, action),
            action,
          ),
          action,
        ),
        action,
      )
      expect(updatedState.activeScreen).toBe(3)
    })
    it('should jump over all screens that already belong to the repeater, if the current screen is a repeater', () => {
      const updatedState = {
        ...initializeReducer({
          ...initialState,
          application: {
            ...initialState.application,
            answers: {
              person: [
                { name: 'a', age: 22 },
                { name: 'b', age: 33 },
              ],
            },
          },
        }),
        activeScreen: 0,
      }
      expect(updatedState.activeScreen).toBe(0)

      const finalState = ApplicationReducer(updatedState, action)
      expect(finalState.activeScreen).toBe(5)
    })
    it('should return back to the repeater screen when reaching the end of the screens belonging to the repeater', () => {
      const updatedState = {
        ...initializeReducer({
          ...initialState,
          application: {
            ...initialState.application,
            answers: {
              person: [
                { name: 'a', age: 22 },
                { name: 'b', age: 33 },
              ],
            },
          },
        }),
        activeScreen: 4,
      }
      expect(updatedState.activeScreen).toBe(4)

      const finalState = ApplicationReducer(updatedState, action)
      expect(finalState.activeScreen).toBe(0)
    })
  })
  describe('previous screen', () => {
    const action = { type: ActionTypes.PREV_SCREEN }
    it('should go to the previous screen', () => {
      const updatedState = ApplicationReducer(
        { ...initializedState, activeScreen: 1 },
        action,
      )
      expect(updatedState.activeScreen).toBe(0)
    })
    it('should not be able go to the previous screen, if the current screen is the first one', () => {
      const updatedState = ApplicationReducer(initializedState, action)
      expect(updatedState.activeScreen).toBe(0)
    })
    it('should go to the repeater screen when going back in the midst of a repeater flow', () => {
      const state = initializeReducer({
        ...initialState,
        application: {
          ...initialState.application,
          answers: {
            person: [{ name: 'a', age: 22 }, { name: 'b' }],
          },
        },
        activeScreen: 5,
      })
      expect(state.screens[state.activeScreen].id).toBe('person[1].age')

      const updatedState = ApplicationReducer(state, action)
      expect(updatedState.activeScreen).toBe(0)
      expect(updatedState.screens[updatedState.activeScreen].id).toBe('person')
      expect(updatedState.screens[updatedState.activeScreen].type).toBe(
        FormItemTypes.REPEATER,
      )
    })
  })
  describe('go to screen', () => {
    it('should go to a screen with a specific id', () => {
      const updatedState = ApplicationReducer(initializedState, {
        type: ActionTypes.GO_TO_SCREEN,
        payload: 'house',
      })
      expect(updatedState.activeScreen).toBe(2)
      const nextState = ApplicationReducer(updatedState, {
        type: ActionTypes.GO_TO_SCREEN,
        payload: 'person',
      })
      expect(nextState.activeScreen).toBe(0)
      const anotherState = ApplicationReducer(nextState, {
        type: ActionTypes.GO_TO_SCREEN,
        payload: 'familyName',
      })
      expect(anotherState.activeScreen).toBe(1)
      const finalState = ApplicationReducer(anotherState, {
        type: ActionTypes.GO_TO_SCREEN,
        payload: 'garden',
      })
      expect(finalState.activeScreen).toBe(3)
    })
    it('should not go to any screen if no screen in the form has the desired id', () => {
      const updatedState = ApplicationReducer(initializedState, {
        type: ActionTypes.GO_TO_SCREEN,
        payload: 'someRandomID',
      })
      expect(updatedState.activeScreen).toBe(initializedState.activeScreen)
      const anotherState = ApplicationReducer(
        { ...initializedState, activeScreen: 2 },
        {
          type: ActionTypes.GO_TO_SCREEN,
          payload: 'someRandomID',
        },
      )
      expect(anotherState.activeScreen).toBe(2)
    })
  })
  describe('answer', () => {
    const type = ActionTypes.ANSWER
    it('should store new answers', () => {
      const updatedState = ApplicationReducer(initializedState, {
        type,
        payload: { familyName: 'Bezos' },
      })
      expect(updatedState.application.answers.familyName).toBe('Bezos')

      const evenNewerState = ApplicationReducer(updatedState, {
        type,
        payload: {
          familyName: 'Gates',
          house: 'A big mansion',
        },
      })
      expect(evenNewerState.application.answers.familyName).toBe('Gates')
      expect(evenNewerState.application.answers.house).toBe('A big mansion')
    })
    it('should upon answering apply conditions to show or hide some screens', () => {
      const updatedState = ApplicationReducer(initializedState, {
        type,
        payload: {
          person: [{ name: 'bad name' }],
        },
      })
      expect(updatedState.screens[0].isNavigable).toBeTruthy()
      expect(updatedState.screens[1].isNavigable).toBeTruthy()
      expect(updatedState.screens[2].isNavigable).toBeTruthy()
      expect(updatedState.screens[3].isNavigable).toBeFalsy()
    })
    it('should use the newest value of an array and not merge the previous value', () => {
      const initialState: ApplicationUIState = {
        dataSchema: z.object({ text: z.string() }),
        form: buildForm({
          id: 'ExampleForm',
          title: 'Test',
          children: [],
        }),
        application: {
          ...application,
          answers: { historyCars: ['VW', 'Tesla'] },
        },
        activeScreen: 0,
        nationalRegistryId: '1111112199',
        screens: [],
        sections: [],
        historyReason: 'initial',
      }

      const updateAction = {
        type: ActionTypes.ANSWER,
        payload: { historyCars: ['Audi'] },
      }
      const updatedState = ApplicationReducer(initialState, updateAction)
      expect(updatedState.application.answers).toEqual({
        historyCars: ['Audi'],
      })
    })
  })
  describe('expand repeater', () => {
    const action = { type: ActionTypes.EXPAND_REPEATER }
    it('should not do anything if the current screen is not a repeater', () => {
      const stateWhereActiveScreenIsNoRepeater = ApplicationReducer(
        initializedState,
        { type: ActionTypes.ANSWER_AND_GO_NEXT_SCREEN, payload: {} },
      )
      const updatedState = ApplicationReducer(
        stateWhereActiveScreenIsNoRepeater,
        action,
      )
      expect(updatedState).toEqual(stateWhereActiveScreenIsNoRepeater)
    })
    it('should add new screens directly after the repeater when expanding a given repeater for the first time', () => {
      const updatedState = ApplicationReducer(initializedState, action)
      expect(updatedState.screens.length).toBe(6)
      expect(updatedState.screens[1].isPartOfRepeater).toBe(true)
      expect(updatedState.screens[1].id).toBe('person[0].name')
      expect(updatedState.screens[2].isPartOfRepeater).toBe(true)
      expect(updatedState.screens[2].id).toBe('person[0].age')
      expect(updatedState.screens[3].id).toBe('familyName')
      expect(updatedState.screens[3].isPartOfRepeater).toBeFalsy()
    })
    it('should add new screens after the already added screens when expanding the repeater for the nth time', () => {
      const updatedState = ApplicationReducer(
        initializeReducer({
          ...initialState,
          application: {
            ...initialState.application,
            answers: {
              person: [
                { name: 'a', age: 22 },
                { name: 'b', age: 33 },
              ],
            },
          },
          activeScreen: 0,
        }),
        action,
      )

      expect(updatedState.screens.length).toBe(8)
      expect(updatedState.screens[1].isPartOfRepeater).toBe(true)
      expect(updatedState.screens[2].isPartOfRepeater).toBe(true)
      expect(updatedState.screens[3].isPartOfRepeater).toBe(true)
      expect(updatedState.screens[4].isPartOfRepeater).toBe(true)
      expect(updatedState.screens[5].isPartOfRepeater).toBeFalsy()
      expect(updatedState.screens[1].id).toBe('person[0].name')
      expect(updatedState.screens[2].id).toBe('person[0].age')
      expect(updatedState.screens[3].id).toBe('person[1].name')
      expect(updatedState.screens[4].id).toBe('person[1].age')
      expect(updatedState.screens[5].id).toBe('familyName')
    })
    it('should after adding the screens move to the first newly added screen', () => {
      let updatedState = ApplicationReducer(initializedState, action)
      expect(updatedState.activeScreen).toBe(1)
      updatedState = ApplicationReducer(
        {
          ...updatedState,
          application: {
            ...updatedState.application,
            answers: { person: [{ name: 'a', age: 22 }] },
          },
          activeScreen: 0,
        },
        action,
      )
      expect(updatedState.activeScreen).toBe(3)
    })
  })
  describe('add external data', () => {
    const action = (payload: unknown) => ({
      type: ActionTypes.ADD_EXTERNAL_DATA,
      payload,
    })
    it('should be able to set external data', () => {
      const newExternalData = { a: 1, b: 'asdf', c: true }
      const updatedState = ApplicationReducer(
        initialState,
        action(newExternalData),
      )
      expect(updatedState.application.externalData).toEqual(newExternalData)
    })
    it('should only partially overwrite external data when called repeatedly', () => {
      const externalData: ExternalData = {
        a: { status: 'success', data: 1, date: new Date() },
        b: { status: 'failure', reason: 'fail', date: new Date() },
      }
      const newExternalData: ExternalData = {
        b: { status: 'success', data: 'nice', date: new Date() },
        c: { status: 'failure', reason: 'fail', date: new Date() },
      }
      const updatedState = ApplicationReducer(
        {
          ...initialState,
          application: {
            ...application,
            externalData,
          },
        },
        action(newExternalData),
      )
      expect(updatedState.application.externalData).toEqual({
        a: expect.objectContaining({ status: 'success', data: 1 }),
        b: expect.objectContaining({ status: 'success', data: 'nice' }),
        c: expect.objectContaining({ status: 'failure', reason: 'fail' }),
      })
    })
  })
})
