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

const FinanceSalary = () => {
  useNamespaces('sp.finance-salary')
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:finance-salary-title',
            defaultMessage: 'Laungreiðendakröfur',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">
              {formatMessage({
                id: 'service.portal:finance-salary-intro',
                defaultMessage:
                  'Eitthvað mega hresst og peppað um laungreiðendakröfur mögulega í tveimur línum.',
              })}
            </Text>
          </Column>
        </Columns>
        <Box marginTop={[1, 1, 2, 2, 5]}>
          <GridRow>
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
                    Skýring
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="eyebrow" fontWeight="semiBold">
                    Gjalddagi
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="eyebrow" fontWeight="semiBold">
                    Umsjónarmaður
                  </Text>
                </T.HeadData>
                <T.HeadData>
                  <Text variant="eyebrow" fontWeight="semiBold">
                    Framkvæmdaraðili
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
                <T.Data>Laungreiðendakröfur</T.Data>
                <T.Data>01.06.2019</T.Data>
                <T.Data>Tollstjóri</T.Data>
                <T.Data>Ríkisskattstjóri</T.Data>
                <T.Data>26.558 kr.</T.Data>
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

export default FinanceSalary
