import React, { FC, useReducer } from 'react'
import { Application } from '@island.is/application/template'
import FormProgress from '../components/FormProgress/'
import Sidebar from '../components/Sidebar'
import Screen from '../components/Screen'
import {
  ApplicationReducer,
  initializeReducer,
} from '../reducer/ApplicationFormReducer'
import { ActionTypes } from '../reducer/ReducerTypes'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'

import * as styles from './ApplicationForm.treat'

export const ApplicationForm: FC<{ application: Application }> = ({
  application,
}) => {
  const [state, dispatch] = useReducer(
    ApplicationReducer,
    {
      application,
      form: undefined,
      formLeaves: [],
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
    application: storedApplication,
    form,

    sections,
    screens,
  } = state

  return (
    <Box paddingTop={[0, 4]} paddingBottom={[0, 5]} width="full" height="full">
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '9/12', '9/12']}>
            <Box
              paddingTop={[3, 6, 8]}
              height="full"
              borderRadius="large"
              background="white"
            >
              <Screen
                addExternalData={(payload) =>
                  dispatch({ type: ActionTypes.ADD_EXTERNAL_DATA, payload })
                }
                answerQuestions={(payload) =>
                  dispatch({ type: ActionTypes.ANSWER, payload })
                }
                dataSchema={form.schema}
                externalData={storedApplication.externalData}
                formTypeId={form.id}
                formValue={storedApplication.answers}
                expandRepeater={() =>
                  dispatch({ type: ActionTypes.EXPAND_REPEATER })
                }
                answerAndGoToNextScreen={(payload) =>
                  dispatch({
                    type: ActionTypes.ANSWER_AND_GO_NEXT_SCREEN,
                    payload,
                  })
                }
                prevScreen={() => dispatch({ type: ActionTypes.PREV_SCREEN })}
                shouldSubmit={activeScreen === screens.length - 1}
                screen={screens[activeScreen]}
                section={sections[activeSection]}
                applicationId={storedApplication.id}
              />
            </Box>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '3/12', '3/12']}
            className={styles.largeSidebarContainer}
          >
            <Sidebar>
              <FormProgress
                formName={form.name}
                formIcon={form.icon}
                sections={sections}
                activeSection={activeSection}
                activeSubSection={activeSubSection}
              />
            </Sidebar>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
