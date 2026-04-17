import { useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { NotificationCommands } from '@island.is/form-system/enums'
import {
  CREATE_PAYMENT,
  NOTIFY_EXTERNAL_SERVICE,
  SAVE_SCREEN,
  SUBMIT_APPLICATION,
  SUBMIT_SECTION,
  UPDATE_APPLICATION_SETTINGS,
  removeTypename,
} from '@island.is/form-system/graphql'
import {
  FieldTypesEnum,
  SectionTypes,
  getValue,
  m,
} from '@island.is/form-system/ui'
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
  const updateDependencies = useMutation(UPDATE_APPLICATION_SETTINGS)
  const [notifyExternal, { loading: notifyLoading }] = useMutation(
    NOTIFY_EXTERNAL_SERVICE,
  )
  const [createPayment, { loading: paymentLoading }] =
    useMutation(CREATE_PAYMENT)

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

  const hasVisiblePaymentField = state.sections?.some((section) =>
    section?.screens?.some((screen) =>
      screen?.fields?.some(
        (field) =>
          field?.fieldType === FieldTypesEnum.PAYMENT &&
          field?.isHidden === false,
      ),
    ),
  )

  const shouldShowPay =
    currentSection?.data.sectionType === SectionTypes.PAYMENT ||
    (currentSection?.data.sectionType === SectionTypes.SUMMARY &&
      hasVisiblePaymentField)

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
    if (paymentLoading) return
    const isValid = await validate()
    dispatch({ type: 'SET_VALIDITY', payload: { isValid } })
    if (!isValid) return

    if (isCompletedSection) {
      window.open('/minarsidur', '_blank', 'noopener,noreferrer')
      return
    }

    if (shouldShowPay) {
      const chargeItems: {
        code: string
        quantity?: number
        amount?: number
      }[] = []
      const paymentQuantityFields: FormSystemField[] = []
      state.sections?.forEach((section) => {
        section?.screens?.forEach((screen) => {
          screen?.fields?.forEach((field) => {
            if (
              field?.fieldType === FieldTypesEnum.PAYMENT_QUANTITY &&
              field?.isHidden === false
            ) {
              paymentQuantityFields.push(field)
            }
          })
        })
      })

      state.sections?.forEach((section) => {
        section?.screens?.forEach((screen) => {
          screen?.fields
            ?.filter(
              (field) =>
                field?.fieldType === FieldTypesEnum.PAYMENT &&
                field?.isHidden === false,
            )
            .forEach((field) => {
              if (field?.fieldSettings?.chargeItemCode) {
                const code = field.fieldSettings.chargeItemCode
                let quantity: number | undefined = 1
                const amount: number | undefined = field.fieldSettings
                  .priceAmount as number | undefined
                if (field.fieldSettings.paymentQuantityId) {
                  const quantityField = paymentQuantityFields.find(
                    (f) => f.id === field?.fieldSettings?.paymentQuantityId,
                  )
                  if (quantityField) {
                    quantity = getValue(quantityField, 'number')
                  }
                }
                chargeItems.push({ code, quantity, amount })
              }
            })
        })
      })
      const { data } = await createPayment({
        variables: {
          input: {
            applicationId: state.application.id,
            createChargeRequestDto: {
              performingOrganizationID: '6509142520',
              chargeItems,
            },
          },
        },
      })
      console.log(data)
      if (data?.createFormSystemPayment?.paymentUrl) {
        window.location.href = data.createFormSystemPayment.paymentUrl
      }
      return
    }

    if (state.currentScreen?.isPopulateError) {
      return
    }

    if (
      !onSubmit &&
      state.currentScreen?.data?.shouldValidate &&
      state.application.submissionServiceUrl !== 'zendesk'
    ) {
      try {
        const { data } = await notifyExternal({
          variables: {
            input: {
              applicationId: state.application.id,
              nationalId: '',
              slug: state.application.slug,
              isTest: state.application.isTest,
              command: NotificationCommands.VALIDATE,
              screen: state.currentScreen.data,
            },
          },
        })

        const updatedScreen = removeTypename(
          data?.notifyFormSystemExternalSystem?.screen,
        )

        dispatch({
          type: 'EXTERNAL_SERVICE_NOTIFICATION',
          payload: {
            screen: updatedScreen,
          },
        })
        if (updatedScreen?.screenError?.hasError) {
          return
        }
      } catch (error) {
        console.error('Error notifying external service:', error)
        return
      }
    }

    if (shouldShowPay) {
      const chargeItems: {
        code: string
        quantity?: number
        amount?: number
      }[] = []
      const paymentQuantityFields: FormSystemField[] = []
      state.sections?.forEach((section) => {
        section?.screens?.forEach((screen) => {
          screen?.fields?.forEach((field) => {
            if (
              field?.fieldType === FieldTypesEnum.PAYMENT_QUANTITY &&
              field?.isHidden === false
            ) {
              paymentQuantityFields.push(field)
            }
          })
        })
      })

      state.sections?.forEach((section) => {
        section?.screens?.forEach((screen) => {
          screen?.fields
            ?.filter(
              (field) =>
                field?.fieldType === FieldTypesEnum.PAYMENT &&
                field?.isHidden === false,
            )
            .forEach((field) => {
              if (field?.fieldSettings?.chargeItemCode) {
                const code = field.fieldSettings.chargeItemCode
                let quantity: number | undefined = 1
                const amount: number | undefined = field.fieldSettings
                  .priceAmount as number | undefined
                if (field.fieldSettings.paymentQuantityId) {
                  const quantityField = paymentQuantityFields.find(
                    (f) => f.id === field?.fieldSettings?.paymentQuantityId,
                  )
                  if (quantityField) {
                    quantity = getValue(quantityField, 'number')
                  }
                }
                chargeItems.push({ code, quantity, amount })
              }
            })
        })
      })
      const { data } = await createPayment({
        variables: {
          input: {
            applicationId: state.application.id,
            createChargeRequestDto: {
              performingOrganizationID: '6509142520',
              chargeItems,
            },
          },
        },
      })
      console.log(data)
      if (data?.createFormSystemPayment?.paymentUrl) {
        window.location.href = data.createFormSystemPayment.paymentUrl
      }
      return
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
              disabled={
                !enableContinueButton ||
                paymentLoading ||
                submitLoading ||
                notifyLoading ||
                state.currentScreen?.isPopulateError
              }
              loading={submitLoading || notifyLoading || paymentLoading}
            >
              {shouldShowPay ? formatMessage(m.pay) : continueButtonText}
            </Button>
          </Box>
          {showBackButton && (
            <Box display="inlineFlex" padding={2} paddingLeft="none">
              <Button
                preTextIcon="arrowBack"
                variant="ghost"
                onClick={handleDecrement}
                disabled={submitLoading || notifyLoading}
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
