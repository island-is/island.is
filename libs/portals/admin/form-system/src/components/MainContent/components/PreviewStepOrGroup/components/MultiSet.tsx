import { useContext, useState } from 'react'
import { Box, Icon } from '@island.is/island-ui/core'
import { FormSystemGroup, FormSystemInput } from '@island.is/api/schema'
import { ControlContext } from '../../../../../context/ControlContext'
import { Preview } from '../../Preview/Preveiw'

interface Props {
  group: FormSystemGroup
}

export const MultiSet = ({ group }: Props) => {
  const { control } = useContext(ControlContext)
  const { inputsList: inputs } = control.form
  const originalInput = inputs?.filter((i) => i?.groupGuid === group.guid)
  const [multiInput, setMultiInput] = useState<FormSystemInput[][]>([
    (inputs?.filter((i) => i?.groupGuid === group.guid) ||
      []) as FormSystemInput[],
  ])
  const add = () => {
    if (originalInput) {
      setMultiInput((prev) => [...prev, originalInput as FormSystemInput[]])
    }
  }
  return (
    <div>
      {multiInput.map((inputArray, index) => (
        <div key={index}>
          {inputArray.map((i) => (
            <Preview key={i.guid} data={i} />
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
