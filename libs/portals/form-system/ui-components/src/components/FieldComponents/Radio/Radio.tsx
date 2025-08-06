import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import {
  RadioButton,
  Text,
  Box,
  Inline,
  InputError,
} from '@island.is/island-ui/core'
import { Dispatch, useEffect, useState } from 'react'
import { getValue } from '../../../lib/getValue'
import { Action } from '../../../lib'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
  hasError?: boolean
}

export const Radio = ({ item, dispatch, lang = 'is', hasError }: Props) => {
  const radioButtons = item.list as FormSystemListItem[]
  const [value, setValue] = useState<string>(getValue(item, 'listValue'))
  const [radioChecked, setRadioChecked] = useState<boolean[]>([])
  const language = lang ?? 'is'
  const { formatMessage } = useIntl()

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
    <Box width="half" padding={1} onClick={() => handleChange(index)}>
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
        <Text variant="h3">{item?.name?.[language]}</Text>
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
