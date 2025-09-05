import { FormSystemField } from '@island.is/api/schema'
import { NationalIdField } from './components/nationalIdField'
import { Input, Stack, Box, Text } from '@island.is/island-ui/core'
import { m, webMessages } from '../../lib/messages'
import { useIntl } from 'react-intl'
import { GET_COMPANY_BY_NATIONALID } from '@island.is/form-system/graphql'
import { useQuery } from '@apollo/client'
import { User } from './types'
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'

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
              label={formatMessage(webMessages.postalCode)}
              name="postalCode"
              placeholder={formatMessage(webMessages.postalCode)}
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
