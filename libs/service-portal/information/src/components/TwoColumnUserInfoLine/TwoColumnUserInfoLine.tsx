import React, { FC } from 'react'
import {
  Box,
  Text,
  GridRow,
  GridColumn,
  LoadingDots,
  GridColumnProps,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import * as styles from './TwoColumnUserInfoLine.css'
import { Maybe } from '@island.is/service-portal/graphql'
import cn from 'classnames'

interface Props {
  label: MessageDescriptor | string
  content?: string | JSX.Element
  renderContent?: () => JSX.Element
  loading?: boolean
  title?: string
  firstValue?: Maybe<string>
  secondValue?: Maybe<string>
  tooltip?: string
  className?: string
  printable?: boolean
}

export const TwoColumnUserInfoLine: FC<React.PropsWithChildren<Props>> = ({
  label,
  loading,
  title,
  firstValue,
  secondValue,
  tooltip,
  className,
  printable = false,
}) => {
  const labelColumnSpan: GridColumnProps['span'] = ['8/12', '4/12']
  const valueColumnSpan: GridColumnProps['span'] = ['1/1', '4/12']
  const { formatMessage } = useLocale()

  return (
    <Box
      position="relative"
      paddingY={1}
      paddingRight={4}
      className={cn(className, {
        [styles.printable]: printable,
      })}
    >
      {title && (
        <Text variant="eyebrow" color="purple400" paddingBottom={2}>
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
            ) : (
              <Text variant="default">{firstValue}</Text>
            )}
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
            ) : (
              <Text variant="default">{secondValue}</Text>
            )}
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
