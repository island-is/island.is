import { SocialInsuranceTaxCardAllowanceAction } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Input,
  Select,
  Stack,
  Table as T,
  Text,
  toast,
} from '@island.is/island-ui/core'
import NumberFormat from 'react-number-format'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  Tooltip,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useMemo, useState } from 'react'
import { m } from '../../lib/messages'
import {
  useGetPersonalTaxCreditQuery,
  useUpdateSocialInsuranceTaxCardAllowanceMutation,
  useSetSocialInsuranceSpouseTaxCardMutation,
  useSetSocialInsuranceSpouseTaxCardDueToDeathMutation,
} from './PersonalTaxCredit.generated'

type MyTaxCreditAction = 'register' | 'edit' | 'discontinue' | null

const PersonalTaxCredit = () => {
  useNamespaces('sp.social-insurance-maintenance')
  const { formatMessage, formatDate, lang } = useLocale()

  const [myAction, setMyAction] = useState<MyTaxCreditAction>(null)
  const [spouseDeceased, setSpouseDeceased] = useState(false)
  const [grantSpouse, setGrantSpouse] = useState(false)

  const [registerYear, setRegisterYear] = useState<number | null>(null)
  const [registerMonth, setRegisterMonth] = useState<number | null>(null)
  const [registerPercentage, setRegisterPercentage] = useState<string>('')

  const [editPercentage, setEditPercentage] = useState<string>('')

  const [discontinueYear, setDiscontinueYear] = useState<number | null>(null)
  const [discontinueMonth, setDiscontinueMonth] = useState<number | null>(null)

  const [spouseDeceasedYear, setSpouseDeceasedYear] = useState<number | null>(
    null,
  )
  const [spouseDeceasedMonth, setSpouseDeceasedMonth] = useState<number | null>(
    null,
  )
  const [spouseDeceasedPercentage, setSpouseDeceasedPercentage] =
    useState<string>('100')

  const { data, loading, error, refetch } = useGetPersonalTaxCreditQuery({
    errorPolicy: 'all',
  })

  const [updateAllowance, { loading: updatingAllowance }] =
    useUpdateSocialInsuranceTaxCardAllowanceMutation()
  const [setSpouseTaxCard, { loading: settingSpouseTaxCard }] =
    useSetSocialInsuranceSpouseTaxCardMutation()
  const [setSpouseTaxCardDueToDeath, { loading: settingSpouseDeceased }] =
    useSetSocialInsuranceSpouseTaxCardDueToDeathMutation()

  const page = data?.socialInsurancePersonalTaxCredit
  const isAlreadyRegistered = page?.canEdit ?? false
  const canDiscontinue = page?.canDiscontinue ?? false
  const spouseEligibility = page?.spouseEligibility
  const monthsAndYears = page?.registrationMonthsAndYears
  const discontinuingMonthsAndYears = page?.discontinuingMonthsAndYears

  const isSavingMyTaxCredit = updatingAllowance
  const isSavingSpouse = settingSpouseTaxCard || settingSpouseDeceased

  type YearMonthEntry = {
    year?: number | null
    months?: (number | null)[] | null
  }

  const toYearOptions = (data: YearMonthEntry[] | null | undefined) =>
    (data ?? []).map((ym) => ({
      label: String(ym.year),
      value: ym.year as number,
    }))

  const toMonthOptions = (
    data: YearMonthEntry[] | null | undefined,
    year: number | null,
  ) =>
    (data?.find((ym) => ym.year === year)?.months ?? [])
      .filter((month): month is number => month != null)
      .map((month) => ({
        label: new Intl.DateTimeFormat(lang, { month: 'long' }).format(
          new Date(2000, month - 1),
        ),
        value: month,
      }))

  const yearOptions = useMemo(
    () => toYearOptions(monthsAndYears),
    [monthsAndYears],
  )
  const registerMonthOptions = useMemo(
    () => toMonthOptions(monthsAndYears, registerYear),
    [monthsAndYears, registerYear, lang],
  )
  const discontinueYearOptions = useMemo(
    () => toYearOptions(discontinuingMonthsAndYears),
    [discontinuingMonthsAndYears],
  )
  const discontinueMonthOptions = useMemo(
    () => toMonthOptions(discontinuingMonthsAndYears, discontinueYear),
    [discontinuingMonthsAndYears, discontinueYear, lang],
  )

  const spouseYearOptions = useMemo(
    () =>
      (spouseEligibility?.allowedYearMonths ?? []).map((ym) => ({
        label: String(ym.year),
        value: ym.year as number,
      })),
    [spouseEligibility],
  )

  const spouseMonthOptions = useMemo(() => {
    const yearMonths = spouseEligibility?.allowedYearMonths?.find(
      (ym) => ym.year === spouseDeceasedYear,
    )
    return (yearMonths?.months ?? [])
      .filter((month): month is number => month != null)
      .map((month) => ({
        label: new Intl.DateTimeFormat(lang, { month: 'long' }).format(
          new Date(2000, month - 1),
        ),
        value: month,
      }))
  }, [spouseEligibility, spouseDeceasedYear, lang])

  const handleSaveMyTaxCredit = async () => {
    if (!myAction) return
    try {
      await updateAllowance({
        variables: {
          input: {
            action: {
              register: SocialInsuranceTaxCardAllowanceAction.REGISTER,
              edit: SocialInsuranceTaxCardAllowanceAction.EDIT,
              discontinue: SocialInsuranceTaxCardAllowanceAction.DISCONTINUE,
            }[myAction],
            year:
              myAction === 'register'
                ? registerYear ?? undefined
                : myAction === 'discontinue'
                ? discontinueYear ?? undefined
                : undefined,
            month:
              myAction === 'register'
                ? registerMonth ?? undefined
                : myAction === 'discontinue'
                ? discontinueMonth ?? undefined
                : undefined,
            percentage:
              myAction === 'register'
                ? registerPercentage
                  ? Number(registerPercentage)
                  : undefined
                : myAction === 'edit'
                ? editPercentage
                  ? Number(editPercentage)
                  : undefined
                : undefined,
          },
        },
      })
      setMyAction(null)
      setRegisterYear(null)
      setRegisterMonth(null)
      setRegisterPercentage('')
      setEditPercentage('')
      setDiscontinueYear(null)
      setDiscontinueMonth(null)
      toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
      refetch()
    } catch {
      toast.error(formatMessage(m.personalTaxCreditSaveError))
    }
  }

  const handleSaveSpouse = async () => {
    try {
      if (spouseDeceased) {
        await setSpouseTaxCardDueToDeath({
          variables: {
            input: {
              year: spouseDeceasedYear ?? undefined,
              month: spouseDeceasedMonth ?? undefined,
              percentage: spouseDeceasedPercentage
                ? Number(spouseDeceasedPercentage)
                : undefined,
            },
          },
        })
      }
      if (grantSpouse) {
        await setSpouseTaxCard()
      }
      setSpouseDeceased(false)
      setGrantSpouse(false)
      setSpouseDeceasedYear(null)
      setSpouseDeceasedMonth(null)
      setSpouseDeceasedPercentage('100')
      toast.success(formatMessage(m.personalTaxCreditSaveSuccess))
      refetch()
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
        {/* Tax cards table */}
        {!!page?.taxCards?.length && (
          <Box>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData box={{ background: 'blue100' }} scope="col">
                    <Text variant="medium" fontWeight="medium">
                      {formatMessage(m.type)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData box={{ background: 'blue100' }} scope="col">
                    <Text variant="medium" fontWeight="medium">
                      {formatMessage(m.dateFrom)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData box={{ background: 'blue100' }} scope="col">
                    <Text variant="medium" fontWeight="medium">
                      {formatMessage(m.dateTo)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData box={{ background: 'blue100' }} scope="col">
                    <Text variant="medium" fontWeight="medium">
                      {formatMessage(m.percentage)}
                    </Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {page.taxCards.map((card, idx) => (
                  <T.Row key={idx}>
                    <T.Data>{card.taxCardType ?? '-'}</T.Data>
                    <T.Data>
                      {card.validFrom
                        ? formatDate(card.validFrom, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                        : '-'}
                    </T.Data>
                    <T.Data>
                      {card.validTo
                        ? formatDate(card.validTo, {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                        : '-'}
                    </T.Data>
                    <T.Data>
                      {card.percentage != null ? `${card.percentage}%` : '-'}
                    </T.Data>
                  </T.Row>
                ))}
              </T.Body>
            </T.Table>
          </Box>
        )}

        {!page?.taxCards?.length && (
          <AlertMessage
            type="info"
            message={formatMessage(m.personalTaxCreditNotRegistered)}
          />
        )}

        {/* My personal tax credit */}
        <Box>
          <Text variant="h4" marginBottom={3}>
            {formatMessage(m.myPersonalTaxCredit)}
          </Text>

          <Stack space={3}>
            <Checkbox
              id="register-personal-tax-credit"
              label={formatMessage(m.registerPersonalTaxCredit)}
              checked={myAction === 'register'}
              disabled={isAlreadyRegistered}
              onChange={(e) =>
                setMyAction(e.target.checked ? 'register' : null)
              }
            />
            {myAction === 'register' && (
              <Box paddingLeft={7}>
                <Box style={{ maxWidth: 480 }}>
                  <Stack space={3}>
                    <Box display="flex" columnGap={3} alignItems="flexEnd">
                      <Box style={{ flex: 1 }}>
                        <Select
                          name="register-year"
                          label={formatMessage(m.fromWhatTime)}
                          placeholder={formatMessage(m.theYear)}
                          size="xs"
                          backgroundColor="blue"
                          options={yearOptions}
                          value={
                            registerYear != null
                              ? yearOptions.find(
                                  (o) => o.value === registerYear,
                                )
                              : null
                          }
                          onChange={(opt) => {
                            setRegisterYear(opt ? (opt.value as number) : null)
                            setRegisterMonth(null)
                          }}
                          required
                        />
                      </Box>
                      <Box style={{ flex: 1 }}>
                        <Select
                          name="register-month"
                          label=""
                          placeholder={formatMessage(m.month)}
                          size="xs"
                          backgroundColor="blue"
                          options={registerMonthOptions}
                          value={
                            registerMonth != null
                              ? registerMonthOptions.find(
                                  (o) => o.value === registerMonth,
                                )
                              : null
                          }
                          onChange={(opt) =>
                            setRegisterMonth(opt ? (opt.value as number) : null)
                          }
                          isDisabled={registerYear == null}
                        />
                      </Box>
                    </Box>
                    <NumberFormat
                      customInput={Input}
                      id="register-percentage"
                      name="register-percentage"
                      label={formatMessage(m.percentageFromNextMonth)}
                      placeholder="100%"
                      size="xs"
                      backgroundColor="blue"
                      suffix="%"
                      allowNegative={false}
                      isAllowed={({ floatValue }) =>
                        floatValue === undefined ||
                        (floatValue >= 0 && floatValue <= 100)
                      }
                      value={registerPercentage}
                      onValueChange={({ value }) =>
                        setRegisterPercentage(value)
                      }
                      required
                    />
                  </Stack>
                </Box>
              </Box>
            )}

            <Checkbox
              id="edit-personal-tax-credit"
              label={formatMessage(m.editPersonalTaxCredit)}
              checked={myAction === 'edit'}
              disabled={!isAlreadyRegistered}
              onChange={(e) => setMyAction(e.target.checked ? 'edit' : null)}
            />
            {myAction === 'edit' && (
              <Box paddingLeft={7}>
                <Box style={{ maxWidth: 480 }}>
                  <NumberFormat
                    customInput={Input}
                    id="edit-percentage"
                    name="edit-percentage"
                    label={formatMessage(m.percentageFromNextMonth)}
                    placeholder="100%"
                    size="xs"
                    backgroundColor="blue"
                    suffix="%"
                    allowNegative={false}
                    isAllowed={({ floatValue }) =>
                      floatValue === undefined ||
                      (floatValue >= 0 && floatValue <= 100)
                    }
                    value={editPercentage}
                    onValueChange={({ value }) => setEditPercentage(value)}
                    disabled={!isAlreadyRegistered}
                  />
                </Box>
              </Box>
            )}

            <Checkbox
              id="discontinue-personal-tax-credit"
              label={formatMessage(m.discontinuePersonalTaxCredit)}
              checked={myAction === 'discontinue'}
              disabled={!canDiscontinue}
              onChange={(e) =>
                setMyAction(e.target.checked ? 'discontinue' : null)
              }
            />
            {myAction === 'discontinue' && (
              <Box paddingLeft={7}>
                <Box style={{ maxWidth: 480 }}>
                  <Box display="flex" columnGap={3} alignItems="flexEnd">
                    <Box style={{ flex: 1 }}>
                      <Select
                        name="discontinue-year"
                        label={formatMessage(m.fromWhatTime)}
                        placeholder={formatMessage(m.theYear)}
                        size="xs"
                        backgroundColor="blue"
                        options={discontinueYearOptions}
                        value={
                          discontinueYear != null
                            ? discontinueYearOptions.find(
                                (o) => o.value === discontinueYear,
                              )
                            : null
                        }
                        onChange={(opt) => {
                          setDiscontinueYear(opt ? (opt.value as number) : null)
                          setDiscontinueMonth(null)
                        }}
                        isDisabled={!canDiscontinue}
                      />
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <Select
                        name="discontinue-month"
                        label=""
                        placeholder={formatMessage(m.month)}
                        size="xs"
                        backgroundColor="blue"
                        options={discontinueMonthOptions}
                        value={
                          discontinueMonth != null
                            ? discontinueMonthOptions.find(
                                (o) => o.value === discontinueMonth,
                              )
                            : null
                        }
                        onChange={(opt) =>
                          setDiscontinueMonth(
                            opt ? (opt.value as number) : null,
                          )
                        }
                        isDisabled={!canDiscontinue || discontinueYear == null}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Stack>

          <Box marginTop={3}>
            <Button
              onClick={handleSaveMyTaxCredit}
              disabled={
                !myAction ||
                isSavingMyTaxCredit ||
                (myAction === 'register' && isAlreadyRegistered) ||
                (myAction === 'edit' && !isAlreadyRegistered) ||
                (myAction === 'discontinue' && !canDiscontinue)
              }
              loading={isSavingMyTaxCredit}
              size="small"
            >
              {formatMessage(coreMessages.save)}
            </Button>
          </Box>
        </Box>

        {/* Spouse personal tax credit */}
        <Box>
          <Text variant="h4" marginBottom={3}>
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
            {spouseDeceased && (
              <Box paddingLeft={7}>
                <Box style={{ maxWidth: 480 }}>
                  <Stack space={3}>
                    <Text>{formatMessage(m.spouseDeceasedInfo)}</Text>
                    {spouseEligibility?.reasonNotAllowed ? (
                      <AlertMessage
                        type="warning"
                        message={spouseEligibility.reasonNotAllowed}
                      />
                    ) : (
                      <>
                        <Box display="flex" columnGap={3} alignItems="flexEnd">
                          <Box style={{ flex: 1 }}>
                            <Select
                              name="spouse-deceased-year"
                              label={formatMessage(m.fromWhatTime)}
                              placeholder={formatMessage(m.theYear)}
                              size="xs"
                              backgroundColor="blue"
                              options={spouseYearOptions}
                              value={
                                spouseDeceasedYear != null
                                  ? spouseYearOptions.find(
                                      (o) => o.value === spouseDeceasedYear,
                                    )
                                  : null
                              }
                              onChange={(opt) => {
                                setSpouseDeceasedYear(
                                  opt ? (opt.value as number) : null,
                                )
                                setSpouseDeceasedMonth(null)
                              }}
                              isDisabled={!spouseEligibility?.canApply}
                            />
                          </Box>
                          <Box style={{ flex: 1 }}>
                            <Select
                              name="spouse-deceased-month"
                              label=""
                              placeholder={formatMessage(m.month)}
                              size="xs"
                              backgroundColor="blue"
                              options={spouseMonthOptions}
                              value={
                                spouseDeceasedMonth != null
                                  ? spouseMonthOptions.find(
                                      (o) => o.value === spouseDeceasedMonth,
                                    )
                                  : null
                              }
                              onChange={(opt) =>
                                setSpouseDeceasedMonth(
                                  opt ? (opt.value as number) : null,
                                )
                              }
                              isDisabled={
                                !spouseEligibility?.canApply ||
                                spouseDeceasedYear == null
                              }
                            />
                          </Box>
                        </Box>
                        <NumberFormat
                          customInput={Input}
                          id="spouse-deceased-percentage"
                          name="spouse-deceased-percentage"
                          label={formatMessage(m.percentageFromNextMonth)}
                          placeholder="100%"
                          size="xs"
                          backgroundColor="blue"
                          suffix="%"
                          allowNegative={false}
                          isAllowed={({ floatValue }) =>
                            floatValue === undefined ||
                            (floatValue >= 0 && floatValue <= 100)
                          }
                          value={spouseDeceasedPercentage}
                          onValueChange={({ value }) =>
                            setSpouseDeceasedPercentage(value)
                          }
                          disabled={!spouseEligibility?.canApply}
                        />
                      </>
                    )}
                  </Stack>
                </Box>
              </Box>
            )}
            <Checkbox
              id="grant-spouse-tax-credit"
              label={
                <>
                  {formatMessage(m.grantSpouseTaxCredit)}{' '}
                  <Tooltip
                    text={formatMessage(m.grantSpouseTaxCreditInfo)}
                    variant="light"
                    placement="right"
                  />
                </>
              }
              checked={grantSpouse}
              onChange={(e) => setGrantSpouse(e.target.checked)}
            />
          </Stack>
          <Box marginTop={3}>
            <Button
              onClick={handleSaveSpouse}
              disabled={(!spouseDeceased && !grantSpouse) || isSavingSpouse}
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
      </Stack>
    </IntroWrapper>
  )
}

export default PersonalTaxCredit
