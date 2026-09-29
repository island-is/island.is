import type { ComponentProps, FC, PropsWithChildren } from 'react'
import { useContext } from 'react'
import cn from 'classnames'

import type { IconMapIcon } from '@island.is/island-ui/core'
import { Box, Button, Icon, Text, Tooltip } from '@island.is/island-ui/core'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { api } from '@island.is/judicial-system-web/src/services'
import { onEnterOrSpace } from '@island.is/judicial-system-web/src/utils/utils'

import * as styles from './PdfButton.css'

interface Props {
  caseId?: string
  connectedCaseParentId?: string
  title?: string | null
  titleIcon?: IconMapIcon
  titleIconTooltip?: string
  subtitle?: string | null
  subtitleIcon?: IconMapIcon
  subtitleIconColor?: ComponentProps<typeof Icon>['color']
  subtitleIconTooltip?: string
  pdfType?:
    | 'ruling'
    | 'caseFilesRecord'
    | 'courtRecord'
    | 'request'
    | 'custodyNotice'
    | 'indictment'
    | 'subpoena'
    | 'subpoenaServiceCertificate'
    | 'verdictServiceCertificate'
    | 'rulingSentToPrisonAdmin'

  disabled?: boolean
  renderAs?: 'button' | 'row'
  handleClick?: () => void
  elementId?: string | string[]
  queryParameters?: string
}

const PdfButton: FC<PropsWithChildren<Props>> = ({
  caseId,
  // This is used when accessing data belonging to a case which has been merged into another case.
  // For access control purposes, the data must be accessed through the parent case.
  connectedCaseParentId,
  title,
  titleIcon,
  titleIconTooltip,
  subtitle,
  subtitleIcon,
  subtitleIconColor,
  subtitleIconTooltip,
  pdfType,
  disabled,
  renderAs = 'button',
  children,
  handleClick, // Overwrites the default onClick handler
  elementId,
  queryParameters,
}) => {
  const { limitedAccess } = useContext(UserContext)

  const handlePdfClick = async () => {
    const prefix = `${limitedAccess ? 'limitedAccess/' : ''}${
      connectedCaseParentId ? `mergedCase/${caseId}/` : ''
    }`
    const postfix = elementId
      ? `/${Array.isArray(elementId) ? elementId.join('/') : elementId}`
      : ''
    const query = queryParameters ? `?${queryParameters}` : ''
    const url = `${api.apiUrl}/api/case/${
      connectedCaseParentId ?? caseId
    }/${prefix}${pdfType}${postfix}${query}`

    window.open(url, '_blank')
  }

  // Three states, not two. A row with nothing to open - a ruling order
  // pronounced orally has no document until the district court writes it up -
  // is not a control at all, so it stays out of the accessibility tree and
  // keeps its ordinary appearance. A disabled row is a control that happens to
  // be unavailable, so it remains a button that reports itself as disabled.
  const hasAction = Boolean(handleClick || pdfType)
  const isInteractive = hasAction && !disabled

  const handleRowClick = () => {
    if (!isInteractive) {
      return
    }

    if (handleClick) {
      return handleClick()
    }

    return handlePdfClick()
  }

  return renderAs === 'button' ? (
    <Button
      data-testid={`${pdfType || ''}PDFButton`}
      variant="ghost"
      size="small"
      icon="open"
      iconType="outline"
      disabled={disabled}
      onClick={handleClick ? handleClick : pdfType ? handlePdfClick : undefined}
    >
      {title}
    </Button>
  ) : (
    <Box
      data-testid={`${pdfType || ''}PDFButton`}
      className={cn(styles.pdfRow, {
        [styles.disabled]: disabled,
        [styles.cursor]: isInteractive,
      })}
      role={hasAction ? 'button' : undefined}
      tabIndex={hasAction ? (disabled ? -1 : 0) : undefined}
      aria-disabled={disabled}
      aria-label={title ?? undefined}
      onClick={handleRowClick}
      onKeyDown={onEnterOrSpace(handleRowClick)}
    >
      <Box className={styles.pdfRowMain}>
        <span
          className={cn(styles.fileNameContainer, {
            [styles.fileNameContainerWithChildren]: !!children,
          })}
        >
          <Text color="blue400" variant="h4">
            {title}
            {titleIcon &&
              (titleIconTooltip ? (
                // fullWidth lifts the 240px cap the tooltip otherwise wraps a
                // short label at, which broke "Úrskurður kveðinn upp munnlega"
                // across two lines.
                <Tooltip text={titleIconTooltip} placement="top" fullWidth>
                  <span className={styles.titleIcon}>
                    <Icon icon={titleIcon} type="outline" size="small" />
                  </span>
                </Tooltip>
              ) : (
                <span className={styles.titleIcon}>
                  <Icon icon={titleIcon} type="outline" size="small" />
                </span>
              ))}
          </Text>
        </span>
        {children && <Box className={styles.childrenContainer}>{children}</Box>}
      </Box>
      {subtitle && (
        <Box marginTop={1} display="flex" alignItems="center" columnGap={1}>
          {subtitleIcon &&
            (subtitleIconTooltip ? (
              <Tooltip text={subtitleIconTooltip} placement="top">
                <span>
                  <Icon icon={subtitleIcon} color={subtitleIconColor} />
                </span>
              </Tooltip>
            ) : (
              <Icon icon={subtitleIcon} color={subtitleIconColor} />
            ))}
          <Text variant="small" color="dark400">
            {subtitle}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default PdfButton
