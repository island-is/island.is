import {
  Box,
  GridContainer as Grid,
  GridColumn as Column,
  GridRow as Row,
} from '@island.is/island-ui/core'
import * as styles from './Form.css'
import { useHeaderInfo } from '../../context/HeaderInfoProvider'
import { FormStepper } from '@island.is/form-system/ui'
import { FormSystemSection } from '@island.is/api/schema'
import { Screen } from '../Screen/Screen'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { useEffect } from 'react'

export const Form = () => {
  const { setInfo } = useHeaderInfo()
  const { state } = useApplicationContext()
  useEffect(() => {
    setInfo({
      applicationName: state.application?.formName?.is ?? '',
      organisationName: state.application?.organizationName?.is ?? '',
    })
  }, [state.application.formName, state.application.organizationName, setInfo])

  return (
    <Box className={styles.root}>
      <Box
        paddingTop={[0, 4]}
        paddingLeft={[0, 4]}
        paddingBottom={[0, 5]}
        width="full"
        height="full"
      >
        <Grid>
          <Row>
            {/* Screen  */}
            <Column
              span={['12/12', '12/12', '9/12', '9/12']}
              className={styles.shellContainer}
            >
              <Box
                paddingTop={[3, 6, 10]}
                height="full"
                borderRadius="large"
                background="white"
              >
                <Screen />
              </Box>
            </Column>
            {/* FormStepper */}
            <Column
              span={['12/12', '12/12', '3/12', '3/12']}
              className={styles.sidebarContainer}
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                height="full"
                paddingTop={[0, 0, 8]}
                paddingLeft={[0, 0, 0, 4]}
                className={styles.sidebarInner}
              >
                <FormStepper
                  sections={(state.sections ?? []).filter(
                    (section): section is FormSystemSection => section !== null,
                  )}
                  currentSection={state.currentSection}
                  currentScreen={state.currentScreen}
                />
              </Box>
            </Column>
          </Row>
        </Grid>
      </Box>
    </Box>
  )
}
