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
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
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
      disabled?: boolean
    }
  | {
      type: 'action'
      icon?: CoreButtonProps['icon']
      label?: MessageDescriptor | string
      variant?: 'text' | 'utility'
      action: () => void
      disabled?: boolean
      tooltip?: string
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
  loading,
  button,
  tooltip,
  labelColumnSpan = ['1/1', '1/1', '1/1', '4/12'],
  valueColumnSpan = button
    ? ['1/1', '6/12', '6/12', '5/12']
    : ['1/1', '1/1', '1/1', '5/12'],
  buttonColumnSpan = ['1/1', '6/12', '6/12', '3/12'],
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
          <GridColumn order={2} span={valueColumnSpan}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              width="full"
              className={styles.content}
              overflow="hidden"
              flexWrap="wrap"
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
          {button && (
            <GridColumn order={3} span={buttonColumnSpan}>
              <Box
                display="flex"
                justifyContent={['flexStart', 'flexEnd']}
                alignItems="center"
                height="full"
                printHidden
              >
                {button.type === 'link' ? (
                  <LinkButton
                    to={button.to}
                    variant="text"
                    text={
                      button.label
                        ? formatMessage(button.label)
                        : formatMessage(sharedMessages.edit)
                    }
                    skipOutboundTrack={button.skipOutboundTrack}
                    icon={button.icon}
                    disabled={button.disabled}
                  />
                ) : (
                  <>
                    <GeneralButton
                      icon={button.icon}
                      onClick={button.action}
                      variant={button.variant ?? 'text'}
                      iconType="outline"
                      disabled={button.disabled}
                    >
                      {button.label && formatMessage(button.label)}
                    </GeneralButton>
                    {button.tooltip && (
                      <Tooltip placement="top" text={button.tooltip} />
                    )}
                  </>
                )}
              </Box>
            </GridColumn>
          )}
        </GridRow>
      </Box>
      {divider && <Divider />}
    </>
  )
}
