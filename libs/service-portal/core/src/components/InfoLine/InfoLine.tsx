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
  ButtonProps as CoreButtonProps,
  Divider,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { useLocation } from 'react-router-dom'
import { sharedMessages } from '@island.is/shared/translations'

import * as styles from './InfoLine.css'
import cn from 'classnames'
import { LinkButton } from '../LinkButton/LinkButton'
import { GeneralButton } from '../GeneralButton/GeneralButton'

type ButtonProps =
  | {
      type: 'link'
      icon?: CoreButtonProps['icon']
      label?: MessageDescriptor | string
      skipOutboundTrack?: boolean
      to: string
    }
  | {
      type: 'action'
      icon?: CoreButtonProps['icon']
      label?: MessageDescriptor | string
      variant?: 'text' | 'utility'
      action: () => void
    }

interface Props {
  label?: MessageDescriptor | string
  content?: string | JSX.Element
  renderContent?: () => JSX.Element | undefined
  loading?: boolean
  warning?: boolean
  labelColumnSpan?: GridColumnProps['span']
  valueColumnSpan?: GridColumnProps['span']
  buttonColumnSpan?: GridColumnProps['span']
  button?: ButtonProps
  tooltip?: string
  paddingY?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
  className?: string
  translate?: 'yes' | 'no'
  translateLabel?: 'yes' | 'no'
  printable?: boolean
  tooltipFull?: boolean
  divider?: boolean
}

export const InfoLine = ({
  label,
  content,
  renderContent,
  labelColumnSpan = ['12/12', '4/12', '6/12', '6/12', '4/12'],
  valueColumnSpan = ['1/1', '5/12', '6/12', '6/12', '4/12'],
  buttonColumnSpan = ['1/1', '3/12', '3/12', '3/12', '3/12'],
  loading,
  button,
  tooltip,
  paddingY = 2,
  paddingBottom,
  warning,
  className,
  divider,
  translate = 'yes',
  translateLabel = 'yes',
  printable = false,
  tooltipFull,
}: Props) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box
        position="relative"
        paddingY={paddingY}
        paddingBottom={paddingBottom}
        paddingRight={4}
        className={cn(className, {
          [styles.printable]: printable,
        })}
      >
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
                {label && formatMessage(label)}
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
          <GridColumn order={4} span={buttonColumnSpan}>
            {button ? (
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
                {button.type === 'link' ? (
                  <LinkButton
                    to={button.to}
                    text={
                      button.label
                        ? formatMessage(button.label)
                        : formatMessage(sharedMessages.edit)
                    }
                    skipOutboundTrack={button.skipOutboundTrack}
                    icon={button.icon}
                  />
                ) : (
                  <GeneralButton
                    icon={button.icon}
                    onClick={button.action}
                    variant={button.variant ?? 'text'}
                    iconType="outline"
                  >
                    {button.label && formatMessage(button.label)}
                  </GeneralButton>
                )}
              </Box>
            ) : null}
          </GridColumn>
        </GridRow>
      </Box>
      {divider && <Divider />}
    </>
  )
}
