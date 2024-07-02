import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { Routes } from '../../lib/constants'
import { UniversityApplication } from '../../lib/dataSchema'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route?: Routes
}

export const ProgramReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as UniversityApplication

  return (
    <Box paddingBottom={4} paddingTop={4}>
      <Box></Box>
      <GridRow>
        <GridColumn span="1/2">
          <Text>{answers?.programInformation.programName}</Text>
          <Text>{answers?.programInformation.universityName}</Text>
        </GridColumn>
        <GridColumn span="1/2"></GridColumn>
      </GridRow>
    </Box>
  )
}
