import React from 'react'
import { Table as T } from '@island.is/island-ui/core'
import { ExpandRow, ExpandHeader } from '../../components/ExpandableTable'
import FinanceTransactionsDetail from '../../components/FinanceTransactionsDetail/FinanceTransactionsDetail'
import {
  Box,
  Text,
  Columns,
  Column,
  Stack,
  GridRow,
  GridColumn,
  DatePicker,
  Select,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

const FinanceTransactions = () => {
  useNamespaces('sp.finance-transactions')
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:finance-transactions-title',
            defaultMessage: 'Færslur',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">
              {formatMessage({
                id: 'service.portal:finance-transactions-intro',
                defaultMessage:
                  'Hafið samband við viðeigandi umsjónarmann til að fá frekari upplýsingar um stöðu og innheimtu.',
              })}
            </Text>
          </Column>
        </Columns>
        <Box marginTop={[1, 1, 2, 2, 5]}>
          <GridRow>
            <GridColumn paddingBottom={[1, 0]} span={['1/1', '3/8']}>
              <Select
                name="faerslur"
                backgroundColor="blue"
                placeholder="Allar færslur"
                label="Veldu tegund færslu"
                size="sm"
                options={[
                  {
                    label: 'Færsla 1',
                    value: '0',
                  },
                  {
                    label: 'Færsla 2',
                    value: '1',
                  },
                  {
                    label: 'Færsla 3',
                    value: '2',
                  },
                ]}
              />
            </GridColumn>
            <GridColumn span={['1/1', '3/8']}>
              <DatePicker
                backgroundColor="blue"
                handleChange={function noRefCheck() {}}
                icon="calendar"
                iconType="outline"
                size="sm"
                label="Dagsetning"
                locale="is"
                placeholderText="Veldu dagsetningu"
                required
              />
            </GridColumn>
          </GridRow>
        </Box>
        <Box marginTop={2}>
          <T.Table>
            <ExpandHeader
              data={['Dagsetning', 'Tegund', 'Skýring', 'Upphæð']}
            />
            <T.Body>
              <ExpandRow
                data={[
                  '07.01.2019',
                  'Greiðslukvittun',
                  'Sýslumaðurinn á Vesturlandi',
                  '-',
                ]}
              >
                <FinanceTransactionsDetail
                  data={[
                    { title: 'Umsjónarmaður', value: 'Skatturinn' },
                    { title: 'Umsjónarmaður', value: 'Skatturinn' },
                    { title: 'Umsjónarmaður', value: 'Skatturinn' },
                    { title: 'Umsjónarmaður', value: 'Skatturinn' },
                    { title: 'Umsjónarmaður', value: 'Skatturinn' },
                    { title: 'Umsjónarmaður', value: 'Skatturinn' },
                  ]}
                />
              </ExpandRow>
              <ExpandRow
                data={[
                  '07.01.2019',
                  'Greiðslukvittun',
                  'Sýslumaðurinn á Vesturlandi',
                  '-',
                ]}
              />
            </T.Body>
          </T.Table>
        </Box>
      </Stack>
    </Box>
  )
}

export default FinanceTransactions
