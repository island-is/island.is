import {
  buildForm,
  buildRepeater,
  buildSection,
  buildTextField,
  ExternalData,
  Form,
  FormType,
} from '@island.is/application/schema'
import * as z from 'zod'
import { ApplicationReducer, initializeReducer } from './ApplicationFormReducer'
import { ActionTypes, ApplicationUIState } from './ReducerTypes'

const FamilyAndPetsSchema = z.object({
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
type FamilyAndPetsSchemaFormValues = z.infer<typeof FamilyAndPetsSchema>
const FamilyAndPets: Form = buildForm({
  id: FormType.FAMILY_AND_PETS,
  ownerId: 'Aranja',
  name: 'Family and pets',
  schema: FamilyAndPetsSchema,
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
          condition: (formValue: FamilyAndPetsSchemaFormValues) => {
            return formValue.person?.length
              ? formValue.person[0].name !== 'bad name'
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

describe('ApplicationFormReducer', () => {
  const initialState: ApplicationUIState = {
    externalData: {},
    form: FamilyAndPets,
    screens: [],
    activeScreen: 0,
    progress: 0,
    formValue: {},
    formLeaves: [],
    activeSubSection: -1,
    activeSection: 0,
    sections: [],
  }
  let initializedState
  beforeAll(() => {
    initializedState = initializeReducer(initialState)
  })
  describe('initialize reducer', () => {
    it('should convert the form into valid leaves, screens, and sections', () => {
      expect(initializedState.form).toBe(FamilyAndPets)
      expect(initializedState.screens.length).toBe(4)
      expect(initializedState.screens[0].isNavigable).toBe(true)
      expect(initializedState.screens[1].isNavigable).toBe(true)
      expect(initializedState.sections.length).toBe(2)
      expect(initializedState.activeScreen).toBe(0)
      expect(initializedState.activeSection).toBe(0)
      expect(initializedState.formValue).toEqual({})
    })
    it('should apply conditions to show or hide some screens', () => {
      const formValue = {
        person: [{ name: 'bad name' }],
      }
      const stateWhichViolatesOneCondition = {
        ...initialState,
        formValue,
      }
      const initializedState = initializeReducer(stateWhichViolatesOneCondition)
      expect(initializedState.screens[0].isNavigable).toBe(true)
      expect(initializedState.screens[1].isNavigable).toBe(false)
      expect(initializedState.formValue).toEqual(formValue)
    })
    it('should go to the screen where the last answer belongs to the screen before', () => {
      const formValue = {
        person: [{ age: '19', name: 'Ingolfur' }],
        familyName: 'Arnarson',
      }
      const state = {
        ...initialState,
        formValue,
      }
      const initializedState = initializeReducer(state)
      expect(initializedState.activeScreen).toBe(2)
      expect(initializedState.activeSection).toBe(1)
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
      expect(updatedState.formValue.familyName).toBe('Bezos')

      const evenNewerState = ApplicationReducer(updatedState, {
        type,
        payload: {
          familyName: 'Gates',
          house: 'A big mansion',
        },
      })
      expect(evenNewerState.formValue.familyName).toBe('Gates')
      expect(evenNewerState.formValue.house).toBe('A big mansion')
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
        form: buildForm({
          schema: z.object({ text: z.string() }),
          id: FormType.FAMILY_AND_PETS,
          name: 'Test',
          ownerId: '222',
          children: [],
        }),
        externalData: {},
        formLeaves: [],
        formValue: { historyCars: ['VW', 'Tesla'] },
        activeSection: 0,
        activeSubSection: 0,
        activeScreen: 0,
        progress: 0,
        screens: [],
        sections: [],
      }

      const updateAction = {
        type: ActionTypes.ANSWER,
        payload: { historyCars: ['Audi'] },
      }
      const updatedState = ApplicationReducer(initialState, updateAction)
      expect(updatedState.formValue).toEqual({ historyCars: ['Audi'] })
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
    const action = (payload) => ({
      type: ActionTypes.ADD_EXTERNAL_DATA,
      payload,
    })
    it('should be able to set external data', () => {
      const newExternalData = { a: 1, b: 'asdf', c: true }
      const updatedState = ApplicationReducer(
        initialState,
        action(newExternalData),
      )
      expect(updatedState.externalData).toEqual(newExternalData)
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
          externalData,
        },
        action(newExternalData),
      )
      expect(updatedState.externalData).toEqual({
        a: expect.objectContaining({ status: 'success', data: 1 }),
        b: expect.objectContaining({ status: 'success', data: 'nice' }),
        c: expect.objectContaining({ status: 'failure', reason: 'fail' }),
      })
    })
  })
})
