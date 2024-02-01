import { RadioButton, Text, Box } from '@island.is/island-ui/core'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { useContext, useEffect, useState } from 'react'
import { IInput } from '../../../../../types/interfaces'

export default function Radio() {
  const { lists } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const currentItem = activeItem.data as IInput
  const radioButtons = currentItem.inputSettings.listi
  const [radioChecked, setRadioChecked] = useState<boolean[]>([])

  useEffect(() => {
    setRadioChecked(radioButtons.map(() => false))
  }, [radioButtons])

  const radioButton = (rb, index) => (
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
        label={rb.label.is}
        tooltip={
          rb.description.is && rb.description.is !== ''
            ? rb.description.is
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
      <Box>
        <Text variant="h3">{currentItem.name.is}</Text>
      </Box>
      <Box
        marginTop={2}
        marginBottom={2}
        display="flex"
        flexDirection={'row'}
        flexWrap={'wrap'}
      >
        {radioButtons.map((rb, index) => radioButton(rb, index))}
      </Box>
    </>
  )
}
