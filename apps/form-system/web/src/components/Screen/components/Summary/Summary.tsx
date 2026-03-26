import { useMutation } from '@apollo/client'
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

interface Props {
  state?: ApplicationState
}

export const Summary = ({ state }: Props) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()
  const { dispatch } = useApplicationContext()
  const hasPayment = state?.application.hasPayment
  const paymentFields = state?.sections
    ?.find((s) => s.sectionType === SectionTypes.PAYMENT)
    ?.screens?.[0]?.fields?.filter((f) => !f?.isHidden)
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
                          <Display
                            field={field}
                            key={field.id ?? `non-multi-${index}`}
                          />
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

                                  return numberOfItems > 1 ? (
                                    <Box marginLeft={2} key={key}>
                                      <Display
                                        field={field}
                                        valueIndex={itemIndex}
                                      />
                                    </Box>
                                  ) : (
                                    <Display
                                      field={field}
                                      valueIndex={itemIndex}
                                      key={key}
                                    />
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
