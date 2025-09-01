import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'

import { BaseProps } from './InfoCard'

const eyebrowColor = 'blueberry600'

export const SimpleInfoCard = ({
  title,
  description,
  size = 'medium',
  eyebrow,
}: BaseProps) => {
  const renderHeader = () => {
    if (!eyebrow) {
      return
    }
    return (
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginBottom={3}
        role="heading"
      >
        <Text variant="eyebrow" color={eyebrowColor}>
          {eyebrow}
        </Text>
      </Box>
    )
  }

  const renderContent = () => {
    if (size === 'large') {
      return (
        <GridRow direction="row">
          <GridColumn span="12/12">
            <Text variant="h3" color="blue400">
              {title}
            </Text>
            {description && (
              <Box flexGrow={1} marginTop={1}>
                <Text>{description}</Text>
              </Box>
            )}
          </GridColumn>
        </GridRow>
      )
    }
    return (
      <>
        <Text variant="h3" color="blue400">
          {title}
        </Text>
        {description && (
          <Box marginTop={1}>
            <Text>{description}</Text>
          </Box>
        )}
      </>
    )
  }

  return (
    <>
      {renderHeader()}
      {renderContent()}
    </>
  )
}
