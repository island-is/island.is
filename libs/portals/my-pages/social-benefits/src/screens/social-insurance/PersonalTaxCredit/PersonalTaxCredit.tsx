import {
  Box,
  Button,
  Inline,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
  TRYGGINGASTOFNUN_SLUG,
} from '@island.is/portals/my-pages/core'
import { SocialInsuranceTaxCardType } from '@island.is/api/schema'
import { Problem } from '@island.is/react-spa/shared'
import { m } from '../../../lib/messages'
import {
  useGetPersonalTaxCreditQuery,
  useGetPersonalTaxCreditSpouseInfoQuery,
} from './PersonalTaxCredit.generated'
import { useTaxCardAllowance } from './useTaxCardAllowance'
import { MyTaxCreditForm } from './MyTaxCreditForm'
import { SpouseTaxCreditForm } from './SpouseTaxCreditForm'
import { PersonalTaxCreditTable } from './PersonalTaxCreditTable'
import { useState } from 'react'

const INITIAL_MY_TAX_CREDIT: MyTaxCreditState = { action: null }
const INITIAL_SPOUSE_TAX_CREDIT: SpouseTaxCreditState = { action: null }

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

export type SpouseTaxCreditState =
  | {
      action: 'grant'
      data: { year: number | null; month: number | null; percentage: string }
    }
  | {
      action: 'deceased'
      data: { year: number | null; month: number | null; percentage: string }
    }
  | { action: null }

const isMyTaxCreditValid = (state: MyTaxCreditState): boolean => {
  if (state.action === 'register') {
    return !!(state.data.year && state.data.month && state.data.percentage)
  }
  if (state.action === 'update') {
    return !!state.data.percentage
  }
  if (state.action === 'discontinue') {
    return !!(state.data.year && state.data.month)
  }
  return true
}

const isSpouseTaxCreditValid = (state: SpouseTaxCreditState): boolean => {
  if (state.action === 'grant' || state.action === 'deceased') {
    return !!(state.data.year && state.data.month && state.data.percentage)
  }
  return true
}

const hasAnyChanges = (
  myState: MyTaxCreditState,
  spouseState: SpouseTaxCreditState,
) => myState.action !== null || spouseState.action !== null

const SpouseSummaryCard = ({
  heading,
  body,
  onEdit,
  editLabel,
}: {
  heading: string
  body?: string | null
  onEdit: () => void
  editLabel: string
}) => (
  <Box
    border="standard"
    borderRadius="large"
    padding={4}
    display="flex"
    justifyContent="spaceBetween"
    alignItems="center"
  >
    <Stack space={1}>
      <Text fontWeight="semiBold">{heading}</Text>
      {body && <Text>{body}</Text>}
    </Stack>
    <Button variant="text" size="small" icon="arrowForward" onClick={onEdit}>
      {editLabel}
    </Button>
  </Box>
)

const PersonalTaxCredit = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage } = useLocale()

  const [myTaxCredit, setMyTaxCredit] = useState<MyTaxCreditState>(
    INITIAL_MY_TAX_CREDIT,
  )
  const [spouseTaxCredit, setSpouseTaxCredit] = useState<SpouseTaxCreditState>(
    INITIAL_SPOUSE_TAX_CREDIT,
  )

  const { data, loading, error, refetch } = useGetPersonalTaxCreditQuery({
    errorPolicy: 'all',
  })
  const { data: spouseInfoData } = useGetPersonalTaxCreditSpouseInfoQuery({
    errorPolicy: 'all',
  })
  const [refetching, setRefetching] = useState(false)
  const [isEditingSpouse, setIsEditingSpouse] = useState(false)

  const taxCardAllowance = useTaxCardAllowance()

  const page = data?.socialInsurancePersonalTaxCredit
  const spouseInfo = spouseInfoData?.socialInsurancePersonalTaxCreditSpouseInfo
  const isAlreadyRegistered = page?.canEdit ?? false
  const hasRegistrations = !!page?.taxCards?.length

  const handleEditSpouse = () => {
    setIsEditingSpouse(true)
  }

  const handleCancel = () => {
    setIsEditingSpouse(false)
    setMyTaxCredit(INITIAL_MY_TAX_CREDIT)
    setSpouseTaxCredit(INITIAL_SPOUSE_TAX_CREDIT)
  }

  const handleSave = async (): Promise<boolean> => {
    try {
      await taxCardAllowance.save(myTaxCredit, spouseTaxCredit)
      setRefetching(true)
      await refetch()
      setRefetching(false)
      setMyTaxCredit(INITIAL_MY_TAX_CREDIT)
      setSpouseTaxCredit(INITIAL_SPOUSE_TAX_CREDIT)
      setIsEditingSpouse(false)
      toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
      return true
    } catch (e) {
      setRefetching(false)
      toast.error(formatMessage(m.personalTaxCreditSaveError))
      return false
    }
  }

  const saving = taxCardAllowance.loading || refetching
  const canSubmit =
    hasAnyChanges(myTaxCredit, spouseTaxCredit) &&
    isMyTaxCreditValid(myTaxCredit) &&
    isSpouseTaxCreditValid(spouseTaxCredit)

  const spouseHasGrantedCard = page?.taxCards?.some(
    (c) => c.type === SocialInsuranceTaxCardType.SPOUSE_TAX_ALLOWANCE_GRANTED,
  )
  const userIsUsingSpouseCard = page?.taxCards?.some(
    (c) => c.type === SocialInsuranceTaxCardType.SPOUSE_TAX_ALLOWANCE,
  )

  return (
    <IntroWrapper
      title={formatMessage(m.personalTaxCredit)}
      intro={formatMessage(m.personalTaxCreditDescription)}
      desktopContentSpan="10/12"
      serviceProvider={{
        slug: TRYGGINGASTOFNUN_SLUG,
        tooltip: formatMessage(coreMessages.socialInsuranceTooltip),
      }}
      buttonGroup={{
        actions: [
          <LinkButton
            key="my-info-settings"
            to="/min-gogn/stillingar/"
            text={formatMessage(coreMessages.userInfo)}
            variant="utility"
            icon="arrowForward"
            size="small"
          />,
        ],
      }}
    >
      {loading ? (
        <CardLoader />
      ) : error ? (
        <Problem error={error} noBorder={false} />
      ) : (
        <Stack space={6}>
          <Box>
            <Text variant="h4" marginBottom={3}>
              {formatMessage(m.myTaxCreditUsage)}
            </Text>

            {hasRegistrations && (
              <PersonalTaxCreditTable
                taxCards={page?.taxCards ?? []}
                renderExpandedRow={({ close }) => (
                  <Box paddingY={4} paddingX={4} background="blue100">
                    <Stack space={3}>
                      <MyTaxCreditForm
                        state={myTaxCredit}
                        setState={setMyTaxCredit}
                        monthsAndYears={page?.registrationMonthsAndYears}
                        discontinuingMonthsAndYears={
                          page?.discontinuingMonthsAndYears
                        }
                        isAlreadyRegistered={isAlreadyRegistered}
                        canDiscontinue={page?.canDiscontinue ?? false}
                      />
                      <Inline space={2}>
                        <Button
                          variant="primary"
                          colorScheme="negative"
                          size="small"
                          onClick={() => {
                            handleCancel()
                            close()
                          }}
                        >
                          {formatMessage(coreMessages.buttonCancel)}
                        </Button>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={async () => {
                            const saved = await handleSave()
                            if (saved) close()
                          }}
                          disabled={!canSubmit || saving}
                          loading={saving}
                        >
                          {formatMessage(coreMessages.submit)}
                        </Button>
                      </Inline>
                    </Stack>
                  </Box>
                )}
              />
            )}

            {!isAlreadyRegistered && (
              <MyTaxCreditForm
                state={myTaxCredit}
                setState={setMyTaxCredit}
                monthsAndYears={page?.registrationMonthsAndYears}
                discontinuingMonthsAndYears={page?.discontinuingMonthsAndYears}
                isAlreadyRegistered={isAlreadyRegistered}
                canDiscontinue={page?.canDiscontinue ?? false}
              />
            )}
          </Box>

          <Box>
            <Text variant="h4" marginBottom={2}>
              {formatMessage(m.spousePersonalTaxCredit)}
            </Text>
            {(!hasRegistrations || isEditingSpouse) && (
              <Text marginBottom={3}>
                {formatMessage(m.spousePersonalTaxCreditDescription)}
              </Text>
            )}

            {hasRegistrations && !isEditingSpouse && (
              <SpouseSummaryCard
                heading={formatMessage(
                  spouseHasGrantedCard
                    ? m.spouseTaxCreditUsingSummaryTitle
                    : userIsUsingSpouseCard
                    ? m.youAreUsingSpouseTaxCreditTitle
                    : m.spousePersonalTaxCredit,
                )}
                body={
                  spouseHasGrantedCard
                    ? formatMessage(m.spouseTaxCreditUsingSummaryBody)
                    : userIsUsingSpouseCard
                    ? spouseInfo?.name
                    : formatMessage(m.spouseNoUsage)
                }
                onEdit={handleEditSpouse}
                editLabel={formatMessage(coreMessages.buttonEdit)}
              />
            )}

            {(isEditingSpouse || !hasRegistrations) && (
              <SpouseTaxCreditForm
                state={spouseTaxCredit}
                setState={setSpouseTaxCredit}
                monthsAndYears={page?.registrationMonthsAndYears}
                spouseName={spouseInfo?.name}
                spouseNationalId={spouseInfo?.nationalId}
                spouseIsDeceased={spouseInfo?.isDeceased}
              />
            )}
          </Box>

          {(!hasRegistrations ||
            isEditingSpouse ||
            spouseTaxCredit.action !== null) && (
            <Inline space={2} justifyContent="flexEnd">
              <Button variant="ghost" size="small" onClick={handleCancel}>
                {formatMessage(coreMessages.buttonCancel)}
              </Button>
              <Button
                size="small"
                onClick={handleSave}
                disabled={!canSubmit || saving}
                loading={saving}
              >
                {formatMessage(coreMessages.submit)}
              </Button>
            </Inline>
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default PersonalTaxCredit
