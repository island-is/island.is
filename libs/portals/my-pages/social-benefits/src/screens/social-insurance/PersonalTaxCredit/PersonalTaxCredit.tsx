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
import { Problem } from '@island.is/react-spa/shared'
import { m } from '../../../lib/messages'
import {
  useGetPersonalTaxCreditQuery,
  useGetPersonalTaxCreditSpouseInfoQuery,
} from './PersonalTaxCredit.generated'
import { useTaxCardAllowance } from './useTaxCardAllowance'
import { MyTaxCreditForm } from './components/MyTaxCreditForm'
import { SpouseTaxCreditForm } from './components/SpouseTaxCreditForm'
import { PersonalTaxCreditTable } from './components/PersonalTaxCreditTable'
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
  const [isEditing, setIsEditing] = useState(false)

  const taxCardAllowance = useTaxCardAllowance()

  const page = data?.socialInsurancePersonalTaxCredit
  const spouseInfo = spouseInfoData?.socialInsurancePersonalTaxCreditSpouseInfo
  const isAlreadyRegistered = page?.canEdit ?? false
  const hasRegistrations = !!page?.taxCards?.length

  const showEditForm = isEditing || !isAlreadyRegistered

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setMyTaxCredit(INITIAL_MY_TAX_CREDIT)
    setSpouseTaxCredit(INITIAL_SPOUSE_TAX_CREDIT)
  }

  const handleSave = async () => {
    try {
      await taxCardAllowance.save(myTaxCredit, spouseTaxCredit)
      setRefetching(true)
      await refetch()
      setRefetching(false)
      setMyTaxCredit(INITIAL_MY_TAX_CREDIT)
      setSpouseTaxCredit(INITIAL_SPOUSE_TAX_CREDIT)
      setIsEditing(false)
      toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
    } catch (e) {
      setRefetching(false)
      toast.error(formatMessage(m.personalTaxCreditSaveError))
    }
  }

  const saving = taxCardAllowance.loading || refetching
  const canSubmit =
    hasAnyChanges(myTaxCredit, spouseTaxCredit) &&
    isMyTaxCreditValid(myTaxCredit) &&
    isSpouseTaxCreditValid(spouseTaxCredit)

  const spouseHasGrantedCard = page?.taxCards?.some(
    (c) => c.type === 'SPOUSE_TAX_ALLOWANCE',
  )
  const userIsUsingSpouseCard = page?.taxCards?.some(
    (c) => c.type === 'REGARDING_THE_ESTATE',
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
          {/* Nýting persónuafsláttar */}
          <Box>
            <Text variant="h4" marginBottom={3}>
              {formatMessage(m.myTaxCreditUsage)}
            </Text>

            {hasRegistrations && (
              <PersonalTaxCreditTable
                taxCards={page!.taxCards!}
                onEdit={showEditForm ? handleCancel : handleEdit}
                inlineContent={
                  showEditForm ? (
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
                            onClick={handleCancel}
                          >
                            {formatMessage(m.cancel)}
                          </Button>
                          <Button
                            variant="primary"
                            size="small"
                            onClick={handleSave}
                            disabled={!canSubmit || saving}
                            loading={saving}
                          >
                            {formatMessage(coreMessages.save)}
                          </Button>
                        </Inline>
                      </Stack>
                    </Box>
                  ) : undefined
                }
              />
            )}

            {showEditForm && !hasRegistrations && (
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

          {/* Persónuafsláttur maka */}
          <Box>
            <Text variant="h4" marginBottom={1}>
              {formatMessage(m.spousePersonalTaxCredit)}
            </Text>
            <Text marginBottom={3}>
              {formatMessage(m.spousePersonalTaxCreditDescription)}
            </Text>

            {/* Read-only summary when registered and not editing */}
            {hasRegistrations && !showEditForm && (
              <>
                {spouseHasGrantedCard && (
                  <Box
                    border="standard"
                    borderRadius="large"
                    padding={3}
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="center"
                  >
                    <Box>
                      <Text fontWeight="semiBold">
                        {formatMessage(m.spouseTaxCreditUsingSummaryTitle)}
                      </Text>
                      <Text>
                        {formatMessage(m.spouseTaxCreditUsingSummaryBody)}
                      </Text>
                    </Box>
                    <Button variant="text" onClick={handleEdit}>
                      {formatMessage(m.edit)}
                    </Button>
                  </Box>
                )}
                {userIsUsingSpouseCard && spouseInfo && (
                  <Box
                    border="standard"
                    borderRadius="large"
                    padding={3}
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="center"
                  >
                    <Box>
                      <Text fontWeight="semiBold">
                        {formatMessage(m.youAreUsingSpouseTaxCreditTitle)}
                      </Text>
                      {spouseInfo.name && <Text>{spouseInfo.name}</Text>}
                    </Box>
                    <Button variant="text" onClick={handleEdit}>
                      {formatMessage(m.edit)}
                    </Button>
                  </Box>
                )}
                {!spouseHasGrantedCard && !userIsUsingSpouseCard && (
                  <SpouseTaxCreditForm
                    state={spouseTaxCredit}
                    setState={setSpouseTaxCredit}
                    monthsAndYears={page?.registrationMonthsAndYears}
                    spouseName={spouseInfo?.name}
                    spouseNationalId={spouseInfo?.nationalId}
                    spouseIsDeceased={spouseInfo?.isDeceased}
                  />
                )}
              </>
            )}

            {/* Edit form for spouse section */}
            {showEditForm && (
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

          {/* Bottom action buttons - only for initial registration (no existing cards) */}
          {showEditForm && !hasRegistrations && (
            <Box display="flex" justifyContent="flexEnd">
              <Inline space={2}>
                <Button
                  onClick={handleSave}
                  disabled={!canSubmit || saving}
                  loading={saving}
                >
                  {formatMessage(m.confirm)}
                </Button>
              </Inline>
            </Box>
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default PersonalTaxCredit
