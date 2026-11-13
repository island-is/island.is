import { FormSystemField, FormSystemScreen } from '@island.is/api/schema'
import { Action, ApplicationState, m } from '@island.is/form-system/ui'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, Fragment, useState } from 'react'
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
  const repeatedFields = fields.filter(
    (field) => field.isPartOfMultiset !== false,
  )
  const firstMultisetFieldIndex = fields.findIndex(
    (field) => field.isPartOfMultiset !== false,
  )
  const orderedFields =
    firstMultisetFieldIndex === -1
      ? fields
      : [
          ...fields.slice(0, firstMultisetFieldIndex),
          ...repeatedFields,
          ...fields
            .slice(firstMultisetFieldIndex)
            .filter((field) => field.isPartOfMultiset === false),
        ]
  const lastMultisetFieldIndex =
    firstMultisetFieldIndex === -1
      ? -1
      : firstMultisetFieldIndex + repeatedFields.length - 1

  const renderPreviewField = (
    field: FormSystemField,
    fieldIndex: number,
    itemIndex: number,
  ) => {
    const showRowGutter = field.isPartOfMultiset !== false && numberOfItems > 1
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
          <Preview
            data={field}
            dispatch={dispatch}
            state={state}
            valueIndex={itemIndex}
            screenOrSection
          />
        </Box>
      </Box>
    )
  }

  const multiSetControls = repeatedFields.length > 0 && (
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
  )

  return (
    <Box>
      {orderedFields.map((field, fieldIndex) => (
        <Fragment key={field.id}>
          {renderPreviewField(field, repeatedFields.indexOf(field), 0)}
          {fieldIndex === lastMultisetFieldIndex && (
            <>
              {Array.from({ length: numberOfItems - 1 }).map((_, index) => (
                <Box key={index + 1} marginBottom={3}>
                  {repeatedFields.map((repeatedField, repeatedIndex) =>
                    renderPreviewField(repeatedField, repeatedIndex, index + 1),
                  )}
                </Box>
              ))}
              {multiSetControls}
            </>
          )}
        </Fragment>
      ))}
    </Box>
  )
}
