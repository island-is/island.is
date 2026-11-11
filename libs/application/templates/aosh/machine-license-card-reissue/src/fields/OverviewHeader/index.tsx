import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../../lib/messages'

export const OverviewHeader = (_props: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  return (
    <Box display="flex" justifyContent="spaceBetween" paddingBottom={5}>
      <Box>
        <Box marginBottom={2}>
          <Text variant="h2" as="h2">
            {formatMessage(overview.general.pageTitle)}
          </Text>
        </Box>
        <Text variant="default">
          {formatMessage(overview.general.description)}
        </Text>
      </Box>
      <Box>
        <Button
          variant="utility"
          icon="print"
          title={formatMessage(overview.general.print)}
          onClick={(e) => {
            e.preventDefault()
            window.print()
          }}
        />
      </Box>
    </Box>
  )
}

export default OverviewHeader
