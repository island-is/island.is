import { ApplicationState, getState } from '@island.is/financial-aid/shared/lib'
import { Box, Text } from '@island.is/island-ui/core'
import React from 'react'
import { getTagByState } from '../../utils/formHelper'
import GeneratedProfile from '../Generator/GeneratedProfile'
import GenerateName from '../Generator/GenerateName'

const Name = (nationalId: string) => {
  return (
    <Box display="flex" alignItems="center">
      <GeneratedProfile size={32} nationalId={nationalId} />
      <Box marginLeft={2}>
        <Text variant="h5">{GenerateName(nationalId)}</Text>
      </Box>
    </Box>
  )
}

const State = (state: ApplicationState) => {
  return (
    <Box>
      <div className={`tags ${getTagByState(state)}`}>{getState[state]}</div>
    </Box>
  )
}

export { Name, State }
