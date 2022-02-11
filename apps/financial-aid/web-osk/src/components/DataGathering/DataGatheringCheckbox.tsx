import React from 'react'
import { Text, Box, Checkbox } from '@island.is/island-ui/core'

interface Props {
  accept: boolean
  setHasError: (value: React.SetStateAction<boolean>) => void
  setAccept: (value: React.SetStateAction<boolean>) => void
  hasError: boolean
  error: boolean
}

const DataGatheringCheckbox = ({
  accept,
  setHasError,
  setAccept,
  hasError,
  error,
}: Props) => {
  return (
    <Box marginBottom={[5, 5, 10]} cursor="pointer">
      <Checkbox
        name={'accept'}
        backgroundColor="blue"
        label="Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu"
        large
        checked={accept}
        onChange={(event) => {
          setHasError(false)

          setAccept(event.target.checked)
        }}
        hasError={hasError}
        errorMessage={'Þú þarft að samþykkja gagnaöflun'}
      />

      {error && (
        <Text color="red600" fontWeight="semiBold" variant="small">
          Eitthvað fór úrskeiðis, vinsamlegast reynið aftur síðar
        </Text>
      )}
    </Box>
  )
}

export default DataGatheringCheckbox
