import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import {
  Box,
  Inline,
  InputError,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect, useState } from 'react'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
}

export const Radio = ({ item, dispatch, hasError }: Props) => {
  const radioButtons = item.list as FormSystemListItem[]
  const [value, setValue] = useState<string>(getValue(item, 'listValue'))
  const [radioChecked, setRadioChecked] = useState<boolean[]>([])
  const { formatMessage, lang } = useLocale()

  useEffect(() => {
    setRadioChecked(
      radioButtons?.map((rb) => (rb.label?.is === value ? true : false)) ?? [],
    )
  }, [radioButtons, value])

  const handleChange = (index: number) => {
    setRadioChecked((prev) => prev.map((rb, i) => (i === index ? true : false)))
    if (!dispatch) return
    dispatch({
      type: 'SET_LIST_VALUE',
      payload: {
        id: item.id,
        value: radioButtons[index].label?.is,
      },
    })
    setValue(radioButtons[index].label?.is ?? '')
  }

  const radioButton = (rb: FormSystemListItem, index: number) => (
    <Box
      width="half"
      padding={1}
      onClick={() => handleChange(index)}
      key={rb.id}
    >
      <RadioButton
        label={rb?.label?.[lang]}
        tooltip={
          rb?.description?.is && rb?.description?.[lang] !== ''
            ? rb?.description?.[lang]
            : undefined
        }
        large
        backgroundColor="blue"
        checked={radioChecked[index]}
        onChange={() => handleChange(index)}
      />
    </Box>
  )

  const selected = item?.list?.find((listItem) => listItem?.isSelected === true)

  useEffect(() => {
    if (selected && dispatch) {
      if (!value) {
        dispatch({
          type: 'SET_LIST_VALUE',
          payload: { id: item.id, value: selected.label?.[lang] ?? '' },
        })
        setValue(selected.label?.[lang] ?? '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Inline space={1}>
        <Text variant="h3">{item?.name?.[lang]}</Text>
        {item?.isRequired && (
          <Text variant="h3" as="span" color="red600">
            {' '}
            *
          </Text>
        )}
      </Inline>
      {hasError && (
        <InputError errorMessage={formatMessage(m.basicErrorMessage)} />
      )}
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
