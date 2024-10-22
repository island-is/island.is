import { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'

interface ReviewGroupProps {
  handleClick?: () => void
}

export const AddEmployee: FC<React.PropsWithChildren<ReviewGroupProps>> = ({
  handleClick,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Text variant="h5" marginBottom={2}>
        {formatMessage(overview.labels.addEmployeeDescription)}
      </Text>
      <Button variant="ghost" icon="add" fluid onClick={handleClick}>
        {formatMessage(overview.labels.addEmployeeButton)}
      </Button>
    </Box>
  )
}
