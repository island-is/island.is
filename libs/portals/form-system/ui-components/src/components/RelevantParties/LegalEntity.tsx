import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { GET_COMPANY_BY_NATIONALID } from '@island.is/form-system/graphql'
import {
  Box,
  GridColumn,
  GridRow,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'
import { NationalIdField } from './components/nationalIdField'
import { useLocale } from 'libs/localization/src/lib/useLocale'

interface Props {
  applicant: FormSystemField
  nationalId: string
}

export const LegalEntity = ({
  applicant: applicantType,
  nationalId,
}: Props) => {
  const { formatMessage, lang } = useLocale()
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
              nationalId={nationalId}
              name={companyData?.formSystemCompanyByNationalId?.name}
            />
            <GridRow>
              <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
                <Input
                  label={formatMessage(m.address)}
                  name="address"
                  placeholder={formatMessage(m.address)}
                  readOnly
                  defaultValue={
                    companyData?.formSystemCompanyByNationalId?.address
                      ?.streetAddress
                  }
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
                <Box marginTop={[2, 2, 0, 0]}>
                  <Input
                    label={formatMessage(m.postalCode)}
                    name="postalCode"
                    placeholder={formatMessage(m.postalCode)}
                    readOnly
                    defaultValue={
                      companyData?.formSystemCompanyByNationalId?.address
                        ?.postalCode
                    }
                  />
                </Box>
              </GridColumn>
            </GridRow>
          </>
        )}
      </Stack>
    </Box>
  )
}
