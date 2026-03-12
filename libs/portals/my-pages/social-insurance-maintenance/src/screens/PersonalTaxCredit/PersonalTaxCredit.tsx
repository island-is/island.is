import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { m } from '../../lib/messages'
import {
  useGetPersonalTaxCreditQuery,
  useSetSocialInsuranceTaxCardAllowanceMutation,
  useEditSocialInsuranceTaxCardAllowanceMutation,
  useDiscontinueSocialInsuranceTaxCardAllowanceMutation,
  useSetSocialInsuranceSpouseTaxCardMutation,
  useSetSocialInsuranceSpouseTaxCardDueToDeathMutation,
} from './PersonalTaxCredit.generated'
import { toast } from '@island.is/island-ui/core'

type MyTaxCreditAction = 'register' | 'edit' | 'discontinue' | null
type TaxBracket = 'income-plan' | 'bracket-1' | 'bracket-2'

const PersonalTaxCredit = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const [myAction, setMyAction] = useState<MyTaxCreditAction>(null)
  const [spouseDeceased, setSpouseDeceased] = useState(false)
  const [grantSpouse, setGrantSpouse] = useState(false)
  const [taxBracket, setTaxBracket] = useState<TaxBracket>('income-plan')

  const { data, loading, error } = useGetPersonalTaxCreditQuery()

  const [setAllowance, { loading: settingAllowance }] =
    useSetSocialInsuranceTaxCardAllowanceMutation()
  const [editAllowance, { loading: editingAllowance }] =
    useEditSocialInsuranceTaxCardAllowanceMutation()
  const [discontinueAllowance, { loading: discontinuingAllowance }] =
    useDiscontinueSocialInsuranceTaxCardAllowanceMutation()
  const [setSpouseTaxCard, { loading: settingSpouseTaxCard }] =
    useSetSocialInsuranceSpouseTaxCardMutation()
  const [setSpouseTaxCardDueToDeath, { loading: settingSpouseDeceased }] =
    useSetSocialInsuranceSpouseTaxCardDueToDeathMutation()

  const taxCards = data?.socialInsuranceTaxCards
  const canRegister = taxCards?.canRegisterPersonalAllowance ?? false
  const spouseEligibility = data?.socialInsuranceSpouseDeceasedTaxAllowanceEligibility

  const isSavingMyTaxCredit =
    settingAllowance || editingAllowance || discontinuingAllowance
  const isSavingSpouse = settingSpouseTaxCard || settingSpouseDeceased

  const handleSaveMyTaxCredit = async () => {
    try {
      if (myAction === 'register') {
        await setAllowance({ variables: { input: {} } })
      } else if (myAction === 'edit') {
        await editAllowance({ variables: { input: {} } })
      } else if (myAction === 'discontinue') {
        await discontinueAllowance({ variables: { input: {} } })
      }
      toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
    } catch {
      toast.error(formatMessage(m.personalTaxCreditSaveError))
    }
  }

  const handleSaveSpouse = async () => {
    try {
      if (spouseDeceased) {
        await setSpouseTaxCardDueToDeath({ variables: { input: {} } })
      }
      if (grantSpouse) {
        await setSpouseTaxCard({ variables: { input: {} } })
      }
      toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
    } catch {
      toast.error(formatMessage(m.personalTaxCreditSaveError))
    }
  }

  const handleSaveTaxBracket = async () => {
    const percentage =
      taxBracket === 'bracket-1'
        ? 3149
        : taxBracket === 'bracket-2'
        ? 3799
        : null

    try {
      await setAllowance({
        variables: { input: { percentage: percentage ?? undefined } },
      })
      toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
    } catch {
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
      <Box>
        <IntroWrapper {...introProps}>
          <CardLoader />
        </IntroWrapper>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <IntroWrapper {...introProps}>
          <Problem error={error} noBorder={false} />
        </IntroWrapper>
      </Box>
    )
  }

  return (
    <Box>
      <IntroWrapper {...introProps}>
        <Stack space={6}>
          {!taxCards?.taxCards?.length && (
            <AlertMessage
              type="info"
              message={formatMessage(m.personalTaxCreditNotRegistered)}
            />
          )}

          {/* My personal tax credit */}
          <Box>
            <Text variant="h3" marginBottom={3}>
              {formatMessage(m.myPersonalTaxCredit)}
            </Text>
            <Stack space={2}>
              <Checkbox
                id="register-personal-tax-credit"
                label={formatMessage(m.registerPersonalTaxCredit)}
                checked={myAction === 'register'}
                disabled={!canRegister}
                onChange={(e) =>
                  setMyAction(e.target.checked ? 'register' : null)
                }
              />
              <Checkbox
                id="edit-personal-tax-credit"
                label={formatMessage(m.editPersonalTaxCredit)}
                checked={myAction === 'edit'}
                disabled={canRegister}
                onChange={(e) =>
                  setMyAction(e.target.checked ? 'edit' : null)
                }
              />
              <Checkbox
                id="discontinue-personal-tax-credit"
                label={formatMessage(m.discontinuePersonalTaxCredit)}
                checked={myAction === 'discontinue'}
                disabled={canRegister}
                onChange={(e) =>
                  setMyAction(e.target.checked ? 'discontinue' : null)
                }
              />
            </Stack>
            <Box marginTop={3}>
              <Button
                onClick={handleSaveMyTaxCredit}
                disabled={!myAction || isSavingMyTaxCredit}
                loading={isSavingMyTaxCredit}
                size="small"
              >
                {formatMessage(coreMessages.save)}
              </Button>
            </Box>
          </Box>

          {/* Spouse personal tax credit */}
          <Box>
            <Text variant="h3" marginBottom={3}>
              {formatMessage(m.spousePersonalTaxCredit)}
            </Text>
            <Stack space={2}>
              <Checkbox
                id="spouse-deceased-tax-credit"
                label={formatMessage(m.spouseDeceasedTaxCredit)}
                checked={spouseDeceased}
                disabled={!spouseEligibility?.canApply}
                onChange={(e) => setSpouseDeceased(e.target.checked)}
              />
              <Checkbox
                id="grant-spouse-tax-credit"
                label={formatMessage(m.grantSpouseTaxCredit)}
                checked={grantSpouse}
                onChange={(e) => setGrantSpouse(e.target.checked)}
              />
            </Stack>
            <Box marginTop={3}>
              <Button
                onClick={handleSaveSpouse}
                disabled={
                  (!spouseDeceased && !grantSpouse) || isSavingSpouse
                }
                loading={isSavingSpouse}
                size="small"
              >
                {formatMessage(coreMessages.save)}
              </Button>
            </Box>
          </Box>

          {/* Tax bracket info */}
          <AlertMessage
            type="info"
            message={
              <Text as="span" variant="small" whiteSpace="preLine">
                {formatMessage(m.taxBracketInfo)}
              </Text>
            }
          />

          {/* Tax bracket selection */}
          <Box>
            <Text variant="h3" marginBottom={3}>
              {formatMessage(m.taxBracket)}
            </Text>
            <Stack space={2}>
              <RadioButton
                id="tax-bracket-income-plan"
                name="taxBracket"
                label={formatMessage(m.taxBracketFromIncomePlan)}
                value="income-plan"
                checked={taxBracket === 'income-plan'}
                onChange={() => setTaxBracket('income-plan')}
              />
              <RadioButton
                id="tax-bracket-1"
                name="taxBracket"
                label={formatMessage(m.taxBracket1)}
                value="bracket-1"
                checked={taxBracket === 'bracket-1'}
                onChange={() => setTaxBracket('bracket-1')}
              />
              <RadioButton
                id="tax-bracket-2"
                name="taxBracket"
                label={formatMessage(m.taxBracket2)}
                value="bracket-2"
                checked={taxBracket === 'bracket-2'}
                onChange={() => setTaxBracket('bracket-2')}
              />
            </Stack>
            <Box marginTop={3}>
              <Button
                onClick={handleSaveTaxBracket}
                loading={settingAllowance}
                size="small"
              >
                {formatMessage(coreMessages.save)}
              </Button>
            </Box>
          </Box>
        </Stack>
      </IntroWrapper>
    </Box>
  )
}

export default PersonalTaxCredit
