import { ActionTypes, ApplicationUIState } from '../reducer/ReducerTypes'
import { buildForm, buildTextField } from '@island.is/application/core'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { z } from 'zod'
import { initializeReducer } from '../reducer/ApplicationFormReducer'
import { useHistorySync } from './useHistorySync'
import { Router } from 'react-router-dom-v5-compat'
import { createMemoryHistory } from 'history'
import { act, renderHook } from '@testing-library/react-hooks'

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
        typeId: ApplicationTypes.EXAMPLE,
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

  it('pushes transitions to history and supports history navigation', async () => {
    // Arrange
    const history = createMemoryHistory({ initialEntries: ['/'] })

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

    // Assert history sync
    expect(history.entries).toHaveLength(1)
    expect(history.entries[0].state).toMatchObject({ screen: 0 })

    // Act render next step
    applicationState.activeScreen = 1
    applicationState.historyReason = 'navigate'
    rerender()

    // Assert history push
    expect(history.entries).toHaveLength(2)
    expect(history.entries[1].state).toMatchObject({ screen: 1 })

    // Act "click back"
    act(() => {
      history.goBack()
    })

    rerender()

    // Assert dispatch.
    expect(dispatch).toHaveBeenLastCalledWith({
      type: ActionTypes.HISTORY_POP,
      payload: {
        state: 'draft',
        screen: 0,
        historyReason: 'initial',
      },
    })

    // Act "click forward"
    act(() => {
      history.goForward()
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
