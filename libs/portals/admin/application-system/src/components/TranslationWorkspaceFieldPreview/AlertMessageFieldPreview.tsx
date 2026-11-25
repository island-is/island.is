import {
  AlertMessage,
  Box,
  getTextStyles,
  type AlertMessageType,
} from '@island.is/island-ui/core'
import cn from 'classnames'
import { Markdown } from '@island.is/shared/components'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import type { FieldPreviewBaseProps } from './types'

const VALID_ALERT_TYPES: Set<string> = new Set([
  'default',
  'error',
  'info',
  'success',
  'warning',
])

/** Matches `AlertMessageFormField`: body markdown uses small text styling. */
const alertMessagePreviewBodyClass = cn(getTextStyles({ variant: 'small' }))

export const AlertMessageFieldPreview = ({
  screen,
  resolvePreviewString,
}: FieldPreviewBaseProps) => {
  const layout = fieldPreviewLayoutProps(screen)
  if (layout.marginBottom == null) {
    layout.marginBottom = 2
  }
  if (layout.marginTop == null) {
    layout.marginTop = 2
  }

  const alertType: AlertMessageType = VALID_ALERT_TYPES.has(
    screen.alertType ?? '',
  )
    ? (screen.alertType as AlertMessageType)
    : 'default'

  const titleResolved = resolveTranslatableStaticText(
    screen.title,
    screen.messageDescriptors,
    resolvePreviewString,
  ).trim()

  const messageResolved = screen.alertMessage
    ? resolveTranslatableStaticText(
        screen.alertMessage,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  if (!titleResolved && !messageResolved) {
    const fallback = screen.messageDescriptors
      .map((d) => resolvePreviewString(d.id, d.defaultMessage).trim())
      .filter((t) => t.length > 0)
      .join('\n')
    return (
      <Box {...layout}>
        <AlertMessage
          type={alertType}
          {...(fallback
            ? {
                message: (
                  <Box component="div" className={alertMessagePreviewBodyClass}>
                    <Markdown>{fallback}</Markdown>
                  </Box>
                ),
              }
            : { title: screen.id })}
        />
      </Box>
    )
  }

  const messageNode = messageResolved ? (
    <Box component="div" className={alertMessagePreviewBodyClass}>
      <Markdown>{messageResolved}</Markdown>
    </Box>
  ) : undefined

  return (
    <Box {...layout}>
      <AlertMessage
        type={alertType}
        {...(titleResolved ? { title: titleResolved } : {})}
        {...(messageNode ? { message: messageNode } : {})}
      />
    </Box>
  )
}
