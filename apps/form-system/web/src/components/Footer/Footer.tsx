import { Box, Button, GridColumn } from '@island.is/island-ui/core'
import * as styles from './Footer.css'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { useIntl } from 'react-intl'
import { SectionTypes, webMessages } from '@island.is/form-system/ui'
import {
  SAVE_SCREEN,
  SUBMIT_APPLICATION,
  SUBMIT_SECTION,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { useFormContext } from 'react-hook-form'

interface Props {
  externalDataAgreement: boolean
}

export const Footer = ({ externalDataAgreement }: Props) => {
  const { state, dispatch } = useApplicationContext()
  const { currentSection } = state
  const { formatMessage } = useIntl()
  const { trigger } = useFormContext()

  const validate = async () => {
    const valid = await trigger()
    return valid
  }
  const continueButtonText =
    state.currentSection.index === 0
      ? formatMessage(webMessages.externalDataConfirmation)
      : currentSection.data.sectionType === SectionTypes.SUMMARY
      ? formatMessage(webMessages.submitApplication)
      : formatMessage(webMessages.continue)
  const enableContinueButton =
    state.currentSection.index === 0 ? externalDataAgreement : true
  const submitScreen = useMutation(SAVE_SCREEN)
  const submitSection = useMutation(SUBMIT_SECTION)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION)

  const handleIncrement = async () => {
    const isValid = await validate()

    if (currentSection.data.sectionType === SectionTypes.SUMMARY) {
      return submitApplication({
        variables: {
          input: {
            id: state.application.id,
          },
        },
      })
    }

    dispatch({
      type: 'SET_VALIDITY',
      payload: { isValid },
    })

    if (!isValid) return

    dispatch({
      type: 'INCREMENT',
      payload: {
        submitScreen,
        submitSection,
      },
    })
  }
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
