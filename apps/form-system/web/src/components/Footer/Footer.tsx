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

  // Mutations
  const submitScreen = useMutation(SAVE_SCREEN)
  const submitSection = useMutation(SUBMIT_SECTION)
  const [submitApplication, { loading: submitLoading }] = useMutation(
    SUBMIT_APPLICATION,
    {
      errorPolicy: 'none',
    },
  )

  const validate = async () => trigger()

  const onSubmit =
    (currentSection.data.sectionType === SectionTypes.SUMMARY &&
      (state.application.hasPayment === false ||
        state.application.hasPayment === undefined)) ||
    currentSection.data.sectionType === SectionTypes.PAYMENT ||
    (state.application.hasPayment === false &&
      state.application.hasSummaryScreen === false &&
      state.currentScreen?.index ===
        state.application.sections?.at(-1)?.screens?.at(-1)?.displayOrder)

  const isCompletedSection =
    state.currentSection.data.sectionType === SectionTypes.COMPLETED
  const continueButtonText =
    state.currentSection.index === 0
      ? formatMessage(webMessages.externalDataConfirmation)
      : onSubmit
      ? formatMessage(webMessages.submitApplication)
      : isCompletedSection
      ? formatMessage(webMessages.openMyPages)
      : formatMessage(webMessages.continue)

  const enableContinueButton =
    state.currentSection.index === 0 ? externalDataAgreement : true
  const isBackButton = state.currentSection.index <= 1 || isCompletedSection
  const handleIncrement = async () => {
    const isValid = await validate()
    dispatch({ type: 'SET_VALIDITY', payload: { isValid } })
    if (!isValid) return

    if (isCompletedSection) {
      window.open('/minarsidur', '_blank', 'noopener,noreferrer')
      return
    }

    if (!onSubmit) {
      dispatch({
        type: 'INCREMENT',
        payload: {
          submitScreen: submitScreen,
          submitSection: submitSection,
        },
      })
      return
    }
    try {
      await submitApplication({
        variables: { input: { id: state.application.id } },
      })
      dispatch({
        type: 'INCREMENT',
        payload: {
          submitScreen: submitScreen,
          submitSection: submitSection,
        },
      })
      dispatch({ type: 'SUBMITTED', payload: true })
    } catch {
      dispatch({ type: 'SUBMITTED', payload: false })
    }
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
            <Button
              icon="arrowForward"
              onClick={handleIncrement}
              disabled={!enableContinueButton || submitLoading}
              loading={submitLoading}
            >
              {continueButtonText}
            </Button>
          </Box>

          {!isBackButton && (
            <Box display="inlineFlex" padding={2} paddingLeft="none">
              <Button
                icon="arrowBack"
                variant="ghost"
                onClick={handleDecrement}
                disabled={submitLoading}
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
