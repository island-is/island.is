import React, { useEffect, useContext } from 'react'
import { Input, Checkbox, Box } from '@island.is/island-ui/core'

interface Props {}

const SpouseInfo = ({}: Props) => {
  return (
    <>
      <Box marginBottom={[2, 2, 3]}>
        <Input
          label="Kennitala maka"
          name="nationalIdSpouse"
          placeholder="Sláðu inn kennitölu maka"
          backgroundColor="blue"
        />
      </Box>
      <Box marginBottom={[2, 2, 3]}>
        <Input
          label="Netfang maka"
          name="Test1"
          placeholder="Sláðu inn netfang maka"
          backgroundColor="blue"
        />
      </Box>
      <Box cursor="pointer">
        <Checkbox
          name={'accept'}
          backgroundColor="blue"
          label="Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu"
          large
          onChange={(event) => {}}
          hasError={false}
          errorMessage={'Þú þarft að samþykkja gagnaöflun'}
        />
      </Box>
    </>
  )
}

export default SpouseInfo
