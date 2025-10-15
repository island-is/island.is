import { useMutation } from '@apollo/client'
import {
  SAVE_SCREEN,
  SUBMIT_APPLICATION,
  SUBMIT_SECTION,
} from '@island.is/form-system/graphql'
import { SectionTypes, m } from '@island.is/form-system/ui'
import { Box, Button, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { useApplicationContext } from '../../context/ApplicationProvider'
import * as styles from './Footer.css'

interface Props {
  externalDataAgreement: boolean
}

export const Footer = ({ externalDataAgreement }: Props) => {
  const { state, dispatch } = useApplicationContext()
  const { formatMessage } = useLocale()
  const { trigger } = useFormContext()
  const { currentSection } = state
  const currentSectionType = currentSection?.data?.sectionType

  const submitScreen = useMutation(SAVE_SCREEN)
  const submitSection = useMutation(SUBMIT_SECTION)
  const [submitApplication, { loading: submitLoading }] = useMutation(
    SUBMIT_APPLICATION,
    {
      errorPolicy: 'none',
    },
  )

  const validate = async () => trigger()

  const lastScreenDisplayOrder = state.application.sections
    ?.at(-1)
    ?.screens?.at(-1)?.displayOrder

  const onSubmit =
    currentSectionType === SectionTypes.PAYMENT ||
    (currentSectionType === SectionTypes.SUMMARY &&
      state.application.hasPayment !== true) ||
    (state.application.hasPayment === false &&
      state.application.hasSummaryScreen === false &&
      state.currentScreen?.index === lastScreenDisplayOrder)

  const isCompletedSection = currentSectionType === SectionTypes.COMPLETED

  const continueButtonText =
    state.currentSection.index === 0
      ? formatMessage(m.externalDataConfirmation)
      : onSubmit
      ? formatMessage(m.submitApplication)
      : isCompletedSection
      ? formatMessage(m.openMyPages)
      : formatMessage(m.continue)

  const enableContinueButton =
    state.currentSection.index === 0 ? externalDataAgreement : true

  const showBackButton =
    !isCompletedSection &&
    !(
      currentSectionType === SectionTypes.PARTIES &&
      Number(state.currentScreen?.index) === 0
    ) &&
    currentSectionType !== SectionTypes.PREMISES

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
            {/* {isCompletedSection && ( */}
            <Button
              icon="arrowForward"
              onClick={handleIncrement}
              disabled={!enableContinueButton || submitLoading}
              loading={submitLoading}
            >
              {continueButtonText}
            </Button>
            {/* )} */}
          </Box>
          {showBackButton && (
            <Box display="inlineFlex" padding={2} paddingLeft="none">
              <Button
                icon="arrowBack"
                variant="ghost"
                onClick={handleDecrement}
                disabled={submitLoading}
              >
                {formatMessage(m.back)}
              </Button>
            </Box>
          )}
        </Box>
      </GridColumn>
    </Box>
  )
}
