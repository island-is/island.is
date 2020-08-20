import React, { FC, useReducer } from 'react'

import {
  FormValue,
  Form,
  FormType,
  getFormByTypeId,
} from '@island.is/application/schema'
import FormProgress from '../components/FormProgress/'
import ApplicationName from '../components/ApplicationName/'
import Sidebar from '../components/Sidebar'
import Screen from '../components/Screen'
import {
  ApplicationReducer,
  initializeReducer,
} from '../reducer/ApplicationFormReducer'
import { ActionTypes } from '../reducer/ReducerTypes'
import { Box } from '@island.is/island-ui/core'
import * as styles from './ApplicationForm.treat'
import ProgressIndicator from '../components/ProgressIndicator'

type ApplicationProps = {
  formType: FormType
  applicationId?: string
  initialAnswers?: FormValue
  onApplicationCreated?(id: string): void
}

export const ApplicationForm: FC<ApplicationProps> = ({
  formType,
  applicationId,
  initialAnswers,
  onApplicationCreated,
}) => {
  const form = getFormByTypeId(formType)
  const [state, dispatch] = useReducer(
    ApplicationReducer,
    {
      form,
      formLeaves: [],
      formValue: initialAnswers,
      activeSection: 0,
      activeSubSection: 0,
      activeScreen: 0,
      progress: 0,
      screens: [],
      sections: [],
      applicationId,
    },
    initializeReducer,
  )
  const {
    activeSection,
    activeSubSection,
    activeScreen,
    formValue,
    progress,
    sections,
    screens,
    applicationId: existingApplicationId,
  } = state

  return (
    <Box display="flex" flexGrow={1}>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="row"
        className={styles.applicationContainer}
      >
        <Box className={styles.sidebarContainer}>
          <Sidebar>
            <ApplicationName name={form.name} icon={form.icon} />
            <Box display="flex" flexDirection={['column', 'columnReverse']}>
              <FormProgress
                sections={sections}
                activeSection={activeSection}
                activeSubSection={activeSubSection}
              />
              <ProgressIndicator progress={progress} />
            </Box>
          </Sidebar>
        </Box>

        <Box
          paddingX={[3, 3, 12]}
          paddingTop={4}
          height="full"
          className={styles.screenContainer}
        >
          <Screen
            answerQuestions={(payload) =>
              dispatch({ type: ActionTypes.ANSWER, payload })
            }
            dataSchema={form.schema}
            formTypeId={form.id}
            formValue={formValue}
            expandRepeater={() =>
              dispatch({ type: ActionTypes.EXPAND_REPEATER })
            }
            nextScreen={() => dispatch({ type: ActionTypes.NEXT_SCREEN })}
            prevScreen={() => dispatch({ type: ActionTypes.PREV_SCREEN })}
            shouldSubmit={activeScreen === screens.length - 1}
            setApplicationId={(id) => {
              dispatch({ type: ActionTypes.SET_APPLICATION_ID, payload: id })
              if (onApplicationCreated) {
                onApplicationCreated(id)
              }
            }}
            screen={screens[activeScreen]}
            section={sections[activeSection]}
            applicationId={existingApplicationId}
          />
        </Box>
      </Box>
    </Box>
  )
}
