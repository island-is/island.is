import React, { FC, useEffect, useReducer } from 'react'

import {
  FormValue,
  FormType,
  getFormByTypeId,
  ExternalData,
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
  applicationId?: string
  formType: FormType
  initialAnswers?: FormValue
  initialExternalData?: ExternalData
  loadingApplication: boolean
  onApplicationCreated?(id: string): void
}

export const ApplicationForm: FC<ApplicationProps> = ({
  applicationId,
  formType,
  initialAnswers,
  initialExternalData = {},
  loadingApplication,
  onApplicationCreated = () => undefined,
}) => {
  const form = getFormByTypeId(formType)
  const [state, dispatch] = useReducer(
    ApplicationReducer,
    {
      externalData: initialExternalData,
      form,
      formLeaves: [],
      formValue: initialAnswers,
      activeSection: 0,
      activeSubSection: 0,
      activeScreen: 0,
      progress: 0,
      screens: [],
      sections: [],
    },
    initializeReducer,
  )
  const {
    activeSection,
    activeSubSection,
    activeScreen,
    externalData,
    formValue,
    progress,
    sections,
    screens,
  } = state

  // TODO this is not good enough
  useEffect(() => {
    if (!loadingApplication) {
      dispatch({
        type: ActionTypes.RE_INITIALIZE,
        payload: {
          formValue: initialAnswers,
          externalData: initialExternalData,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingApplication])

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
            addExternalData={(payload) =>
              dispatch({ type: ActionTypes.ADD_EXTERNAL_DATA, payload })
            }
            answerQuestions={(payload) =>
              dispatch({ type: ActionTypes.ANSWER, payload })
            }
            dataSchema={form.schema}
            externalData={externalData}
            formTypeId={form.id}
            formValue={formValue}
            expandRepeater={() =>
              dispatch({ type: ActionTypes.EXPAND_REPEATER })
            }
            answerAndGoToNextScreen={(payload) =>
              dispatch({ type: ActionTypes.ANSWER_AND_GO_NEXT_SCREEN, payload })
            }
            prevScreen={() => dispatch({ type: ActionTypes.PREV_SCREEN })}
            shouldSubmit={activeScreen === screens.length - 1}
            setApplicationId={(id) => {
              if (onApplicationCreated) {
                onApplicationCreated(id)
              }
            }}
            screen={screens[activeScreen]}
            section={sections[activeSection]}
            applicationId={applicationId}
          />
        </Box>
      </Box>
    </Box>
  )
}
