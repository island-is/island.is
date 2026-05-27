import { useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { UPDATE_APPLICATION_SETTINGS } from '@island.is/form-system/graphql'
import {
  ApplicationState,
  FieldTypesEnum,
  m,
  SectionTypes,
} from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useIntl } from 'react-intl'
import { useApplicationContext } from '../../../../context/ApplicationProvider'
import { Display } from '../Display/Display'
import { Payment } from '../Payment/Payment'
import { useEffect, useMemo } from 'react'

interface Props {
  state?: ApplicationState
}

export const Summary = ({ state }: Props) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()
  const { dispatch } = useApplicationContext()

  const isBlank = (value: unknown) =>
    value == null || (typeof value === 'string' && value.trim() === '')

  const getJson = (field: FormSystemField, valueIndex: number) =>
    (field?.values?.[valueIndex]?.json ?? {}) as Record<string, unknown>

  // Required-only validation for Summary display: checks presence, not format.
  const isMissingRequired = (field: FormSystemField, valueIndex: number) => {
    if (!field?.isRequired) return false

    const json = getJson(field, valueIndex)

    switch (field.fieldType) {
      case FieldTypesEnum.TEXTBOX:
        return isBlank((json as any).text)
      case FieldTypesEnum.EMAIL:
        return isBlank((json as any).email)
      case FieldTypesEnum.PHONE_NUMBER:
        return isBlank((json as any).phoneNumber)
      case FieldTypesEnum.NUMBERBOX:
      case FieldTypesEnum.PAYMENT_QUANTITY:
        return (json as any).number == null || (json as any).number === ''
      case FieldTypesEnum.ISK_NUMBERBOX:
        return isBlank((json as any).iskNumber)
      case FieldTypesEnum.DATE_PICKER:
        return isBlank((json as any).date)
      case FieldTypesEnum.TIME_INPUT:
        return isBlank((json as any).time)
      case FieldTypesEnum.CHECKBOX:
        return (json as any).checkboxValue !== true
      case FieldTypesEnum.DROPDOWN_LIST:
      case FieldTypesEnum.RADIO_BUTTONS: {
        const label = (json as any).label
        return isBlank(label?.is) && isBlank(label?.en)
      }
      case FieldTypesEnum.FILE: {
        const s3Key = (json as any).s3Key
        if (Array.isArray(s3Key)) return s3Key.length === 0
        return isBlank(s3Key)
      }
      case FieldTypesEnum.BANK_ACCOUNT: {
        const bankAccount = String((json as any).bankAccount ?? '')
        if (isBlank(bankAccount)) return true
        const [bank, ledger, account] = bankAccount.split('-')
        return isBlank(bank) || isBlank(ledger) || isBlank(account)
      }
      case FieldTypesEnum.NATIONAL_ID:
        return isBlank((json as any).nationalId) || isBlank((json as any).name)
      case FieldTypesEnum.PROPERTY_NUMBER:
        return isBlank((json as any).propertyNumber)
      default:
        return false
    }
  }

  const hasAnyMissingRequired = useMemo(() => {
    if (!state?.sections) return false

    for (const section of state.sections) {
      if (!section || section.isHidden) continue
      if (section.sectionType === SectionTypes.COMPLETED) continue

      for (const screen of section.screens ?? []) {
        if (!screen || screen.isHidden) continue

        for (const field of screen.fields ?? []) {
          if (!field || field.isHidden) continue
          if (field.fieldType === FieldTypesEnum.MESSAGE) continue
          if (!field.isRequired) continue

          const valueCount =
            field.isPartOfMultiset === false
              ? 1
              : Math.max(1, field.values?.length ?? 0)

          for (let valueIndex = 0; valueIndex < valueCount; valueIndex++) {
            if (isMissingRequired(field, valueIndex)) return true
          }
        }
      }
    }

    return false
  }, [state?.sections])

  useEffect(() => {
    // make state.isValid mean “no required missing”
    dispatch({
      type: 'SET_VALIDITY',
      payload: { isValid: !hasAnyMissingRequired },
    })
  }, [dispatch, hasAnyMissingRequired])

  const hasPayment = state?.application.hasPayment
  const paymentSection = state?.sections?.find(
    (s) => s.sectionType === SectionTypes.PAYMENT,
  )
  const paymentScreens = Array.isArray(paymentSection?.screens)
    ? paymentSection.screens.filter(
        (s): s is NonNullable<typeof s> => s != null,
      )
    : []
  const paymentFields = (paymentScreens[0]?.fields ?? [])
    .filter((f) => f != null && !f.isHidden)
    .filter(
      (field): field is NonNullable<typeof field> =>
        field != null && !field.isHidden,
    )

  const displayPayment =
    hasPayment && paymentFields != null && paymentFields.length > 0

  const updateCompleted = useMutation(UPDATE_APPLICATION_SETTINGS)

  const handleButtonClick = (sectionIndex?: number, screenIndex?: number) => {
    dispatch({
      type: 'INDEX_SCREEN',
      payload: {
        screenIndex: screenIndex,
        sectionIndex: sectionIndex,
        updateCompleted,
      },
    })
  }

  const sections = state?.sections?.filter(
    (s) =>
      !s?.isHidden &&
      s.sectionType !== SectionTypes.PAYMENT &&
      s.sectionType !== SectionTypes.COMPLETED &&
      s.sectionType !== SectionTypes.SUMMARY,
  )

  return (
    <Box marginTop={2}>
      <Text fontWeight="light" as="p">
        {formatMessage(m.reviewApplication)}
      </Text>

      {sections?.map((section, sectionIndex) =>
        section?.screens
          ?.filter((scr) => !scr?.isHidden)
          .map((screen, screenIndex) => {
            const visibleFields =
              screen?.fields?.filter(
                (field): field is NonNullable<typeof field> =>
                  field != null &&
                  !field.isHidden &&
                  field.fieldType !== FieldTypesEnum.MESSAGE,
              ) ?? []

            // Render only once, outside of any multiset grouping
            const nonMultisetFields = visibleFields.filter(
              (f) => f.isPartOfMultiset === false,
            )

            // Grouped by value index: all values[0] across fields, then values[1], ...
            const multisetFields = visibleFields.filter(
              (f) => f.isPartOfMultiset !== false,
            )

            const numberOfItems = Math.max(
              1,
              ...multisetFields.map((f) => f.values?.length ?? 0),
            )

            return (
              <Box
                key={screen?.id ?? `screen-${sectionIndex}-${screenIndex}`}
                marginTop={2}
              >
                <Divider />
                <GridContainer>
                  <GridRow>
                    <GridColumn span={['12/12', '10/12']}>
                      <Box marginTop={2}>
                        {section.sectionType === SectionTypes.PARTIES ? (
                          <Text as="h3" variant="h3" fontWeight="semiBold">
                            {screen?.fields?.[0]?.name?.[lang] ??
                              screen?.name?.[lang]}
                          </Text>
                        ) : (
                          <Text as="h3" variant="h3" fontWeight="semiBold">
                            {screen?.name?.[lang] ?? ''}
                          </Text>
                        )}
                      </Box>

                      <Box
                        display={['flex', 'none']}
                        marginTop={2}
                        marginBottom={2}
                        justifyContent={'flexStart'}
                      >
                        <Button
                          icon="pencil"
                          iconType="filled"
                          variant="utility"
                          inline={true}
                          onClick={() => {
                            handleButtonClick(
                              sectionIndex ?? -1,
                              section.sectionType === SectionTypes.PARTIES
                                ? screen?.displayOrder ?? -1
                                : screenIndex ?? -1,
                            )
                          }}
                        >
                          {formatMessage(m.edit)}
                        </Button>
                      </Box>

                      <Box>
                        {nonMultisetFields.map((field, index) => (
                          <Box
                            key={field.id ?? `non-multi-${index}`}
                            marginBottom={1}
                          >
                            <Display field={field} />
                            {isMissingRequired(field, 0) && (
                              <Box marginLeft={2} marginTop={1}>
                                <Text variant="small">
                                  {formatMessage(m.required)}
                                </Text>
                              </Box>
                            )}
                          </Box>
                        ))}

                        {Array.from({ length: numberOfItems }).map(
                          (_, itemIndex) => (
                            <Box
                              key={`multiset-group-${
                                screen?.id ?? `screen-${sectionIndex}`
                              }-${itemIndex}`}
                            >
                              {numberOfItems > 1 && (
                                <Text
                                  as="p"
                                  fontWeight="semiBold"
                                  lineHeight="xs"
                                >{`${itemIndex + 1}.`}</Text>
                              )}

                              {multisetFields
                                .filter((field) => field.values?.[itemIndex])
                                .map((field) => {
                                  const key = `${
                                    field.id ?? 'field'
                                  }-${itemIndex}`

                                  const content = (
                                    <>
                                      <Display
                                        field={field}
                                        valueIndex={itemIndex}
                                      />
                                      {isMissingRequired(field, itemIndex) && (
                                        <Box marginLeft={2} marginTop={1}>
                                          <Text variant="small">
                                            {formatMessage(m.required)}
                                          </Text>
                                        </Box>
                                      )}
                                    </>
                                  )

                                  return numberOfItems > 1 ? (
                                    <Box marginLeft={2} key={key}>
                                      {content}
                                    </Box>
                                  ) : (
                                    <Box key={key}>{content}</Box>
                                  )
                                })}
                            </Box>
                          ),
                        )}
                      </Box>
                    </GridColumn>

                    <GridColumn span={['12/12', '2/12']}>
                      <Box
                        display={['none', 'flex']}
                        marginTop={4}
                        justifyContent={'flexEnd'}
                      >
                        <Button
                          icon="pencil"
                          iconType="filled"
                          variant="utility"
                          inline={true}
                          onClick={() => {
                            handleButtonClick(
                              sectionIndex ?? -1,
                              section.sectionType === SectionTypes.PARTIES
                                ? screen?.displayOrder ?? -1
                                : screenIndex ?? -1,
                            )
                          }}
                        >
                          {formatMessage(m.edit)}
                        </Button>
                      </Box>
                    </GridColumn>
                  </GridRow>
                </GridContainer>
              </Box>
            )
          }),
      )}
      {displayPayment && <Payment />}
    </Box>
  )
}
