import React, { FC } from 'react'
import {
  Box,
  Columns,
  Column,
  Typography,
  Button,
} from '@island.is/island-ui/core'

interface Props {
  label: string
  content?: string
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const UserInfoLine: FC<Props> = ({ label, content, onEdit }) => {
  return (
    <Box paddingY={2} paddingX={3} border="standard" borderRadius="large">
      <Columns space={1} collapseBelow="sm" alignY="center">
        <Column width="5/12">
          <Box overflow="hidden">
            <Typography variant="h5">{label}</Typography>
          </Box>
        </Column>
        <Column width="4/12">
          <Box overflow="hidden">{content}</Box>
        </Column>
        {onEdit && (
          <Column width="3/12">
            <Box overflow="hidden" textAlign="right">
              <Button
                variant="text"
                size="small"
                icon="external"
                onClick={onEdit}
              >
                Breyta
              </Button>
            </Box>
          </Column>
        )}
      </Columns>
    </Box>
  )
}

export default UserInfoLine
