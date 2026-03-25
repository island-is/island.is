import { FormSystemField } from '@island.is/api/schema'
import { m, SectionTypes } from '@island.is/form-system/ui'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { Footer } from '../Footer/Footer'
import { Applicants } from './components/Applicants/Applicants'
import { Completed } from './components/Completed/Completed'
import { ExternalData } from './components/ExternalData/ExternalData'
import { Field } from './components/Field/Field'
import { Summary } from './components/Summary/Summary'
import {
  NotificationCommands,
  FieldTypesEnum,
} from '@island.is/form-system/enums'
import { useMutation } from '@apollo/client'
import {
  NOTIFY_EXTERNAL_SERVICE,
  removeTypename,
} from '@island.is/form-system/graphql'
import { LoadingScreen } from '@island.is/react/components'
import { useIntl } from 'react-intl'

export const Screen = () => {
  const { state, dispatch } = useApplicationContext()
  const { lang } = useLocale()
  const { currentSection, currentScreen } = state
  const { formatMessage } = useIntl()
  const [notifyExternal] = useMutation(NOTIFY_EXTERNAL_SERVICE)
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    if (isMulti && multiMax > 1) {
      const maxItems = Math.max(
        1,
        ...visibleFields.map((f) => (f.values?.length as number) ?? 1),
      )
      setNumberOfItems(maxItems)
    } else {
      setNumberOfItems(1)
    }
  }, [currentScreen?.data?.id, isMulti, multiMax, visibleFields])

  const shouldMoveCurrencySumBox =
    numberOfItems > 1 &&
    isMulti &&
    multiMax > 1 &&
    visibleFields.some(
      (f) =>
        f.fieldType === FieldTypesEnum.ISK_NUMBERBOX &&
        f.isPartOfMultiset !== false,
    )

  const currencySumField = shouldMoveCurrencySumBox
    ? visibleFields.find((f) => f.fieldType === FieldTypesEnum.ISK_SUMBOX)
    : undefined

  const fieldsForMultisetLoop =
    shouldMoveCurrencySumBox && currencySumField
      ? visibleFields.filter((f) => f.fieldType !== FieldTypesEnum.ISK_SUMBOX)
      : visibleFields

  const screenTitle =
    currentScreen?.data?.name?.[lang] ??
    (currentSection?.data?.sectionType === SectionTypes.COMPLETED
      ? null
      : state.sections?.[currentSection?.index]?.name?.[lang] ?? '')

  const currentSectionType = state.sections?.[currentSection.index]?.sectionType
  const [externalDataAgreement, setExternalDataAgreement] = useState(
    state.sections?.[0].isCompleted ?? false,
  )

  const anchorFieldIndex = useMemo(
    () => fieldsForMultisetLoop.findIndex((f) => f.isPartOfMultiset !== false),
    [fieldsForMultisetLoop],
  )

  const shouldPopulateScreen = async () => {
    if (
      currentScreen?.data?.shouldPopulate &&
      state.application.submissionServiceUrl !== 'zendesk'
    ) {
      try {
        setLoading(true)
        const { data } = await notifyExternal({
          variables: {
            input: {
              applicationId: state.application.id,
              nationalId: '',
              slug: state.application.slug,
              isTest: state.application.isTest,
              command: NotificationCommands.POPULATE,
              screen: state.currentScreen?.data,
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
            ...(updatedScreen?.screenError?.hasError && {
              isPopulateError: true,
            }),
          },
        })
      } catch (error) {
        console.error('Error populating fields:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const screenId = currentScreen?.data?.id

  const shouldPopulateScreenRef = useRef(shouldPopulateScreen)
  shouldPopulateScreenRef.current = shouldPopulateScreen

  useEffect(() => {
    const populateScreen = async () => {
      await shouldPopulateScreenRef.current()
    }
    void populateScreen()
  }, [screenId])

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

  if (loading) return <LoadingScreen ariaLabel="loading" />

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
          <ExternalData setExternalDataAgreement={setExternalDataAgreement} />
        )}

        {currentSectionType === SectionTypes.PARTIES && (
          <Applicants
            applicantField={currentScreen?.data?.fields?.[0] as FormSystemField}
          />
        )}

        {currentSectionType === SectionTypes.SUMMARY &&
          !!state.application.hasSummaryScreen &&
          !currentSection?.data?.isHidden && <Summary state={state} />}

        {currentSectionType === SectionTypes.COMPLETED && <Completed />}

        {currentScreen &&
          Array.from({ length: numberOfItems }).map((_, itemIndex) => (
            <Box key={`multiset-item-${itemIndex}`} marginBottom={3}>
              {fieldsForMultisetLoop
                .filter(
                  (field) =>
                    field.isPartOfMultiset !== false || itemIndex === 0,
                )
                .map((field, fieldIndex) => {
                  const key = `${field.id ?? 'field'}-${itemIndex}`
                  const valueIndex =
                    field.isPartOfMultiset === false ? 0 : itemIndex

                  const isRepeatingField = field.isPartOfMultiset === true

                  const showRowGutter =
                    isRepeatingField &&
                    numberOfItems > 1 &&
                    (itemIndex !== 0 ||
                      anchorFieldIndex === -1 ||
                      fieldIndex >= anchorFieldIndex)

                  let gutterLabel: string | null = null
                  if (isRepeatingField && numberOfItems > 1) {
                    if (itemIndex === 0) {
                      if (anchorFieldIndex === -1) {
                        if (fieldIndex === 0) gutterLabel = '1.'
                      } else {
                        if (fieldIndex === anchorFieldIndex) gutterLabel = '1.'
                      }
                    } else {
                      if (fieldIndex === 0) gutterLabel = `${itemIndex + 1}.`
                    }
                  }

                  return (
                    <Box key={key} display="flex" alignItems="flexStart">
                      {showRowGutter && (
                        <Box
                          marginRight={2}
                          flexShrink={0}
                          marginTop={4}
                          style={{ width: '2ch' }}
                          display="flex"
                          justifyContent="flexEnd"
                        >
                          {gutterLabel && (
                            <Text variant="h4">{gutterLabel}</Text>
                          )}
                        </Box>
                      )}

                      <Box flexGrow={1} marginLeft={showRowGutter ? 2 : 0}>
                        <Field field={field} valueIndex={valueIndex} />
                      </Box>
                    </Box>
                  )
                })}
            </Box>
          ))}

        {shouldMoveCurrencySumBox && currencySumField && (
          <Box marginBottom={4}>
            <Field
              field={currencySumField}
              valueIndex={0}
              key={`${currencySumField.id ?? 'currency-sum'}-sum`}
            />
          </Box>
        )}

        {isMulti && multiMax > 1 && (
          <Box display="flex" justifyContent="flexEnd">
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
        )}
      </GridColumn>

      <Footer externalDataAgreement={externalDataAgreement} />
    </Box>
  )
}
