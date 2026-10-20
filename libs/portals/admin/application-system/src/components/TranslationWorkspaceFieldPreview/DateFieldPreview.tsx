import { Box, DatePicker } from '@island.is/island-ui/core'
import {
  noop,
  previewWorkspaceInputBackgroundColor,
} from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  resolvePreviewLabel,
} from '../../utils/translationWorkspaceStaticText'
import type { FieldPreviewBaseProps } from './types'

export type DateFieldPreviewProps = FieldPreviewBaseProps & {
  errorMessage?: string
}

export const DateFieldPreview = ({
  screen,
  resolvePreviewString,
  errorMessage,
}: DateFieldPreviewProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  const label = resolvePreviewLabel(screen, resolvePreviewString)

  return (
    <Box {...layout}>
      <DatePicker
        label={label}
        placeholderText="dd.mm.yyyy"
        handleChange={noop}
        hasError={!!errorMessage}
        errorMessage={errorMessage}
        backgroundColor={previewWorkspaceInputBackgroundColor(screen)}
      />
    </Box>
  )
}
