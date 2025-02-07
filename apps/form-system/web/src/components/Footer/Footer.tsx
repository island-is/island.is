import { Box, Button, GridColumn, GridContainer } from "@island.is/island-ui/core"
import * as styles from './Footer.css'
import { useApplicationContext } from "../../context/ApplicationProvider"


export const Footer = () => {
  const { state, dispatch } = useApplicationContext()

  return (
    <Box marginTop={7} className={styles.buttonContainer}>
      <GridColumn
        span={['12/12', '12/12', '10/12', '7/9']}
        offset={['0', '0', '1/12', '1/9']}
      >
        <Box
          display="flex"
          flexDirection="rowReverse"
          alignItems="center"
          justifyContent="spaceBetween"
          paddingTop={[1, 4]}
        >
          <Box display="inlineFlex" padding={2} paddingRight="none">
            {/* Implement logic on whether submit button should be rendered */}
            <Button
              icon="arrowForward"
              onClick={() => dispatch({
                type: 'INCREMENT'
              })}
            >
              Áfram
            </Button>
          </Box>
          {/* <Box display={['inlineFlex', 'none']} padding={2} paddingLeft="none"> */}
          {
            state.currentSection.index > 0 && (
              <Box display="inlineFlex" padding={2} paddingLeft="none">
                <Button
                  icon="arrowBack"
                  variant="ghost"
                  onClick={() => dispatch({
                    type: 'DECREMENT'
                  })}
                >
                  Til baka
                </Button>
              </Box>
            )
          }
        </Box>
      </GridColumn>
    </Box>
  )
}