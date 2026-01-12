import { ActionTypes, ApplicationUIState } from '../reducer/ReducerTypes'
import { buildForm, buildTextField } from '@island.is/application/core'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { z } from 'zod'
import { initializeReducer } from '../reducer/ApplicationFormReducer'
import { useHistorySync } from './useHistorySync'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { act, renderHook } from '@testing-library/react'

describe('useHistorySync', () => {
  let applicationState: ApplicationUIState
  const dispatch = jest.fn()

  beforeEach(() => {
    dispatch.mockClear()
    applicationState = initializeReducer({
      screens: [],
      application: {
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
      },
      form: buildForm({
        id: 'form',
        title: 'Test',
        children: [
          buildTextField({
            id: 'firstField',
            title: 'First field',
          }),
          buildTextField({
            id: 'secondField',
            title: 'Second field',
          }),
        ],
      }),
      historyReason: 'initial',
      activeScreen: 0,
      dataSchema: z.object({}),
      nationalRegistryId: '1111112199',
      sections: [],
    })
  })

  it('pushes transitions to history and supports history navigation', () => {
    // Arrange
    const history = createMemoryHistory()

    // Act render application
    const { rerender } = renderHook(
      () => useHistorySync(applicationState, dispatch),
      {
        wrapper: ({ children }) => (
          <Router navigator={history} location={history.location}>
            {children}
          </Router>
        ),
      },
    )

    expect(history.location.state).toStrictEqual({
      state: 'draft',
      screen: 0,
      historyReason: 'initial',
    })

    rerender()

    // Assert dispatch.
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenLastCalledWith({
      type: ActionTypes.HISTORY_POP,
      payload: {
        state: 'draft',
        screen: 0,
        historyReason: 'initial',
      },
    })

    // Act render next step
    applicationState.activeScreen = 1
    applicationState.historyReason = 'navigate'
    rerender()

    //Act "click back"
    act(() => {
      history.back()
    })

    rerender()

    expect(dispatch).toHaveBeenLastCalledWith({
      type: ActionTypes.HISTORY_POP,
      payload: {
        state: 'draft',
        screen: 0,
        historyReason: 'initial',
      },
    })

    //Act "click back"
    act(() => {
      history.forward()
    })

    rerender()

    // Assert dispatch.
    expect(dispatch).toHaveBeenLastCalledWith({
      type: ActionTypes.HISTORY_POP,
      payload: {
        state: 'draft',
        screen: 1,
        historyReason: 'navigate',
      },
    })
  })
})
