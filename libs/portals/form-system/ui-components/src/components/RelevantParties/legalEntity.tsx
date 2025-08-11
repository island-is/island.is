import { FormSystemApplicant } from '@island.is/api/schema'
import { NationalIdField } from './components/nationalIdField'
import { Input, Stack, Box, Text } from '@island.is/island-ui/core'
import { m, webMessages } from '../../lib/messages'
import { useIntl } from 'react-intl'
import { GET_COMPANY_BY_NATIONALID } from '@island.is/form-system/graphql'
import { useQuery } from '@apollo/client'

interface User {
  nationalId: string
  emails: Array<{ primary: boolean; email: string }>
  mobilePhoneNumber: string
}

interface Props {
  applicantType: FormSystemApplicant
  user: User
  lang: 'is' | 'en'
}

export const LegalEntity = ({ applicantType, lang, user }: Props) => {
  const { formatMessage } = useIntl()
  const nationalId = user?.nationalId ?? ''
  const shouldQuery = !!nationalId
  const { data: nameData } = useQuery(GET_COMPANY_BY_NATIONALID, {
    variables: { input: nationalId },
    fetchPolicy: 'cache-first',
    skip: !shouldQuery,
  })
  console.log('nameData', nameData)
  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicantType?.name?.[lang]}
      </Text>
      <Stack space={2}>
        <NationalIdField
          disabled={true}
          nationalId={nationalId}
          name={nameData?.formSystemCompanyByNationalId?.name}
        />
        <Input
          label={formatMessage(m.address)}
          name="address"
          placeholder={formatMessage(m.address)}
          backgroundColor="blue"
          value={
            nameData?.formSystemCompanyByNationalId?.address?.streetAddress
          }
        />
        <Input
          label={formatMessage(webMessages.postalCode)}
          name="postalCode"
          placeholder={formatMessage(webMessages.postalCode)}
          backgroundColor="blue"
          value={nameData?.formSystemCompanyByNationalId?.address?.postalCode}
        />
      </Stack>
    </Box>
  )
}
