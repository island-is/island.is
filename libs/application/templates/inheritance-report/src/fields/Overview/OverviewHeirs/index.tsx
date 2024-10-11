import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, Fragment } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { InheritanceReport } from '../../../lib/dataSchema'
import { m } from '../../../lib/messages'
import { formatCurrency } from '@island.is/application/ui-components'
import { format as formatNationalId } from 'kennitala'
import {
  ESTATE_INHERITANCE,
  PREPAID_INHERITANCE,
  RelationSpouse,
} from '../../../lib/constants'
import format from 'date-fns/format'

export const OverviewHeirs: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { answers } = application
  const heirs = (answers as InheritanceReport).heirs?.data
  const { formatMessage } = useLocale()

  return (
    <Box>
      {heirs?.map((heir, index) => {
        const showTaxFree =
          answers.applicationFor === ESTATE_INHERITANCE ||
          (answers.applicationFor === PREPAID_INHERITANCE &&
            heir.relation === RelationSpouse)
        if (!heir.enabled) return null

        return (
          <Box key={index} marginTop={index === 0 ? 1 : 5}>
            <Text marginBottom={2} variant="h4">
              {formatMessage(m.heir) + ' ' + (index + 1)}
            </Text>
            <Box display="flex" marginBottom={2}>
              <Box width="half">
                <Text variant="h4">
                  {formatMessage(
                    heir.foreignCitizenship?.length
                      ? m.dateOfBirth
                      : m.nationalId,
                  )}
                </Text>
                <Text>
                  {heir.foreignCitizenship?.length
                    ? format(new Date(heir.dateOfBirth ?? ''), 'dd.MM.yyyy')
                    : formatNationalId(heir.nationalId ?? '')}
                </Text>
              </Box>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.name)}</Text>
                <Text>{heir.name}</Text>
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
                <Text>{String(heir.heirsPercentage || '0')}%</Text>
              </Box>
            </Box>
            <Box display={'flex'} marginBottom={2}>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.inheritanceAmount)}</Text>
                <Text>{formatCurrency(String(heir.inheritance || '0'))}</Text>
              </Box>
              {showTaxFree ? (
                <Box width="half">
                  <Text variant="h4">
                    {formatMessage(m.taxFreeInheritance)}
                  </Text>
                  <Text>
                    {formatCurrency(String(heir.taxFreeInheritance || '0'))}
                  </Text>
                </Box>
              ) : (
                <Box width="half">
                  <Text variant="h4">
                    {formatMessage(m.taxableInheritance)}
                  </Text>
                  <Text>
                    {formatCurrency(String(heir.taxableInheritance || '0'))}
                  </Text>
                </Box>
              )}
            </Box>
            <Box
              display={'flex'}
              marginBottom={2}
              flexDirection={showTaxFree ? 'rowReverse' : 'row'}
            >
              {showTaxFree && (
                <Box width="half">
                  <Text variant="h4">
                    {formatMessage(m.taxableInheritance)}
                  </Text>
                  <Text>
                    {formatCurrency(String(heir.taxableInheritance || '0'))}
                  </Text>
                </Box>
              )}
              <Box width="half">
                <Text variant="h4">{formatMessage(m.inheritanceTax)}</Text>
                <Text>
                  {formatCurrency(String(heir.inheritanceTax || '0'))}
                </Text>
              </Box>
            </Box>
            {heir.advocate?.nationalId && (
              <Fragment>
                <Text marginBottom={2} variant="h4">
                  {formatMessage(m.advocate)}
                </Text>
                <Box display="flex" marginBottom={2}>
                  <Box width="half">
                    <Text variant="h4">
                      {formatMessage(m.advocateNationalId)}
                    </Text>
                    <Text>{formatNationalId(heir.advocate.nationalId)}</Text>
                  </Box>
                  <Box width="half">
                    <Text variant="h4">{formatMessage(m.advocateName)}</Text>
                    <Text>{heir.advocate.name}</Text>
                  </Box>
                </Box>
                <Box display="flex" marginBottom={2}>
                  <Box width="half">
                    <Text variant="h4">{formatMessage(m.advocateEmail)}</Text>
                    <Text>{heir.advocate.email}</Text>
                  </Box>
                  <Box width="half">
                    <Text variant="h4">{formatMessage(m.advocatePhone)}</Text>
                    <Text>{heir.advocate.phone}</Text>
                  </Box>
                </Box>
              </Fragment>
            )}
            {heir.advocate2?.nationalId && (
              <Fragment>
                <Text marginBottom={2} variant="h4">
                  {formatMessage(m.advocate)}
                </Text>
                <Box display="flex" marginBottom={2}>
                  <Box width="half">
                    <Text variant="h4">
                      {formatMessage(m.advocateNationalId)}
                    </Text>
                    <Text>{formatNationalId(heir.advocate2.nationalId)}</Text>
                  </Box>
                  <Box width="half">
                    <Text variant="h4">{formatMessage(m.advocateName)}</Text>
                    <Text>{heir.advocate2.name}</Text>
                  </Box>
                </Box>
                <Box display="flex" marginBottom={2}>
                  <Box width="half">
                    <Text variant="h4">{formatMessage(m.advocateEmail)}</Text>
                    <Text>{heir.advocate2.email}</Text>
                  </Box>
                  <Box width="half">
                    <Text variant="h4">{formatMessage(m.advocatePhone)}</Text>
                    <Text>{heir.advocate2.phone}</Text>
                  </Box>
                </Box>
              </Fragment>
            )}
          </Box>
        )
      })}
    </Box>
  )
}

export default OverviewHeirs
