import {
  AlertMessage,
  Box,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { NetworkStatus } from '@apollo/client'
import { useState } from 'react'
import { m } from '../../../lib/messages'
import { useGetPersonalTaxCreditQuery } from './PersonalTaxCredit.generated'
import { useTaxCardAllowance } from './useTaxCardAllowance'
import { MyTaxCreditForm } from './components/MyTaxCreditForm'
import { PersonalTaxCreditTable } from './components/PersonalTaxCreditTable'

const INITIAL_MY_TAX_CREDIT: MyTaxCreditState = { action: null }

export type MyTaxCreditState =
  | {
      action: 'register'
      data: { year: number | null; month: number | null; percentage: string }
    }
  | { action: 'update'; data: { percentage: string } }
  | {
      action: 'discontinue'
      data: { year: number | null; month: number | null }
    }
  | { action: null }

const PersonalTaxCredit = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const [myTaxCredit, setMyTaxCredit] = useState<MyTaxCreditState>(
    INITIAL_MY_TAX_CREDIT,
  )

  const { data, networkStatus, error, refetch } = useGetPersonalTaxCreditQuery({
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  })
  const loading = networkStatus === NetworkStatus.loading
  const [refetching, setRefetching] = useState(false)

  const taxCardAllowance = useTaxCardAllowance()

  const page = data?.socialInsurancePersonalTaxCredit

  const handleSaveMyTaxCredit = async () => {
    if (!myTaxCredit.action) return
    try {
      await taxCardAllowance.save(myTaxCredit)
      setRefetching(true)
      await refetch()
      setRefetching(false)
      setMyTaxCredit(INITIAL_MY_TAX_CREDIT)
      toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
    } catch (e) {
      setRefetching(false)
      toast.error(formatMessage(m.personalTaxCreditSaveError))
    }
  }

  const introProps = {
    title: formatMessage(m.personalTaxCredit),
    intro: formatMessage(m.personalTaxCreditDescription),
    serviceProviderSlug: 'tryggingastofnun' as const,
    serviceProviderTooltip: formatMessage(coreMessages.socialInsuranceTooltip),
  }

  if (loading) {
    return (
      <IntroWrapper {...introProps}>
        <CardLoader />
      </IntroWrapper>
    )
  }

  if (error) {
    return (
      <IntroWrapper {...introProps}>
        <Problem error={error} noBorder={false} />
      </IntroWrapper>
    )
  }

  return (
    <IntroWrapper {...introProps}>
      <Stack space={6}>
        {!!page?.taxCards?.length && (
          <PersonalTaxCreditTable taxCards={page.taxCards} />
        )}

        {!page?.taxCards?.length && (
          <AlertMessage
            type="info"
            message={formatMessage(m.personalTaxCreditNotRegistered)}
          />
        )}

        <Box>
          <Text variant="h4" marginBottom={3}>
            {formatMessage(m.myPersonalTaxCredit)}
          </Text>
          <MyTaxCreditForm
            state={myTaxCredit}
            setState={setMyTaxCredit}
            monthsAndYears={page?.registrationMonthsAndYears}
            discontinuingMonthsAndYears={page?.discontinuingMonthsAndYears}
            isAlreadyRegistered={page?.canEdit ?? false}
            canDiscontinue={page?.canDiscontinue ?? false}
            saving={taxCardAllowance.loading || refetching}
            onSave={handleSaveMyTaxCredit}
          />
        </Box>

        <AlertMessage
          type="info"
          message={
            <Text as="span" variant="small" whiteSpace="preLine">
              {formatMessage(m.taxBracketInfo)}
            </Text>
          }
        />
      </Stack>
    </IntroWrapper>
  )
}

export default PersonalTaxCredit
