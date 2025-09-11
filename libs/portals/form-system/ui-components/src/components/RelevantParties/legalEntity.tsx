import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { GET_COMPANY_BY_NATIONALID } from '@island.is/form-system/graphql'
import { Box, Input, Stack, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '../../lib/messages'
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'
import { NationalIdField } from './components/nationalIdField'
import { User } from './types'

interface Props {
  applicantType: FormSystemField
  user?: User
  lang: 'is' | 'en'
  id: string
}

export const LegalEntity = ({ applicantType, lang, user, id }: Props) => {
  const { formatMessage } = useIntl()
  const nationalId = user?.nationalId ?? id
  const shouldQuery = !!nationalId
  const { data: companyData, loading: companyLoading } = useQuery(
    GET_COMPANY_BY_NATIONALID,
    {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
    },
  )

  const isLoading = shouldQuery && companyLoading
  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicantType?.name?.[lang]}
      </Text>
      <Stack space={2}>
        {isLoading ? (
          <ApplicationLoading />
        ) : (
          <>
            <NationalIdField
              disabled={true}
              nationalId={nationalId}
              name={companyData?.formSystemCompanyByNationalId?.name}
            />
            <Input
              label={formatMessage(m.address)}
              name="address"
              placeholder={formatMessage(m.address)}
              backgroundColor="blue"
              defaultValue={
                companyData?.formSystemCompanyByNationalId?.address
                  ?.streetAddress
              }
            />
            <Input
              label={formatMessage(m.postalCode)}
              name="postalCode"
              placeholder={formatMessage(m.postalCode)}
              backgroundColor="blue"
              defaultValue={
                companyData?.formSystemCompanyByNationalId?.address?.postalCode
              }
            />
          </>
        )}
      </Stack>
    </Box>
  )
}
