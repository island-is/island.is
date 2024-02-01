import { useContext, useEffect, useState } from 'react'
import { Box, Icon } from '@island.is/island-ui/core'
import Preview from '../../Preview/Preview'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import { IGroup, IInput } from '../../../../../types/interfaces'

interface Props {
  group: IGroup
}
export default function MultiSet({ group }: Props) {
  const [multiInput, setMultiInput] = useState<IInput[][]>([])
  const { lists } = useContext(FormBuilderContext)
  const { inputs } = lists
  const originalInput = inputs.filter((i) => i.groupGuid === group.guid)
  console.log('inMultiSet')
  useEffect(() => {
    setMultiInput([originalInput])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      {multiInput.map((inputArray, index) => (
        <div key={index}>
          {inputArray.map((i) => (
            <Preview
              key={i.guid}
              data={i}
              isLarge={false}
              inputSettings={i.inputSettings}
            />
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
    </Box>
  )

  function add() {
    setMultiInput((prev) => [...prev, originalInput])
  }
}
