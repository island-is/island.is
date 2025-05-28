import { Box, Button, GridColumn } from '@island.is/island-ui/core'
import * as styles from './Footer.css'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { useIntl } from 'react-intl'
import { webMessages } from '@island.is/form-system/ui'
import { SAVE_SCREEN } from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'

interface Props {
  externalDataAgreement: boolean
}

export const Footer = ({ externalDataAgreement }: Props) => {
  const { state, dispatch } = useApplicationContext()
  const { formatMessage } = useIntl()

  const continueButtonText =
    state.currentSection.index === 0
      ? formatMessage(webMessages.externalDataConfirmation)
      : formatMessage(webMessages.continue)
  const enableContinueButton =
    state.currentSection.index === 0
      ? externalDataAgreement
      : state.currentSection.index !== state.sections.length - 1

  const submitScreen = useMutation(SAVE_SCREEN)

  const handleIncrement = () =>
    dispatch({
      type: 'INCREMENT',
      payload: {
        submitScreen,
      },
    })
  const handleDecrement = () => dispatch({ type: 'DECREMENT' })

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
              onClick={handleIncrement}
              disabled={!enableContinueButton}
            >
              {continueButtonText}
            </Button>
          </Box>
          {state.currentSection.index > 1 && (
            <Box display="inlineFlex" padding={2} paddingLeft="none">
              <Button
                icon="arrowBack"
                variant="ghost"
                onClick={handleDecrement}
              >
                {formatMessage(webMessages.back)}
              </Button>
            </Box>
          )}
        </Box>
      </GridColumn>
    </Box>
  )
}
