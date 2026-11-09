import { useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { NotificationCommands } from '@island.is/form-system/enums'
import {
  NOTIFY_EXTERNAL_SERVICE,
  removeTypename,
} from '@island.is/form-system/graphql'
import { m, SectionTypes } from '@island.is/form-system/ui'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ComponentProps, Fragment, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { Footer } from '../Footer/Footer'
import { Applicants } from './components/Applicants/Applicants'
import { Completed } from './components/Completed/Completed'
import { ExternalData } from './components/ExternalData/ExternalData'
import { Field } from './components/Field/Field'
import { Payment } from './components/Payment/Payment'
import { Summary } from './components/Summary/Summary'

export const Screen = () => {
  const { state, dispatch, validateEligibility } = useApplicationContext()
  const { lang } = useLocale()
  const { currentSection, currentScreen } = state
  const { formatMessage } = useIntl()
  const multiMax = currentScreen?.data?.multiMax ?? 1
  const isMulti = currentScreen?.data?.isMulti ?? false

  const visibleFields = useMemo(
    () =>
      currentScreen?.data?.fields?.filter(
        (field): field is NonNullable<typeof field> =>
          field != null && !field.isHidden,
      ) ?? [],
    [currentScreen?.data?.fields],
  )

  const [numberOfItems, setNumberOfItems] = useState(1)
  const multisetFields = isMulti
    ? visibleFields.filter((field) => field.isPartOfMultiset !== false)
    : []
  const firstMultisetFieldIndex = visibleFields.findIndex(
    (field) => isMulti && field.isPartOfMultiset !== false,
  )
  const orderedFields =
    firstMultisetFieldIndex === -1
      ? visibleFields
      : [
          ...visibleFields.slice(0, firstMultisetFieldIndex),
          ...multisetFields,
          ...visibleFields
            .slice(firstMultisetFieldIndex)
            .filter((field) => field.isPartOfMultiset === false),
        ]
  const lastMultisetFieldIndex =
    firstMultisetFieldIndex === -1
      ? -1
      : firstMultisetFieldIndex + multisetFields.length - 1

  const calculatedMaxItems = useMemo(() => {
    if (isMulti && multiMax > 1) {
      return Math.max(
        1,
        ...visibleFields
          .filter((field) => field.isPartOfMultiset !== false)
          .map((field) => field.values?.length ?? 1),
      )
    }
    return 1
  }, [isMulti, multiMax, visibleFields])

  useEffect(() => {
    setNumberOfItems((prev) =>
      prev !== calculatedMaxItems ? calculatedMaxItems : prev,
    )
  }, [currentScreen?.data?.id, calculatedMaxItems])

  const displayMultiButtons =
    isMulti && multiMax > 1 && multisetFields.length > 0

  const screenTitle =
    currentScreen?.data?.name?.[lang] ??
    (currentSection?.data?.sectionType === SectionTypes.COMPLETED
      ? null
      : state.sections?.[currentSection?.index]?.name?.[lang] ?? '')

  const currentSectionType = state.sections?.[currentSection.index]?.sectionType
  const [externalDataAgreement, setExternalDataAgreement] = useState(
    state.sections?.[0].isCompleted ?? false,
  )
  const [
    hasValidateEligibilityNotificationError,
    setHasValidateEligibilityNotificationError,
  ] = useState(false)
  const [
    isValidateEligibilityNotificationLoading,
    setIsValidateEligibilityNotificationLoading,
  ] = useState(false)
  const hasValidateEligibilityError =
    currentSectionType === SectionTypes.PREMISES &&
    validateEligibility &&
    (state.screenError?.hasError === true ||
      hasValidateEligibilityNotificationError ||
      isValidateEligibilityNotificationLoading)

  const [notifyExternal] = useMutation(NOTIFY_EXTERNAL_SERVICE)
  const [notificationError, setNotificationError] =
    useState<ComponentProps<typeof ExternalData>['notificationError']>()
  const [operationSuccessful, setOperationSuccessful] = useState<boolean>()

  const confirmPremises = async () => {
    const { application } = state
    if (
      !validateEligibility ||
      application.submissionServiceUrl === 'zendesk'
    ) {
      return true
    }
    if (isValidateEligibilityNotificationLoading) return false

    setHasValidateEligibilityNotificationError(false)
    setIsValidateEligibilityNotificationLoading(true)
    try {
      const { data } = await notifyExternal({
        variables: {
          input: {
            applicationId: application.id,
            nationalId: '',
            actorNationalId: '',
            organizationNationalId: application.organizationNationalId ?? '',
            slug: application.slug,
            isTest: application.isTest,
            command: NotificationCommands.VALIDATE_ELIGIBILITY,
            screenDto: undefined,
          },
        },
      })
      const screenError = removeTypename(
        data?.notifyFormSystemExternalSystem?.screenError,
      )
      const successful =
        data?.notifyFormSystemExternalSystem?.operationSuccessful === true
      setOperationSuccessful(successful)
      setNotificationError(screenError)
      setHasValidateEligibilityNotificationError(
        successful && screenError?.hasError === true,
      )
      return successful && screenError?.hasError !== true
    } catch (error) {
      console.error('Error notifying external service:', error)
      setOperationSuccessful(false)
      setNotificationError({
        hasError: true,
        title: { [lang]: formatMessage(m.basicErrorMessage) },
      })
      setHasValidateEligibilityNotificationError(false)
      return false
    } finally {
      setIsValidateEligibilityNotificationLoading(false)
    }
  }

  const handleNewItem = () => {
    setNumberOfItems(numberOfItems + 1)
    dispatch({
      type: 'ADD_MULTISET_ITEM',
      payload: {},
    })
  }

  const handleRemoveItem = () => {
    if (numberOfItems > 1) {
      setNumberOfItems(numberOfItems - 1)
      dispatch({
        type: 'REMOVE_MULTISET_ITEM',
        payload: {},
      })
    }
  }

  const renderMultisetField = (
    field: FormSystemField,
    fieldIndex: number,
    itemIndex: number,
  ) => {
    const showRowGutter =
      isMulti && field.isPartOfMultiset !== false && numberOfItems > 1
    return (
      <Box
        key={`${field.id}-${itemIndex}`}
        display="flex"
        alignItems="flexStart"
      >
        {showRowGutter && (
          <Box
            marginRight={2}
            flexShrink={0}
            marginTop={4}
            style={{ width: '2ch' }}
            display="flex"
            justifyContent="flexEnd"
          >
            {fieldIndex === 0 && <Text variant="h4">{itemIndex + 1}.</Text>}
          </Box>
        )}
        <Box flexGrow={1} marginLeft={showRowGutter ? 2 : 0}>
          <Field field={field} valueIndex={itemIndex} />
        </Box>
      </Box>
    )
  }

  const multiSetControls = displayMultiButtons && (
    <Box
      display="flex"
      justifyContent="flexEnd"
      marginTop={numberOfItems === 1 ? 3 : 0}
    >
      <Box marginRight={2}>
        {numberOfItems > 1 && (
          <Button
            variant="ghost"
            colorScheme="destructive"
            type="button"
            onClick={handleRemoveItem}
          >
            {formatMessage(m.removeMulti)}
          </Button>
        )}
      </Box>
      <Button
        variant="ghost"
        type="button"
        onClick={handleNewItem}
        icon="add"
        disabled={numberOfItems >= multiMax}
      >
        {formatMessage(m.addMulti)}
      </Button>
    </Box>
  )

  const multiSetContent = currentScreen ? (
    <Box>
      {orderedFields.map((field, fieldIndex) => (
        <Fragment key={field.id}>
          {renderMultisetField(field, multisetFields.indexOf(field), 0)}
          {fieldIndex === lastMultisetFieldIndex && (
            <>
              {Array.from({ length: numberOfItems - 1 }).map((_, index) => (
                <Box key={`multiset-item-${index + 1}`} marginBottom={3}>
                  {multisetFields.map((repeatedField, repeatedIndex) =>
                    renderMultisetField(
                      repeatedField,
                      repeatedIndex,
                      index + 1,
                    ),
                  )}
                </Box>
              ))}
              {multiSetControls}
            </>
          )}
        </Fragment>
      ))}
    </Box>
  ) : null

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <GridColumn
        span={['12/12', '12/12', '10/12', '7/9']}
        offset={['0', '0', '1/12', '1/9']}
      >
        {state.screenError && state.screenError.hasError && (
          <Box marginBottom={[4, 4, 5]}>
            <AlertMessage
              type="error"
              title={state.screenError.title?.[lang]}
              message={
                <Text variant="small" whiteSpace="breakSpaces">
                  {state.screenError.message?.[lang]}
                </Text>
              }
            />
          </Box>
        )}

        <Text variant="h2" as="h2" marginBottom={1}>
          {currentSectionType !== SectionTypes.PREMISES &&
            currentSectionType !== SectionTypes.PARTIES &&
            screenTitle}
        </Text>

        {currentSectionType === SectionTypes.PREMISES && (
          <ExternalData
            disabled={hasValidateEligibilityError}
            notificationError={notificationError}
            operationSuccessful={operationSuccessful}
            setExternalDataAgreement={setExternalDataAgreement}
          />
        )}

        {currentSectionType === SectionTypes.PARTIES && (
          <Applicants
            applicantField={currentScreen?.data?.fields?.[0] as FormSystemField}
          />
        )}

        {currentSectionType === SectionTypes.SUMMARY &&
          !!state.application.hasSummaryScreen &&
          !state.submitted &&
          !currentSection?.data?.isHidden && <Summary state={state} />}

        {(currentSectionType === SectionTypes.COMPLETED || state.submitted) && (
          <Completed />
        )}
        {currentSectionType === SectionTypes.PAYMENT && !state.submitted && (
          <Payment />
        )}
        {multiSetContent}
      </GridColumn>

      <Footer
        externalDataAgreement={externalDataAgreement}
        isValidateEligibilityError={hasValidateEligibilityError}
        onConfirmPremises={confirmPremises}
      />
    </Box>
  )
}
