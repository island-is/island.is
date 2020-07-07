import React, { FC, useReducer } from 'react'
import { Answers, Form } from '@island.is/application/schema'
import FormProgress from '../components/form-progress'
import ApplicationName from '../components/application-name'
import Screen from '../components/screen'
import {
  ActionTypes,
  ApplicationReducer,
  initializeReducer,
} from './application-form-reducer'
import { Box, Column, Columns } from '@island.is/island-ui/core'

type ApplicationProps = {
  form: Form
  initialAnswers: Answers
}

export const ApplicationForm: FC<ApplicationProps> = ({
  form,
  initialAnswers,
}) => {
  const [state, dispatch] = useReducer(
    ApplicationReducer,
    {
      answers: initialAnswers,
      form,
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
    answers,
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
              answers={answers}
              answerQuestions={(payload) =>
                dispatch({ type: ActionTypes.ANSWER, payload })
              }
              shouldSubmit={activeScreen === screens.length - 1}
              screen={screens[activeScreen]}
              section={sections[activeSection]}
              nextScreen={() => dispatch({ type: ActionTypes.NEXT_SCREEN })}
              prevScreen={() => dispatch({ type: ActionTypes.PREV_SCREEN })}
            />
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}

export default ApplicationForm
