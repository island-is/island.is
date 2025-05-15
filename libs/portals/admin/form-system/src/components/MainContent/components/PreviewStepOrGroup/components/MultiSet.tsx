import { useContext, useState } from 'react'
import { Box, Icon } from '@island.is/island-ui/core'
import { FormSystemScreen, FormSystemField } from '@island.is/api/schema'
import { ControlContext } from '../../../../../context/ControlContext'
import { Preview } from '../../Preview/Preview'

interface Props {
  screen: FormSystemScreen
}

export const MultiSet = ({ screen }: Props) => {
  const { control } = useContext(ControlContext)
  const { fields } = control.form
  const originalInput = fields?.filter((f) => f?.screenId === screen.id)
  const [multiInput, setMultiInput] = useState<FormSystemField[][]>([
    (fields?.filter((i) => i?.screenId === screen.id) ||
      []) as FormSystemField[],
  ])
  const add = () => {
    if (originalInput) {
      setMultiInput((prev) => [...prev, originalInput as FormSystemField[]])
    }
  }
  return (
    <div>
      {multiInput.map((inputArray, index) => (
        <div key={index}>
          {inputArray.map((i) => (
            <Preview key={i.id} data={i} />
          ))}
        </div>
      ))}
      <Box
        marginTop={2}
        marginBottom={2}
        display="flex"
        justifyContent="center"
      >
        <Box
          width="half"
          style={{ width: '50%', height: '50px', cursor: 'pointer' }}
          cursor="pointer"
          border="standard"
          borderRadius="standard"
          borderWidth="large"
          background="white"
          display="flex"
          justifyContent="center"
          alignItems="center"
          onClick={add}
        >
          <Icon icon="add" />
        </Box>
      </Box>
    </div>
  )
}
