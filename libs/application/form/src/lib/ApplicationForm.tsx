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
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'

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
    <Box
      display="flex"
      flexGrow={1}
      paddingX={[0, 5]}
      paddingTop={[0, 4]}
      paddingBottom={[0, 5]}
      background="purple100"
    >
      <Box width="full">
        <GridRow>
          <GridColumn span={['12/12', '12/12', '9/12', '9/12']}>
            <Box
              paddingTop={8}
              height="full"
              borderRadius="large"
              background="white"
            >
              {/* <GridColumn
                span={['12/12', '12/12', '7/9', '7/9']}
                offset={[null, '1/9']}
              > */}
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
              {/* </GridColumn> */}
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '3/12', '3/12']}>
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
      </Box>
    </Box>
  )
}
