import { Box, Button, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfMessageWithLinkButtonField = ({
  component,
}: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)}>
    <Box
      borderRadius="standard"
      padding={4}
      background="blue100"
      display={['block', 'block', 'flex']}
      alignItems="center"
      justifyContent="spaceBetween"
      flexDirection={['column', 'column', 'row']}
      marginY={2}
    >
      <Box paddingRight={[0, 0, 4]}>
        <Text variant="small">{component.message}</Text>
      </Box>
      <Box marginTop={[3, 3, 0]} marginLeft={[0, 0, 3]}>
        <Button
          onClick={() => {
            window.open(component.url ?? '#', '_blank')
          }}
          size="small"
          icon="arrowForward"
          nowrap
        >
          {component.buttonTitle}
        </Button>
      </Box>
    </Box>
  </Box>
)
