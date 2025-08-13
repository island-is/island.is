import React, { FC } from 'react'
import {
  Box,
  Text,
  GridRow,
  GridColumn,
  GridColumnProps,
  Tooltip,
  ResponsiveSpace,
  SkeletonLoader,
  ButtonProps,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { sharedMessages } from '@island.is/shared/translations'

import * as styles from './UserInfoLine.css'
import cn from 'classnames'
import { LinkButton } from '../LinkButton/LinkButton'

export type EditLink = {
  external?: boolean
  url: string
  title?: MessageDescriptor | string
  skipOutboundTrack?: boolean
  icon?: ButtonProps['icon']
}

type LineButton = {
  title: MessageDescriptor | string
  onClick: () => void
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
  button?: LineButton
  title?: string
  titlePadding?: ResponsiveSpace
  tooltip?: string
  paddingY?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  className?: string
  translate?: 'yes' | 'no'
  translateLabel?: 'yes' | 'no'
  printable?: boolean
  tooltipFull?: boolean
}

export const UserInfoLine: FC<React.PropsWithChildren<Props>> = ({
  label,
  content,
  renderContent,
  labelColumnSpan = ['12/12', '4/12', '6/12', '6/12', '4/12'],
  valueColumnSpan = ['1/1', '5/12', '6/12', '6/12', '5/12'],
  editColumnSpan = ['1/1', '3/12', '1/1', '1/1', '3/12'],
  loading,
  editLink,
  title,
  titlePadding = 4,
  tooltip,
  paddingY = 2,
  paddingBottom,
  warning,
  className,
  translate = 'yes',
  translateLabel = 'yes',
  printable = false,
  tooltipFull,
  button,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      position="relative"
      paddingY={paddingY}
      paddingBottom={paddingBottom}
      paddingRight={4}
      className={cn(className, {
        [styles.printable]: printable,
      })}
    >
      {title && (
        <Text variant="eyebrow" color="purple400" paddingBottom={titlePadding}>
          {title}
        </Text>
      )}

      <GridRow rowGap={'smallGutter'} align="flexStart">
        <GridColumn order={1} span={labelColumnSpan}>
          <Box
            display="flex"
            alignItems="center"
            height="full"
            overflow="hidden"
          >
            <Text
              translate={translateLabel}
              variant="h5"
              as="span"
              lineHeight="lg"
            >
              {formatMessage(label)}
              {tooltip && (
                <Tooltip
                  placement="top"
                  fullWidth={tooltipFull}
                  text={tooltip}
                />
              )}
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
              <SkeletonLoader width="70%" height={27} />
            ) : renderContent ? (
              renderContent()
            ) : typeof content === 'string' ? (
              <Text
                translate={translate}
                color={warning ? 'red600' : undefined}
                variant="default"
              >
                {content}
              </Text>
            ) : (
              content
            )}
          </Box>
        </GridColumn>
        <GridColumn order={4} span={editColumnSpan}>
          {editLink ? (
            <Box
              display="flex"
              justifyContent={[
                'flexStart',
                'flexEnd',
                'flexStart',
                'flexStart',
                'flexEnd',
              ]}
              alignItems="center"
              height="full"
              printHidden
            >
              <LinkButton
                to={editLink.url}
                variant="text"
                icon={editLink.icon}
                text={
                  editLink.title
                    ? formatMessage(editLink.title)
                    : formatMessage(sharedMessages.edit)
                }
                skipOutboundTrack={editLink.skipOutboundTrack}
              />
            </Box>
          ) : button ? (
            <Box
              display="flex"
              justifyContent={[
                'flexStart',
                'flexEnd',
                'flexStart',
                'flexStart',
                'flexEnd',
              ]}
              alignItems="center"
              height="full"
              printHidden
            >
              <Button
                onClick={button.onClick}
                icon="pencil"
                size="small"
                variant="text"
              >
                {formatMessage(button.title)}
              </Button>
            </Box>
          ) : undefined}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
