import { FormSystemField, FormSystemScreen } from '@island.is/api/schema'
import {
  Action,
  ApplicationState,
  FieldTypesEnum,
  m,
} from '@island.is/form-system/ui'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Preview } from '../../Preview/Preview'

interface Props {
  screen: FormSystemScreen
  dispatch?: Dispatch<Action>
  state?: Pick<ApplicationState, 'currentScreen'>
}

export const MultiSet = ({ screen, dispatch, state }: Props) => {
  const { formatMessage } = useLocale()
  const { unregister } = useFormContext()
  const [numberOfItems, setNumberOfItems] = useState(() =>
    Math.max(
      1,
      ...(screen.fields ?? [])
        .filter(
          (field) =>
            field && !field.isHidden && field.isPartOfMultiset !== false,
        )
        .map((field) => field?.values?.length ?? 0),
    ),
  )
  const fields = (screen.fields ?? []).filter(
    (field): field is FormSystemField => !!field && !field.isHidden,
  )
  const currencySumField =
    numberOfItems > 1 &&
    fields.some(
      (field) =>
        field.fieldType === FieldTypesEnum.ISK_NUMBERBOX &&
        field.isPartOfMultiset !== false,
    )
      ? fields.find((field) => field.fieldType === FieldTypesEnum.ISK_SUMBOX)
      : undefined
  const repeatedFields = currencySumField
    ? fields.filter((field) => field.fieldType !== FieldTypesEnum.ISK_SUMBOX)
    : fields
  const anchorFieldIndex = repeatedFields.findIndex(
    (field) => field.isPartOfMultiset !== false,
  )

  return (
    <>
      <Box>
        {Array.from({ length: numberOfItems }).map((_, itemIndex) => (
          <Box key={itemIndex} marginBottom={3}>
            {repeatedFields
              .filter(
                (field) => field.isPartOfMultiset !== false || itemIndex === 0,
              )
              .map((field, fieldIndex) => {
                const isRepeatingField = field.isPartOfMultiset !== false
                const showRowGutter =
                  isRepeatingField &&
                  numberOfItems > 1 &&
                  (itemIndex !== 0 || fieldIndex >= anchorFieldIndex)
                const showLabel =
                  itemIndex === 0
                    ? fieldIndex === anchorFieldIndex
                    : fieldIndex === 0

                return (
                  <Box key={field.id} display="flex" alignItems="flexStart">
                    {showRowGutter && (
                      <Box
                        marginRight={2}
                        flexShrink={0}
                        marginTop={4}
                        style={{ width: '2ch' }}
                        display="flex"
                        justifyContent="flexEnd"
                      >
                        {showLabel && (
                          <Text variant="h4">{itemIndex + 1}.</Text>
                        )}
                      </Box>
                    )}
                    <Box flexGrow={1} marginLeft={showRowGutter ? 2 : 0}>
                      <Preview
                        data={field}
                        dispatch={dispatch}
                        state={state}
                        valueIndex={isRepeatingField ? itemIndex : 0}
                        screenOrSection
                      />
                    </Box>
                  </Box>
                )
              })}
          </Box>
        ))}
      </Box>
      {currencySumField && (
        <Box marginBottom={4}>
          <Preview
            data={currencySumField}
            dispatch={dispatch}
            state={state}
            screenOrSection
          />
        </Box>
      )}
      {anchorFieldIndex !== -1 && (
        <Box display="flex" justifyContent="flexEnd">
          <Box marginRight={2}>
            {numberOfItems > 1 && (
              <Button
                variant="ghost"
                colorScheme="destructive"
                type="button"
                onClick={() => {
                  if (numberOfItems <= 1) return
                  const valueIndex = numberOfItems - 1
                  screen.fields?.forEach((field) => {
                    if (field && field.isPartOfMultiset !== false) {
                      unregister(`${field.id}.${valueIndex}`)
                      dispatch?.({
                        type: 'REMOVE_MULTISET_ITEM',
                        payload: { id: field.id, valueIndex },
                      })
                    }
                  })
                  setNumberOfItems(valueIndex)
                }}
              >
                {formatMessage(m.removeMulti)}
              </Button>
            )}
          </Box>
          <Button
            variant="ghost"
            type="button"
            icon="add"
            disabled={numberOfItems >= (screen.multiMax ?? 1)}
            onClick={() => setNumberOfItems(numberOfItems + 1)}
          >
            {formatMessage(m.addMulti)}
          </Button>
        </Box>
      )}
    </>
  )
}
