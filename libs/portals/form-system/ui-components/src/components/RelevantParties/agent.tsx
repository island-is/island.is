import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import {
  GET_ADDRESS_BY_NATIONALID,
  GET_COMPANY_BY_NATIONALID,
  GET_NAME_BY_NATIONALID,
} from '@island.is/form-system/graphql'
import { Box, Input, Stack, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { ApplicantTypesEnum } from '../../lib/enums'
import { m } from '../../lib/messages'
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'
import { NationalIdField } from './components/nationalIdField'

interface Props {
  applicantType: FormSystemField
  lang: 'is' | 'en'
  nationalId: string
}

export const Agent = ({ applicantType, lang, nationalId }: Props) => {
  const { formatMessage } = useIntl()
  const shouldQuery = !!nationalId

  const isIndividualDelegation =
    applicantType?.fieldSettings?.applicantType ===
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL

  const nameQuery = useQuery(GET_NAME_BY_NATIONALID, {
    variables: { input: nationalId },
    fetchPolicy: 'cache-first',
    skip: !shouldQuery || !isIndividualDelegation,
  })

  const addressQuery = useQuery(GET_ADDRESS_BY_NATIONALID, {
    variables: { input: nationalId },
    fetchPolicy: 'cache-first',
    skip: !shouldQuery || !isIndividualDelegation,
  })

  const companyQuery = useQuery(GET_COMPANY_BY_NATIONALID, {
    variables: { input: nationalId },
    fetchPolicy: 'cache-first',
    skip: !shouldQuery || isIndividualDelegation,
  })

  const isLoading =
    shouldQuery &&
    (nameQuery.loading || addressQuery.loading || companyQuery.loading)

  const name =
    nameQuery.data?.formSystemNameByNationalId?.fulltNafn ??
    companyQuery.data?.formSystemCompanyByNationalId?.name

  const address = isIndividualDelegation
    ? addressQuery.data?.formSystemHomeByNationalId?.heimilisfang?.husHeiti
    : companyQuery.data?.formSystemCompanyByNationalId?.address?.streetAddress

  const postalCode = isIndividualDelegation
    ? addressQuery.data?.formSystemHomeByNationalId?.heimilisfang?.postnumer
    : companyQuery.data?.formSystemCompanyByNationalId?.address?.postalCode

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
            <NationalIdField disabled nationalId={nationalId} name={name} />

            <Input
              label={formatMessage(m.address)}
              disabled
              name="address"
              placeholder={formatMessage(m.address)}
              backgroundColor="white"
              value={address ?? ''}
            />

            <Input
              label={formatMessage(m.postalCode)}
              disabled
              name="postalCode"
              placeholder={formatMessage(m.postalCode)}
              backgroundColor="white"
              value={postalCode ?? ''}
            />

            <Input
              label={formatMessage(m.email)}
              name="email"
              placeholder={formatMessage(m.email)}
              backgroundColor="blue"
            />

            <Input
              label={formatMessage(m.phoneNumber)}
              name="phone"
              placeholder={formatMessage(m.phoneNumber)}
              backgroundColor="blue"
            />
          </>
        )}
      </Stack>
    </Box>
  )
}
