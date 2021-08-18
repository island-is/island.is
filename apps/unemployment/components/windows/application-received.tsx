import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { ApplicationData } from './../../entities/application-data'


interface PropTypes {
    defaultValues: ApplicationData
  }

  const ApplicationReceived: React.FC<PropTypes> = ({
    defaultValues,
  }: PropTypes) => {

    return <Box><Text>Umsókn hefur verið móttekin</Text></Box>
}

export default ApplicationReceived