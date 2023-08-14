import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { InheritanceReport } from '../../lib/dataSchema'
import { m } from '../../lib/messages'
import { formatCurrency } from '@island.is/application/ui-components'

export const HeirsOverview: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const heirs = (application.answers as InheritanceReport).heirs?.data
  const { formatMessage } = useLocale()

  return (
    <Box>
      {heirs?.map((heir, index) => {
        return (
          <Box key={index}>
            <Text marginBottom={2} variant="h4">
              {formatMessage(m.heir)}
            </Text>
            <Box display="flex" marginBottom={2}>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.nationalId)}</Text>
                <Text>{heir.nationalId}</Text>
              </Box>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.name)}</Text>
                <Text>{heir.heirsName}</Text>
              </Box>
            </Box>
            <Box display={'flex'} marginBottom={2}>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.email)}</Text>
                <Text>{heir.email}</Text>
              </Box>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.phone)}</Text>
                <Text>{heir.phone}</Text>
              </Box>
            </Box>
            <Box display={'flex'} marginBottom={2}>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.heirsRelation)}</Text>
                <Text>{heir.relation}</Text>
              </Box>
              <Box width="half">
                <Text variant="h4">
                  {formatMessage(m.heirsInheritanceRate)}
                </Text>
                <Text>{heir.heirsPercentage} %</Text>
              </Box>
            </Box>
            <Box display={'flex'} marginBottom={2}>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.taxFreeInheritance)}</Text>
                <Text>{formatCurrency(String(heir.taxFreeInheritance))}</Text>
              </Box>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.inheritanceAmount)}</Text>
                <Text>{formatCurrency(String(heir.inheritance))}</Text>
              </Box>
            </Box>
            <Box display={'flex'} marginBottom={2}>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.taxableInheritance)}</Text>
                <Text>{formatCurrency(String(heir.taxableInheritance))}</Text>
              </Box>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.inheritanceTax)}</Text>
                <Text>{formatCurrency(String(heir.inheritanceTax))}</Text>
              </Box>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default HeirsOverview
