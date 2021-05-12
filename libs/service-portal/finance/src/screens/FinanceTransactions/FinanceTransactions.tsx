import React from 'react'
import { Table as T } from '@island.is/island-ui/core'

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
  Button,
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
            <T.Head>
              <T.Row>
                <T.HeadData>
                  <Text variant="eyebrow" fontWeight="semiBold">
                    Dagsetning
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="eyebrow" fontWeight="semiBold">
                    Tegund
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="eyebrow" fontWeight="semiBold">
                    Skýring
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="eyebrow" fontWeight="semiBold">
                    Upphæð
                  </Text>
                </T.HeadData>
                <T.HeadData></T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              <T.Row>
                <T.Data>07.01.2019</T.Data>
                <T.Data>Greiðslukvittun</T.Data>
                <T.Data>Sýslumaðurinn á Vesturlandi</T.Data>
                <T.Data>-</T.Data>
                <T.Data box={{ textAlign: 'right' }}>
                  <Button
                    circle
                    colorScheme="default"
                    icon="arrowForward"
                    iconType="filled"
                    preTextIconType="filled"
                    size="small"
                    title="Go forward"
                    type="button"
                    inline
                    variant="primary"
                    onBlur={function noRefCheck() {}}
                    onClick={function noRefCheck() {}}
                    onFocus={function noRefCheck() {}}
                  />
                </T.Data>
              </T.Row>
            </T.Body>
          </T.Table>
        </Box>
      </Stack>
    </Box>
  )
}

export default FinanceTransactions
