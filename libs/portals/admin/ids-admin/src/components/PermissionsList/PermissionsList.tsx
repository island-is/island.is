import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

function PermissionsList() {
  const { formatMessage } = useLocale()
  const isEmpty = true

  const createButton = () => {
    return <Button size="small">Create permission</Button>
  }

  const emptyState = () => {
    return (
      <Box
        borderRadius="large"
        borderColor="blue200"
        borderWidth="standard"
        display="flex"
        flexDirection="column"
        alignItems="center"
        rowGap={2}
        paddingY={8}
        paddingX={8}
      >
        <Text as="h2" variant="h3">
          No permission created
        </Text>
        <Text marginBottom={3}>
          Lorem ipsum dolor sit amet consectetur. A non ut nulla vitae mauris
          accumsan at tellus facilisi.
        </Text>

        {createButton()}
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" columnGap={5} marginBottom={5}>
        <Box display="flex" flexDirection="column" rowGap={2}>
          <Text as="h1" variant="h2">
            {formatMessage(m.permissions)}
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur. A non ut nulla vitae mauris
            accumsan at tellus facilisi.
          </Text>
        </Box>
        {isEmpty ? null : (
          <Box display="flex" alignItems="center">
            {createButton()}
          </Box>
        )}
      </Box>

      {isEmpty ? emptyState() : null}
    </Box>
  )
}

export default PermissionsList
