import React, { FC, useReducer } from 'react'
import { FormValue, Form } from '@island.is/application/schema'
import FormProgress from '../components/FormProgress'
import ApplicationName from '../components/ApplicationName'
import Screen from '../components/Screen'
import {
  ApplicationReducer,
  initializeReducer,
} from '../reducer/ApplicationFormReducer'
import { ActionTypes } from '../reducer/ReducerTypes'
import { Box, Column, Columns } from '@island.is/island-ui/core'

type ApplicationProps = {
  form: Form
  initialAnswers: FormValue
}

export const ApplicationForm: FC<ApplicationProps> = ({
  form,
  initialAnswers,
}) => {
  const [state, dispatch] = useReducer(
    ApplicationReducer,
    {
      form,
      formLeaves: [],
      formValue: initialAnswers,
      activeSection: 0,
      activeSubSection: 0,
      activeScreen: 0,
      screens: [],
      sections: [],
    },
    initializeReducer,
  )
  const {
    activeSection,
    activeSubSection,
    activeScreen,
    formValue,
    sections,
    screens,
  } = state
  return (
    <Box width="full" height="full">
      <Columns>
        <Column width="1/4">
          <Box background="blue100" height="full" border="standard">
            <ApplicationName name={form.name} />
            <FormProgress
              sections={sections}
              activeSection={activeSection}
              activeSubSection={activeSubSection}
            />
          </Box>
        </Column>
        <Column width="3/4">
          <Box
            border="standard"
            paddingLeft={8}
            paddingRight={8}
            paddingTop={4}
          >
            <Screen
              answerQuestions={(payload) =>
                dispatch({ type: ActionTypes.ANSWER, payload })
              }
              dataSchema={form.schema}
              formValue={formValue}
              nextScreen={() => dispatch({ type: ActionTypes.NEXT_SCREEN })}
              prevScreen={() => dispatch({ type: ActionTypes.PREV_SCREEN })}
              shouldSubmit={activeScreen === screens.length - 1}
              screen={screens[activeScreen]}
              section={sections[activeSection]}
            />
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}

export default ApplicationForm
