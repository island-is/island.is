import { useState } from 'react'
import { VehicleUserTypeEnum } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  DatePicker,
  GridColumn,
  GridRow,
  Stack,
  Tabs,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  m,
  SAMGONGUSTOFA_ID,
} from '@island.is/service-portal/core'

import { vehicleMessage as messages } from '../../lib/messages'
import TabContent from './TabContent'

const VehiclesHistory = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const [checkbox, setCheckbox] = useState(false)
  const [fromDate, setFromDate] = useState<Date | null>()
  const [toDate, setToDate] = useState<Date | null>()

  const tabs = [
    {
      label: formatMessage(messages.ownersHistory),
      content: (
        <TabContent
          type={VehicleUserTypeEnum.eigandi}
          showDeregistered={checkbox}
          fromDate={fromDate}
          toDate={toDate}
        />
      ),
    },
    {
      label: formatMessage(messages.coOwnerHistory),
      content: (
        <TabContent
          type={VehicleUserTypeEnum.medeigandi}
          showDeregistered={checkbox}
          fromDate={fromDate}
          toDate={toDate}
        />
      ),
    },
    {
      label: formatMessage(messages.operatorHistory),
      content: (
        <TabContent
          type={VehicleUserTypeEnum.umradamadur}
          showDeregistered={checkbox}
          fromDate={fromDate}
          toDate={toDate}
        />
      ),
    },
  ]

  return (
    <>
      <IntroHeader
        title={messages.historyTitle}
        intro={messages.historyIntro}
        serviceProviderID={SAMGONGUSTOFA_ID}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      />

      <Stack space={2}>
        <GridRow rowGap={[1, 1, 2, 2, 'smallGutter']}>
          <GridColumn span={['1/1', '7/9', '6/9', '5/9', '3/9']}>
            <DatePicker
              backgroundColor="blue"
              handleChange={(d: Date) => setFromDate(d)}
              icon={{ name: 'calendar', type: 'outline' }}
              size="xs"
              label={formatMessage(messages.dateOfPurchase)}
              selected={fromDate}
              locale="is"
              placeholderText={formatMessage(m.chooseDate)}
            />
          </GridColumn>
          <GridColumn
            span={['1/1', '7/9', '6/9', '5/9', '3/9']}
            paddingTop={[1, 1, 2, 0, 0]}
          >
            <DatePicker
              backgroundColor="blue"
              handleChange={(d: Date) => setToDate(d)}
              icon={{ name: 'calendar', type: 'outline' }}
              size="xs"
              label={formatMessage(messages.dateOfSale)}
              selected={toDate}
              locale="is"
              placeholderText={formatMessage(m.chooseDate)}
            />
          </GridColumn>
          <GridColumn
            span={['1/1', '7/9', '6/9', '5/9', '3/9']}
            offset={['0', '0', '0', '0', '0']}
            paddingBottom={[1, 1, 2, 0, 0]}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              height="full"
              paddingTop={'p5'}
            >
              <Checkbox
                label={formatMessage(messages.showDeregistered)}
                checked={checkbox}
                onChange={({ target }) => {
                  setCheckbox(target.checked)
                }}
              />
            </Box>
          </GridColumn>
        </GridRow>

        <Box marginTop={[0, 0, 5]}>
          <Tabs
            label={formatMessage(messages.chooseHistoryType)}
            tabs={tabs}
            contentBackground="transparent"
            selected="0"
            size="xs"
          />
        </Box>
      </Stack>
    </>
  )
}

export default VehiclesHistory
