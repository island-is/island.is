import React, { FC, useReducer } from 'react'
import cn from 'classnames'
import {
  Application,
  Form,
  FormModes,
  Schema,
} from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'

import { Sidebar } from '../components/Sidebar'
import Screen from '../components/Screen'
import FormStepper from '../components/FormStepper'
import {
  ApplicationReducer,
  initializeReducer,
} from '../reducer/ApplicationFormReducer'
import { ActionTypes } from '../reducer/ReducerTypes'
import * as styles from './FormShell.treat'

export const FormShell: FC<{
  application: Application
  nationalRegistryId: string
  form: Form
  dataSchema: Schema
}> = ({ application, nationalRegistryId, form, dataSchema }) => {
  const [state, dispatch] = useReducer(
    ApplicationReducer,
    {
      application,
      nationalRegistryId,
      dataSchema,
      form,
      activeScreen: 0,
      screens: [],
      sections: [],
    },
    initializeReducer,
  )
  const {
    activeScreen,
    application: storedApplication,
    sections,
    screens,
  } = state

  const { mode = FormModes.APPLYING } = state.form
  const showProgressTag = mode !== FormModes.APPLYING

  const currentScreen = screens[activeScreen]

  return (
    <Box
      className={cn(styles.root, {
        [styles.rootApplying]: mode === FormModes.APPLYING,
        [styles.rootApproved]: mode === FormModes.APPROVED,
        [styles.rootPending]: mode === FormModes.PENDING,
        [styles.rootReviewing]: mode === FormModes.REVIEW,
        [styles.rootRejected]: mode === FormModes.REJECTED,
      })}
    >
      <Box
        paddingTop={[0, 4]}
        paddingBottom={[0, 5]}
        width="full"
        height="full"
      >
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '9/12', '9/12']}
              className={styles.shellContainer}
            >
              <Box
                paddingTop={[3, 6, 8]}
                height="full"
                borderRadius="large"
                background="white"
              >
                <Screen
                  application={storedApplication}
                  addExternalData={(payload) =>
                    dispatch({ type: ActionTypes.ADD_EXTERNAL_DATA, payload })
                  }
                  answerQuestions={(payload) =>
                    dispatch({ type: ActionTypes.ANSWER, payload })
                  }
                  dataSchema={dataSchema}
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
                  activeScreenIndex={activeScreen}
                  numberOfScreens={screens.length}
                  screen={currentScreen}
                  mode={mode}
                />
              </Box>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '3/12', '3/12']}
              className={styles.largeSidebarContainer}
            >
              <Sidebar>
                <FormStepper
                  application={storedApplication}
                  mode={mode}
                  showTag={showProgressTag}
                  form={form}
                  sections={sections}
                  screen={currentScreen}
                />
              </Sidebar>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </Box>
  )
}
