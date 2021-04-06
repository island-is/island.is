import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const Applicant: FC<Props> = () => {
  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h5">{'Listabókstafur'}</Text>
        <Text>{'B'}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">{'Heiti stjórnmálaflokks'}</Text>
        <Text>{'Framsóknarflokkur'}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h5">{'Ábyrgðarmaður'}</Text>
        <Text>{'Örvar Þór Sigurðsson'}</Text>
      </Box>
    </>
  )
}

export default Applicant
