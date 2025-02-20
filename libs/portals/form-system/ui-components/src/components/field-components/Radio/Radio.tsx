import { FormSystemField, FormSystemListItem } from '@island.is/api/schema'
import { RadioButton, Text, Box } from '@island.is/island-ui/core'
import { Dispatch, useEffect, useState } from 'react'
import { getValue } from '../../../lib/getValue'
import { Action } from '../../../lib'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const Radio = ({ item, dispatch }: Props) => {
  const radioButtons = item.list as FormSystemListItem[]
  const [value, setValue] = useState<string>(getValue(item, 'listValue'))
  const [radioChecked, setRadioChecked] = useState<boolean[]>([])

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
        label={rb?.label?.is}
        tooltip={
          rb?.description?.is && rb?.description?.is !== ''
            ? rb?.description?.is
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
      <div>
        <Text variant="h3">{item?.name?.is}</Text>
      </div>
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
