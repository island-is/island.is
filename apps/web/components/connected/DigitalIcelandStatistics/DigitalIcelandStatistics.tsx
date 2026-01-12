import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  GridColumn,
  GridRow,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type { SpanType } from '@island.is/island-ui/core/types'

import { ChartNumberBox } from '../../Charts'
import { m } from './translation.strings'

const SPAN: SpanType = ['1/1', '1/2', '1/2', '1/2', '1/4']

export const DigitalIcelandStatistics = () => {
  const { formatMessage } = useIntl()

  const seeMoreLinkLabel = formatMessage(m.seeMoreLinkLabel)
  const seeMoreLinkHref = formatMessage(m.seeMoreLinkHref)

  return (
    <Stack space={4}>
      <Text variant="h3">{formatMessage(m.heading)}</Text>
      <GridRow alignItems="stretch" rowGap={3}>
        <GridColumn span={SPAN}>
          <ChartNumberBox
            slice={{
              id: '1',
              chartNumberBoxId: '1',
              displayChangeMonthOverMonth: false,
              displayChangeYearOverYear: false,
              numberBoxDescription: '',
              sourceDataKey: formatMessage(m.firstStatisticSourceDataKey),
              title: formatMessage(m.firstStatisticLabel),
              valueType: formatMessage(m.firstStatisticValueType),
            }}
          />
        </GridColumn>
        <GridColumn span={SPAN}>
          <ChartNumberBox
            slice={{
              id: '2',
              chartNumberBoxId: '2',
              displayChangeMonthOverMonth: false,
              displayChangeYearOverYear: false,
              numberBoxDescription: '',
              sourceDataKey: formatMessage(m.secondStatisticSourceDataKey),
              title: formatMessage(m.secondStatisticLabel),
              valueType: formatMessage(m.secondStatisticValueType),
            }}
          />
        </GridColumn>
        <GridColumn span={SPAN}>
          <ChartNumberBox
            slice={{
              id: '3',
              chartNumberBoxId: '3',
              displayChangeMonthOverMonth: false,
              displayChangeYearOverYear: false,
              numberBoxDescription: '',
              sourceDataKey: formatMessage(m.thirdStatisticSourceDataKey),
              title: formatMessage(m.thirdStatisticLabel),
              valueType: formatMessage(m.thirdStatisticValueType),
            }}
          />
        </GridColumn>
        <GridColumn span={SPAN}>
          <ChartNumberBox
            slice={{
              id: '4',
              chartNumberBoxId: '4',
              displayChangeMonthOverMonth: false,
              displayChangeYearOverYear: false,
              numberBoxDescription: '',
              sourceDataKey: formatMessage(m.fourthStatisticSourceDataKey),
              title: formatMessage(m.fourthStatisticLabel),
              valueType: formatMessage(m.fourthStatisticValueType),
            }}
          />
        </GridColumn>
      </GridRow>
      {Boolean(seeMoreLinkHref) && Boolean(seeMoreLinkLabel) && (
        <Box display="flex" justifyContent="flexEnd">
          <LinkV2 href={seeMoreLinkHref}>
            <Button
              variant="text"
              as="span"
              unfocusable={true}
              icon="arrowForward"
            >
              {seeMoreLinkLabel}
            </Button>
          </LinkV2>
        </Box>
      )}
    </Stack>
  )
}
