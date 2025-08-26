import { FormSystemApplicant } from '@island.is/api/schema'
import { Input, Stack, Box, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { NationalIdField } from './components/nationalIdField'
import {
  GET_NAME_BY_NATIONALID,
  GET_ADDRESS_BY_NATIONALID,
} from '@island.is/form-system/graphql'
import { m, webMessages } from '../../lib/messages'
import { useQuery } from '@apollo/client'
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'
import { GET_COMPANY_BY_NATIONALID } from '@island.is/form-system/graphql'
import { ApplicantTypesEnum } from '@island.is/form-system/ui'

interface Props {
  applicantType: FormSystemApplicant
  lang: 'is' | 'en'
  nationalId: string
}

// TODO: Implementation is still a WIP, still missing an endpoint
export const Agent = ({ applicantType, lang, nationalId }: Props) => {
  const { formatMessage } = useIntl()
  const shouldQuery = !!nationalId

  let nameData: any = undefined
  let companyData: any = undefined
  let address: string | undefined = undefined
  let isLoading = false
  let postalCode: string | undefined = ''
  console.log("AGENT", applicantType)
  if (
    applicantType.applicantTypeId ===
    ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL
  ) {
    console.log("IN INDIVIDUAL")
    const nameQuery = useQuery(GET_NAME_BY_NATIONALID, {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
    })
    const addressQuery = useQuery(GET_ADDRESS_BY_NATIONALID, {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
    })
    nameData = nameQuery.data
    isLoading = shouldQuery && (nameQuery.loading || addressQuery.loading)
    address =
      addressQuery.data?.formSystemHomeByNationalId?.heimilisfang.husHeiti
    postalCode =
      addressQuery.data?.formSystemHomeByNationalId?.heimilisfang.postalCode ?? ''
  } else {
    const companyQuery = useQuery(GET_COMPANY_BY_NATIONALID, {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
    })
    companyData = companyQuery.data
    isLoading = shouldQuery && companyQuery.loading
    address = companyData?.formSystemCompanyByNationalId?.address.streetAddress
    postalCode = companyData?.formSystemCompanyByNationalId?.address.postalCode
  }

  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicantType?.name?.[lang] + 'AGENT'}
      </Text>
      <Stack space={2}>
        {isLoading ? (
          <ApplicationLoading />
        ) : (
          <>
            <NationalIdField
              disabled
              nationalId={nationalId}
              name={
                nameData?.formSystemNameByNationalId?.fulltNafn ??
                companyData?.formSystemCompanyByNationalId?.name
              }
            />

            <Input
              label={formatMessage(m.address)}
              disabled
              name="address"
              placeholder={formatMessage(m.address)}
              backgroundColor="blue"
              required
              value={address}
            />

            <Input
              label={formatMessage(webMessages.postalCode)}
              disabled
              name="postalCode"
              placeholder={formatMessage(webMessages.postalCode)}
              backgroundColor="blue"
              required
              value={postalCode}
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