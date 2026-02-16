import { useMutation } from '@apollo/client'
import {
  NOTIFY_EXTERNAL_SERVICE,
  SAVE_SCREEN,
  SUBMIT_APPLICATION,
  SUBMIT_SECTION,
  UPDATE_APPLICATION_SETTINGS,
} from '@island.is/form-system/graphql'
import { SectionTypes, m } from '@island.is/form-system/ui'
import { Box, Button, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { useApplicationContext } from '../../context/ApplicationProvider'
import * as styles from './Footer.css'
import { NotificationActions } from '@island.is/form-system/enums'
import { removeTypename } from '@island.is/form-system/graphql'

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
  const updateDependencies = useMutation(UPDATE_APPLICATION_SETTINGS)
  const [notifyExternal] = useMutation(NOTIFY_EXTERNAL_SERVICE)

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

  const hasVisibleApplicantBeforeCurrentScreen = (): boolean => {
    const screens = currentSection?.data?.screens
    const currentIndex = state.currentScreen?.index
    if (!Array.isArray(screens) || currentIndex == null) return false
    for (let i = Number(currentIndex) - 1; i >= 0; i--) {
      const screen = screens[i]
      if (screen && screen.isHidden === false) {
        return true
      }
    }
    return false
  }

  const showBackButton =
    (currentSectionType !== SectionTypes.COMPLETED &&
      currentSectionType !== SectionTypes.PREMISES &&
      currentSectionType !== SectionTypes.PARTIES) ||
    (currentSectionType === SectionTypes.PARTIES &&
      hasVisibleApplicantBeforeCurrentScreen())

  const handleIncrement = async () => {
    const isValid = await validate()
    dispatch({ type: 'SET_VALIDITY', payload: { isValid } })
    if (!isValid) return

    if (isCompletedSection) {
      window.open('/minarsidur', '_blank', 'noopener,noreferrer')
      return
    }

    if (
      !onSubmit &&
      state.currentScreen?.data?.shouldValidate &&
      state.application.submissionServiceUrl !== 'zendesk'
    ) {
      // console.log(
      //   `current screen data before notifying external service: ${JSON.stringify(
      //     state.currentScreen?.data,
      //   )}`,
      // )
      try {
        const { data } = await notifyExternal({
          variables: {
            input: {
              url: state.application.submissionServiceUrl || '',
              notificationDto: {
                applicationId: state.application.id,
                nationalId: '',
                slug: state.application.slug,
                isTest: state.application.isTest,
                command: NotificationActions.VALIDATE,
                screen: state.currentScreen.data,
              },
            },
          },
        })

        console.log(`data from notifyExternal: ${JSON.stringify(data)}`)
        const updatedScreen = removeTypename(
          data?.notifyFormSystemExternalSystem?.screen,
        )
        console.log(
          `Response from external service: ${JSON.stringify(updatedScreen)}`,
        )
        if (data.notifyFormSystemExternalSystem.validationFailed) {
          dispatch({
            type: 'EXTERNAL_SERVICE_VALIDATION',
            payload: {
              command: NotificationActions.VALIDATE,
              validationFailed:
                data.notifyFormSystemExternalSystem.validationFailed,
              screen: updatedScreen,
            },
          })
          return
          // if (data.notifyFormSystemExternalSystem.validationFailed) {
          //   return
          // }
        }
      } catch (error) {
        console.error('Error notifying external service:', error)
        return
      }
    }

    if (!onSubmit) {
      dispatch({
        type: 'INCREMENT',
        payload: {
          submitScreen: submitScreen,
          submitSection: submitSection,
          updateDependencies: updateDependencies,
        },
      })
      return
    }
    try {
      const { data } = await submitApplication({
        variables: { input: { id: state.application.id } },
      })
      if (data?.submitFormSystemApplication?.submissionFailed) {
        dispatch({
          type: 'SUBMITTED',
          payload: {
            submitted: false,
            screenError: data?.submitFormSystemApplication?.validationError,
          },
        })
        return
      }
      dispatch({
        type: 'INCREMENT',
        payload: {
          submitScreen: submitScreen,
          submitSection: submitSection,
          updateDependencies: updateDependencies,
        },
      })
      dispatch({
        type: 'SUBMITTED',
        payload: {
          submitted: true,
          screenError: {
            hasError: false,
            title: { is: '', en: '' },
            message: { is: '', en: '' },
          },
        },
      })
    } catch (error) {
      console.error('Error submitting application', error)
      throw new Error('Error submitting application')
    }
  }

  const handleDecrement = () =>
    dispatch({
      type: 'DECREMENT',
      payload: {
        submitScreen: submitScreen,
        submitSection: submitSection,
        updateDependencies: updateDependencies,
      },
    })

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
          {showBackButton && (
            <Box display="inlineFlex" padding={2} paddingLeft="none">
              <Button
                preTextIcon="arrowBack"
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
