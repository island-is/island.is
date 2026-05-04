import {
  AlertMessage,
  Box,
  Button,
  RadioButton,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  Tooltip,
  m as coreMessages,
  TRYGGINGASTOFNUN_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { m } from '../../../lib/messages'
import { SocialInsuranceTaxBracketAction } from '@island.is/api/schema'
import {
  useGetPersonalTaxCreditQuery,
  useGetPersonalTaxCreditTaxBracketQuery,
  useSetSocialInsurancePersonalTaxCreditTaxBracketMutation,
} from './PersonalTaxCredit.generated'
import { useTaxCardAllowance } from './useTaxCardAllowance'
import { MyTaxCreditForm } from './components/MyTaxCreditForm'
import { PersonalTaxCreditTable } from './components/PersonalTaxCreditTable'
import { useState } from 'react'

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

  const { data, loading, error, refetch } = useGetPersonalTaxCreditQuery({
    errorPolicy: 'all',
  })
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

  const {
    data: taxBracketData,
    loading: taxBracketQueryLoading,
    error: taxBracketQueryError,
    refetch: refetchTaxBracket,
  } = useGetPersonalTaxCreditTaxBracketQuery({ errorPolicy: 'all' })

  const serverTaxBracket =
    taxBracketData?.socialInsurancePersonalTaxCreditTaxBracket

  const [setTaxBracketMutation, { loading: taxBracketSaving }] =
    useSetSocialInsurancePersonalTaxCreditTaxBracketMutation()

  const [selectedTaxBracket, setSelectedTaxBracket] = useState<
    SocialInsuranceTaxBracketAction | undefined
  >(undefined)

  // Sync selected value from server once loaded
  const effectiveTaxBracket = selectedTaxBracket ?? serverTaxBracket

  const taxBracketChanged =
    selectedTaxBracket !== undefined && selectedTaxBracket !== serverTaxBracket

  const handleSaveTaxBracket = async () => {
    if (!taxBracketChanged || !selectedTaxBracket) return
    try {
      await setTaxBracketMutation({
        variables: { taxBracket: selectedTaxBracket },
      })
      await refetchTaxBracket()
      setSelectedTaxBracket(undefined)
      toast.success(formatMessage(m.taxBracketSaveSuccess))
    } catch (e) {
      toast.error(formatMessage(m.taxBracketSaveError))
    }
  }

  return (
    <IntroWrapper
      title={formatMessage(m.personalTaxCredit)}
      intro={formatMessage(m.personalTaxCreditDescription)}
      serviceProviderSlug={TRYGGINGASTOFNUN_SLUG}
      serviceProviderTooltip={formatMessage(
        coreMessages.socialInsuranceTooltip,
      )}
    >
      {loading ? (
        <CardLoader />
      ) : error ? (
        <Problem error={error} noBorder={false} />
      ) : (
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

          <Box>
            {taxBracketQueryLoading && <CardLoader />}
            {taxBracketQueryError && (
              <Problem error={taxBracketQueryError} noBorder={false} />
            )}
            {!taxBracketQueryLoading && !taxBracketQueryError && (
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  columnGap={1}
                  marginBottom={3}
                >
                  <Text variant="h4">
                    {formatMessage(m.taxBracketSectionTitle)}
                  </Text>
                  <Tooltip
                    text={formatMessage(m.taxBracketSectionTooltip)}
                    variant="light"
                  />
                </Box>
                {effectiveTaxBracket === undefined ? (
                  <AlertMessage
                    type="info"
                    message={formatMessage(m.taxBracketNotAvailable)}
                  />
                ) : (
                  <Stack space={3}>
                    <RadioButton
                      id="tax-bracket-income-plan"
                      name="tax-bracket"
                      label={formatMessage(m.taxBracketIncomePlan)}
                      value={SocialInsuranceTaxBracketAction.IncomePlan}
                      checked={
                        effectiveTaxBracket ===
                        SocialInsuranceTaxBracketAction.IncomePlan
                      }
                      onChange={() =>
                        setSelectedTaxBracket(
                          SocialInsuranceTaxBracketAction.IncomePlan,
                        )
                      }
                    />
                    <RadioButton
                      id="tax-bracket-bracket1"
                      name="tax-bracket"
                      label={formatMessage(m.taxBracketBracket1)}
                      value={SocialInsuranceTaxBracketAction.Bracket1}
                      checked={
                        effectiveTaxBracket ===
                        SocialInsuranceTaxBracketAction.Bracket1
                      }
                      onChange={() =>
                        setSelectedTaxBracket(
                          SocialInsuranceTaxBracketAction.Bracket1,
                        )
                      }
                    />
                    <RadioButton
                      id="tax-bracket-bracket2"
                      name="tax-bracket"
                      label={formatMessage(m.taxBracketBracket2)}
                      value={SocialInsuranceTaxBracketAction.Bracket2}
                      checked={
                        effectiveTaxBracket ===
                        SocialInsuranceTaxBracketAction.Bracket2
                      }
                      onChange={() =>
                        setSelectedTaxBracket(
                          SocialInsuranceTaxBracketAction.Bracket2,
                        )
                      }
                    />
                    <Button
                      onClick={handleSaveTaxBracket}
                      loading={taxBracketSaving}
                      disabled={taxBracketSaving || !taxBracketChanged}
                      size="small"
                    >
                      {formatMessage(coreMessages.save)}
                    </Button>
                  </Stack>
                )}
              </>
            )}
          </Box>
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default PersonalTaxCredit
