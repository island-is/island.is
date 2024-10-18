import { FormSystemInput, FormSystemListItem } from '@island.is/api/schema'
import { RadioButton, Text, Box } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'

interface Props {
  currentItem: FormSystemInput
}

export const Radio = ({ currentItem }: Props) => {
  const radioButtons = currentItem.inputSettings?.list as FormSystemListItem[]
  const [radioChecked, setRadioChecked] = useState<boolean[]>([])

  useEffect(() => {
    setRadioChecked(radioButtons?.map(() => false) ?? [])
  }, [radioButtons])

  const radioButton = (rb: FormSystemListItem, index: number) => (
    <Box
      width="half"
      padding={1}
      onClick={() =>
        setRadioChecked((prev) =>
          prev.map((rb, i) => (i === index ? true : false)),
        )
      }
    >
      <RadioButton
        label={rb?.label?.is}
        tooltip={
          rb?.description?.is && rb?.description?.is !== ''
            ? rb?.description?.is
            : undefined
        }
        large
        backgroundColor="white"
        checked={radioChecked[index]}
      />
    </Box>
  )

  return (
    <>
      <div>
        <Text variant="h3">{currentItem?.name?.is}</Text>
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
