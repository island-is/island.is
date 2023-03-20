import React, { FC } from 'react'
import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
  LoadingDots,
  GridColumnProps,
  Tooltip,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import { servicePortalOutboundLink } from '@island.is/plausible'
import { sharedMessages } from '@island.is/shared/translations'

import * as styles from './UserInfoLine.css'
import { formatPlausiblePathToParams } from '../../utils/formatPlausiblePathToParams'

export type EditLink = {
  external?: boolean
  url: string
  title?: MessageDescriptor
}

interface Props {
  label: MessageDescriptor | string
  content?: string | JSX.Element
  renderContent?: () => JSX.Element | undefined
  loading?: boolean
  warning?: boolean
  labelColumnSpan?: GridColumnProps['span']
  valueColumnSpan?: GridColumnProps['span']
  editColumnSpan?: GridColumnProps['span']
  editLink?: EditLink
  title?: string
  titlePadding?: ResponsiveSpace
  tooltip?: string
  paddingY?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  className?: string
}

export const UserInfoLine: FC<Props> = ({
  label,
  content,
  renderContent,
  labelColumnSpan = ['8/12', '4/12'],
  valueColumnSpan = ['1/1', '5/12'],
  editColumnSpan = ['1/1', '3/12'],
  loading,
  editLink,
  title,
  titlePadding = 2,
  tooltip,
  paddingY = 2,
  paddingBottom,
  warning,
  className,
}) => {
  const { pathname } = useLocation()
  const { formatMessage } = useLocale()

  const trackExternalLinkClick = () => {
    servicePortalOutboundLink(formatPlausiblePathToParams(pathname))
  }

  return (
    <Box
      position="relative"
      paddingY={paddingY}
      paddingBottom={paddingBottom}
      paddingRight={4}
      className={className}
    >
      {title && (
        <Text variant="eyebrow" color="purple400" paddingBottom={titlePadding}>
          {title}
        </Text>
      )}

      <GridRow align="flexStart">
        <GridColumn order={1} span={labelColumnSpan}>
          <Box
            display="flex"
            alignItems="center"
            height="full"
            overflow="hidden"
          >
            <Text variant="h5" as="span" lineHeight="lg">
              {formatMessage(label)} {tooltip && <Tooltip text={tooltip} />}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn order={[3, 2]} span={valueColumnSpan}>
          <Box
            display="flex"
            alignItems="center"
            height="full"
            width="full"
            className={styles.content}
            overflow="hidden"
          >
            {loading ? (
              <LoadingDots />
            ) : renderContent ? (
              renderContent()
            ) : (
              <Text color={warning ? 'red600' : undefined} variant="default">
                {content}
              </Text>
            )}
          </Box>
        </GridColumn>
        <GridColumn order={4} span={editColumnSpan}>
          {editLink ? (
            <Box
              display="flex"
              justifyContent={['flexStart', 'flexEnd']}
              alignItems="center"
              height="full"
              printHidden
            >
              {editLink.external ? (
                <a
                  href={editLink.url}
                  rel="noopener noreferrer"
                  onClick={trackExternalLinkClick}
                  target="_blank"
                >
                  <Button
                    variant="text"
                    size="small"
                    icon="open"
                    iconType="outline"
                  >
                    {editLink.title
                      ? formatMessage(editLink.title)
                      : formatMessage(sharedMessages.edit)}
                  </Button>
                </a>
              ) : (
                <Link to={editLink.url}>
                  <Button variant="text" size="small">
                    {editLink.title
                      ? formatMessage(editLink.title)
                      : formatMessage(sharedMessages.edit)}
                  </Button>
                </Link>
              )}
            </Box>
          ) : null}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
