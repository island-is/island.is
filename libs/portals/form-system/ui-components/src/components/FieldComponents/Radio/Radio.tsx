import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import { RadioButton, Text, Box, Inline, InputError } from '@island.is/island-ui/core'
import { Dispatch, useEffect, useState } from 'react'
import { getValue } from '../../../lib/getValue'
import { Action } from '../../../lib'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
  hasError?: boolean
}

export const Radio = ({ item, dispatch, lang, hasError }: Props) => {
  const radioButtons = item.list as FormSystemListItem[]
  const [value, setValue] = useState<string>(getValue(item, 'listValue'))
  const [radioChecked, setRadioChecked] = useState<boolean[]>([])
  const language = lang ?? 'is'

  useEffect(() => {
    setRadioChecked(radioButtons?.map((rb) => rb.label?.is === value ? true : false) ?? [])
  }, [radioButtons])

  const handleChange = (index: number) => {
    setRadioChecked((prev) =>
      prev.map((rb, i) => (i === index ? true : false)),
    )
    if (!dispatch) return
    dispatch({
      type: 'SET_LIST_VALUE',
      payload: {
        id: item.id,
        value: radioButtons[index].label?.is,
      }
    })
  }

  const radioButton = (rb: FormSystemListItem, index: number) => (
    <Box
      width="half"
      padding={1}
      onClick={(e) => handleChange(index)}
    >
      <RadioButton
        label={rb?.label?.[language]}
        tooltip={
          rb?.description?.is && rb?.description?.[language] !== ''
            ? rb?.description?.[language]
            : undefined
        }
        large
        backgroundColor="blue"
        checked={radioChecked[index]}
      />
    </Box>
  )

  return (
    <>
      <Inline space={1}>
        <Text variant="h3">{item?.name?.[language]}</Text>
        {item?.isRequired && (
          <Text variant="h3" as="span" color="red600">
            {' '}
            *
          </Text>
        )}
      </Inline>
      {hasError && <InputError errorMessage="error" />}
      <Box
        marginTop={2}
        marginBottom={2}
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
      >
        {radioButtons?.map((rb, index) => radioButton(rb, index))}
      </Box>
    </>
  )
}
