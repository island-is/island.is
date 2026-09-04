import { Box, Select } from '@island.is/island-ui/core'
import { previewWorkspaceInputBackgroundColor } from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  resolvePreviewLabel,
} from '../../utils/translationWorkspaceStaticText'
import type { FieldPreviewBaseProps } from './types'

export type SelectFieldPreviewProps = FieldPreviewBaseProps & {
  errorMessage?: string
}

export const SelectFieldPreview = ({
  screen,
  resolvePreviewString,
  errorMessage,
}: SelectFieldPreviewProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const label = resolvePreviewLabel(screen, resolvePreviewString)

  return (
    <Box {...layout}>
      <Select
        label={label}
        name={screen.id}
        options={[]}
        isDisabled
        hasError={!!errorMessage}
        errorMessage={errorMessage}
        backgroundColor={previewWorkspaceInputBackgroundColor(screen)}
      />
    </Box>
  )
}
