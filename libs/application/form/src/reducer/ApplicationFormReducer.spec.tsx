import '@testing-library/jest-dom'
import * as z from 'zod'
import { ApplicationReducer } from './ApplicationFormReducer'
import { ActionTypes } from './ReducerTypes'
import { buildForm } from '@island.is/application/schema'

describe(' ApplicationFormReducer', () => {
  it('should use the newest value of an array and not merge the previous value', () => {
    const initialState = {
      form: buildForm({
        schema: z.object({ text: z.string() }),
        id: '123',
        name: 'Test',
        ownerId: '222',
        children: [],
      }),
      formLeaves: [],
      formValue: { historyCars: ['VW', 'Tesla'] },
      activeSection: 0,
      activeSubSection: 0,
      activeScreen: 0,
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
