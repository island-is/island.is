import { Box, Checkbox, Icon, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfExternalDataProviderField = ({
  component,
  currentValue,
  error,
  handleChange,
}: FieldRendererProps) => {
  const isApproved = currentValue === true
  return (
    <Box {...getSdfFieldMargins(component)}>
      <Box marginTop={2} marginBottom={5}>
        <Box display="flex" alignItems="center" justifyContent="flexStart">
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">
            {component.subTitle ??
              'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki'}
          </Text>
        </Box>
        {component.description && (
          <Box marginTop={4}>
            <Text>{component.description}</Text>
          </Box>
        )}
      </Box>
      <Box marginBottom={5}>
        {component.dataProviders?.map((dp) => (
          <Box key={dp.id} marginBottom={3}>
            <Text variant="h4" color="blue400">
              {dp.title}
            </Text>
            {dp.subTitle && <Text>{dp.subTitle}</Text>}
          </Box>
        ))}
      </Box>
      <Checkbox
        name={component.id ?? ''}
        label={component.checkboxLabel ?? 'Ég samþykki'}
        checked={isApproved}
        onChange={(e) => handleChange(e.target.checked)}
        hasError={!!error}
        large
        backgroundColor="blue"
      />
      {error && (
        <Box marginTop={1}>
          <Text variant="small" color="red600">
            {error}
          </Text>
        </Box>
      )}
    </Box>
  )
}
