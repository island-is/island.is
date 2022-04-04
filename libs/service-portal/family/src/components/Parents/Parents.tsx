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
import * as styles from './Parents.css'
import { Maybe } from '@island.is/service-portal/graphql'

interface Props {
  label: MessageDescriptor | string
  content?: string | JSX.Element
  renderContent?: () => JSX.Element
  loading?: boolean
  title?: string
  parent1?: Maybe<string>
  parent2?: Maybe<string>
  tooltip?: string
}

export const Parents: FC<Props> = ({
  label,
  loading,
  title,
  parent1,
  parent2,
  tooltip,
}) => {
  const labelColumnSpan: GridColumnProps['span'] = ['8/12', '4/12']
  const valueColumnSpan: GridColumnProps['span'] = ['1/1', '4/12']
  const { formatMessage } = useLocale()

  return (
    <Box position="relative" paddingY={1} paddingRight={4}>
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
              <Text variant="default">{parent1}</Text>
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
              <Text variant="default">{parent2}</Text>
            )}
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
