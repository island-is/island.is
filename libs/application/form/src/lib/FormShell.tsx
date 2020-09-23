import React, { FC, useReducer } from 'react'
import cn from 'classnames'

import { Application, Form, Schema } from '@island.is/application/template'

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
  Tag,
} from '@island.is/island-ui/core'

import * as styles from './FormShell.treat'
import { FormModes, ProgressThemes } from '../types'

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
    sections,
    screens,
  } = state

  const { mode = FormModes.APPLYING } = state.form

  const progressTheme = {
    [FormModes.APPLYING]: ProgressThemes.PURPLE,
    [FormModes.APPROVED]: ProgressThemes.GREEN,
    [FormModes.REVIEW]: ProgressThemes.BLUE,
    [FormModes.REJECTED]: ProgressThemes.RED,
  }

  const ProgressTag: FC = () => {
    switch (mode) {
      case FormModes.REVIEW:
      case FormModes.PENDING:
        return (
          <Tag variant="darkerBlue" label bordered>
            Status: In Review
          </Tag>
        )
      case FormModes.APPROVED:
        return (
          <Tag variant="darkerMint" label bordered>
            Status: Approved
          </Tag>
        )
      case FormModes.REJECTED:
        return (
          <Tag variant="red" label bordered>
            Status: Rejected
          </Tag>
        )
      default:
        return null
    }
  }

  const showProgressTag = mode !== FormModes.APPLYING

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
                  dataSchema={dataSchema}
                  externalData={storedApplication.externalData}
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
                  shouldSubmit={activeScreen === screens.length - 2}
                  isLastScreen={activeScreen === screens.length - 1} // TODO do this better
                  screen={screens[activeScreen]}
                  mode={mode}
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
                  theme={progressTheme[mode]}
                  tag={showProgressTag && <ProgressTag />}
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
    </Box>
  )
}
