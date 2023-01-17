import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import {
  formatCurrency,
  formatPhoneNumber,
} from '@island.is/application/ui-components'

export const HeirsOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  return (
    <Box marginY={3}>
      {(answers.heirs as any).data?.map((heir: any, index: number) => {
        return (
          <Box key={index}>
            <GridRow>
              <GridColumn span={'12/12'}>
                <Text variant="h3" marginBottom={2}>
                  {formatMessage(m.heir) + ' ' + (index + 1)}
                </Text>
              </GridColumn>

              <GridColumn span={'6/12'}>
                <Text variant="h4">{formatMessage(m.heirsNationalId)}</Text>
                <Text>{formatNationalId(heir.nationalId)}</Text>
              </GridColumn>
              <GridColumn span={'6/12'} paddingBottom={2}>
                <Text variant="h4">{formatMessage(m.heirsName)}</Text>
                <Text>{heir.heirsName}</Text>
              </GridColumn>

              <GridColumn span={'6/12'}>
                <Text variant="h4">{formatMessage(m.heirsEmail)}</Text>
                <Text>{heir.email}</Text>
              </GridColumn>
              <GridColumn span={'6/12'} paddingBottom={2}>
                <Text variant="h4">{formatMessage(m.heirsPhone)}</Text>
                <Text>{formatPhoneNumber(heir.phone)}</Text>
              </GridColumn>

              <GridColumn span={'6/12'}>
                <Text variant="h4">{formatMessage(m.heirsRelation)}</Text>
                <Text>{heir.relation}</Text>
              </GridColumn>
              <GridColumn span={'6/12'} paddingBottom={2}>
                <Text variant="h4">
                  {formatMessage(m.heirsInheritanceRate)}
                </Text>
                <Text>{heir.heirsPercentage}</Text>
              </GridColumn>

              <GridColumn span={'6/12'}>
                <Text variant="h4">{formatMessage(m.taxFreeInheritance)}</Text>
                <Text>{formatCurrency(String(heir.taxFreeInheritance))}</Text>
              </GridColumn>
              <GridColumn span={'6/12'} paddingBottom={2}>
                <Text variant="h4">{formatMessage(m.inheritanceAmount)}</Text>
                <Text>{formatCurrency(String(heir.inheritance))}</Text>
              </GridColumn>

              <GridColumn span={'6/12'}>
                <Text variant="h4">{formatMessage(m.taxableInheritance)}</Text>
                <Text>{formatCurrency(String(heir.taxableInheritance))}</Text>
              </GridColumn>
              <GridColumn span={'6/12'}>
                <Text variant="h4">{formatMessage(m.inheritanceTax)}</Text>
                <Text>
                  {formatCurrency(
                    String(Number.parseInt(heir.inheritanceTax, 10)),
                  )}
                </Text>
              </GridColumn>
            </GridRow>
            {index !== (answers.heirs as any).data?.length - 1 && (
              <Box paddingY={4}>
                <Divider />
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}

export default HeirsOverview
