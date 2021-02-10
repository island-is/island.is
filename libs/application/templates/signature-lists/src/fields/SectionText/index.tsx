import React, { FC } from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { Application } from '@island.is/application/core'

interface SectionTextProps {
  application: Application
}

const SectionText: FC<SectionTextProps> = ({ application }) => {
  console.log(application)
  return (
    <Box marginTop={7}>
      <Text variant={'h5'}>{'Staðfestingarkóði sendur á netfang þitt'}</Text>
    </Box>
  )
}

export default SectionText
