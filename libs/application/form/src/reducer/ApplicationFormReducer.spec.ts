import {
  Application,
  buildForm,
  buildRepeater,
  buildSection,
  buildTextField,
  ExternalData,
  Form,
  ApplicationTypes,
  FormValue,
} from '@island.is/application/template'
import * as z from 'zod'
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
        name: z
          .string()
          .nonempty()
          .max(256), // unique in the repeater hmm?
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
  familyName: z.string().nonempty(),
  house: z.string().optional(),
})
type SchemaFormValues = z.infer<typeof dataSchema>
const form: Form = buildForm({
  id: ApplicationTypes.EXAMPLE,
  ownerId: 'Aranja',
  name: 'Family and pets',
  children: [
    buildSection({
      id: 'family',
      name: 'Family',
      children: [
        buildRepeater({
          id: 'person',
          name: 'Family Member',
          labelKey: 'name',
          children: [
            buildTextField({
              id: 'name',
              name: 'Name',
              required: true,
            }),
            buildTextField({
              id: 'age',
              name: 'Age',
              required: true,
            }),
          ],
        }),
        buildTextField({
          id: 'familyName',
          name: 'What is the family name?',
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
      name: 'Houses',
      children: [
        buildTextField({ id: 'house', name: 'House', required: false }),
        buildTextField({
          id: 'garden',
          name: 'Do you have a garden?',
          required: false,
        }),
      ],
    }),
  ],
})

const application: Application = {
  id: '12315151515',
  typeId: ApplicationTypes.EXAMPLE,
  attachments: {},
  externalData: {},
  answers: {},
  applicant: '123123',
  externalId: '123123123',
  state: 'draft',
  modified: new Date(),
  created: new Date(),
}

describe('ApplicationFormReducer', () => {
  const initialState: ApplicationUIState = {
    application,
    activeScreen: 0,
    activeSection: 0,
    activeSubSection: -1,
    dataSchema,
    form,
    nationalRegistryId: '1111112199',
    screens: [],
    progress: 0,
    formLeaves: [],
    sections: [],
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
      expect(initializedState.activeSection).toBe(0)
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
      const initializedState = initializeReducer(stateWhichViolatesOneCondition)
      expect(initializedState.screens[0].isNavigable).toBe(true)
      expect(initializedState.screens[1].isNavigable).toBe(false)
      expect(initializedState.application.answers).toEqual(answers)
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
      expect(initializedState.activeScreen).toBe(2)
      expect(initializedState.activeSection).toBe(1)
    })
    it('should go to the first screen although there are answers, if and only if the current form is in review mode', () => {
      const answers = {
        person: [{ age: '19', name: 'Ingolfur' }],
        familyName: 'Arnarson',
      }
      const state = {
        ...initialState,
        form: { ...form, mode: 'review' as const },
        application: {
          ...application,
          answers,
        },
      }
      const initializedState = initializeReducer(state)
      expect(initializedState.activeScreen).toBe(0)
      expect(initializedState.activeSection).toBe(0)
    })
  })
  describe('next screen', () => {
    const action = { type: ActionTypes.ANSWER_AND_GO_NEXT_SCREEN, payload: {} }
    it('should go to the next screen', () => {
      const updatedState = ApplicationReducer(initializedState, action)
      expect(updatedState.activeScreen).toBe(1)
      expect(updatedState.activeSection).toBe(0)
    })
    it('should update the active section when moving to a screen in the next section', () => {
      const updatedState = ApplicationReducer(
        ApplicationReducer(initializedState, action),
        action,
      )
      expect(updatedState.activeScreen).toBe(2)
      expect(updatedState.activeSection).toBe(1)
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
      const expandAction = { type: ActionTypes.EXPAND_REPEATER }
      const updatedState = {
        ...ApplicationReducer(
          {
            ...ApplicationReducer(initializedState, expandAction),
            activeScreen: 0,
          },
          expandAction,
        ),
        activeScreen: 0,
      }
      expect(updatedState.activeScreen).toBe(0)

      const finalState = ApplicationReducer(updatedState, action)
      expect(finalState.activeScreen).toBe(5)
    })
    it('should return back to the repeater screen when reaching the end of the screens belonging to the repeater', () => {
      const expandAction = { type: ActionTypes.EXPAND_REPEATER }
      const updatedState = {
        ...ApplicationReducer(
          {
            ...ApplicationReducer(initializedState, expandAction),
            activeScreen: 0,
          },
          expandAction,
        ),
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
    it('should update the active section when moving to a screen in the previous section', () => {
      const updatedState = ApplicationReducer(
        { ...initializedState, activeScreen: 2, activeSection: 1 },
        action,
      )
      expect(updatedState.activeScreen).toBe(1)
      expect(updatedState.activeSection).toBe(0)
    })
    it('should not be able go to the previous screen, if the current screen is the first one', () => {
      const updatedState = ApplicationReducer(initializedState, action)
      expect(updatedState.activeScreen).toBe(0)
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
      expect(updatedState.screens[1].isNavigable).toBeFalsy()
      expect(updatedState.screens[2].isNavigable).toBeTruthy()
    })
    it('should use the newest value of an array and not merge the previous value', () => {
      const initialState = {
        dataSchema: z.object({ text: z.string() }),
        form: buildForm({
          id: ApplicationTypes.EXAMPLE,
          name: 'Test',
          ownerId: '222',
          children: [],
        }),
        application: {
          ...application,
          answers: { historyCars: ['VW', 'Tesla'] },
        },
        formLeaves: [],
        activeSection: 0,
        activeSubSection: 0,
        activeScreen: 0,
        nationalRegistryId: '1111112199',
        progress: 0,
        screens: [],
        sections: [],
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
      expect(updatedState.screens[1].repeaterIndex).toBe(0)
      expect(updatedState.screens[1].id).toBe('person[0].name')
      expect(updatedState.screens[2].repeaterIndex).toBe(0)
      expect(updatedState.screens[2].id).toBe('person[0].age')
      expect(updatedState.screens[3].id).toBe('familyName')
    })
    it('should add new screens after the already added screens when expanding the repeater for the nth time', () => {
      const updatedState = ApplicationReducer(
        { ...ApplicationReducer(initializedState, action), activeScreen: 0 },
        action,
      )

      expect(updatedState.screens.length).toBe(8)
      expect(updatedState.screens[1].repeaterIndex).toBe(0)
      expect(updatedState.screens[2].repeaterIndex).toBe(0)
      expect(updatedState.screens[3].repeaterIndex).toBe(0)
      expect(updatedState.screens[4].repeaterIndex).toBe(0)
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
        { ...updatedState, activeScreen: 0 },
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
