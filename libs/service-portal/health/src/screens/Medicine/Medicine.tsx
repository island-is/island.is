import { useLocale, useNamespaces } from '@island.is/localization'
import {
  AlertMessage,
  Box,
  Button,
  LinkV2,
  Select,
  SkeletonLoader,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { messages } from '../../lib/messages'
import {
  useGetDrugsBillsQuery,
  useGetDrugsDataQuery,
} from './Medicine.generated'
import { UserInfoLine, m } from '@island.is/service-portal/core'
import { useEffect, useState } from 'react'
import { RightsPortalDrugsPaymentPeroids } from '@island.is/api/schema'

enum MedicineTabs {
  PURCHASE = 'lyfjakaup',
  CALCULATOR = 'reiknivel',
  LICENSE = 'skirteini',
}

const SECTION_GAP = 5
const CONTENT_GAP = 2

const DATE_FORMAT = 'dd.MM.yyyy'

const Medicine = () => {
  useNamespaces('sp.health')

  const { formatMessage } = useLocale()
  const { formatDateFns } = useLocale()
  const [selectedTab, setSelectedTab] = useState<MedicineTabs>(
    MedicineTabs.PURCHASE,
  )
  const [selectedPeriod, setSelectedPeriod] =
    useState<RightsPortalDrugsPaymentPeroids | null>(null)
  const formatDatePeriod = (dateFrom: Date, dateTo: Date) => {
    if (!dateFrom || !dateTo) return ''
    return `${formatDateFns(dateFrom, DATE_FORMAT)} - ${formatDateFns(
      dateTo,
      DATE_FORMAT,
    )}`
  }

  const { data, loading, error } = useGetDrugsDataQuery()

  const {
    data: bills,
    loading: billsLoading,
    error: billsError,
  } = useGetDrugsBillsQuery({
    variables: {
      input: {
        paymentPeriodId: selectedPeriod?.id ?? '',
      },
    },
  })

  useEffect(() => {
    if (data) {
      const firstItem = data?.rightsPortalDrugsPaymentPeroids[0]
      if (firstItem) setSelectedPeriod(firstItem)
    }
  }, [data])

  if (loading) {
    return (
      <SkeletonLoader repeat={3} borderRadius="large" space={1} height={24} />
    )
  }

  if (error) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(m.errorTitle)}
        message={formatMessage(m.errorFetch)}
      />
    )
  }

  const tabs = [
    {
      id: MedicineTabs.PURCHASE,
      label: formatMessage(messages.medicinePurchaseTitle),
      content: (
        <Box paddingY={4}>
          <Box marginBottom={SECTION_GAP}>
            <Text marginBottom={CONTENT_GAP} variant="h5">
              {formatMessage(messages.medicinePurchaseIntroTitle)}
            </Text>
            <Text>{formatMessage(messages.medicinePurchaseIntroText)}</Text>
          </Box>
          {data?.rightsPortalDrugsPaymentPeroids?.length && (
            <Box display="flex" flexDirection="column">
              <Box marginBottom={1}>
                <Text color="blue400" variant="eyebrow" as="h3">
                  {formatMessage(messages.medicinePaymentPeriod)}
                </Text>
              </Box>
              <Box
                display="flex"
                marginBottom={CONTENT_GAP}
                justifyContent="flexStart"
              >
                <Select
                  name="paymentPeroid"
                  size="sm"
                  options={data.rightsPortalDrugsPaymentPeroids.map(
                    (period) => ({
                      label: formatDatePeriod(period.dateFrom, period.dateTo),
                      value: period.id,
                    }),
                  )}
                  value={
                    selectedPeriod &&
                    selectedPeriod?.id &&
                    selectedPeriod?.dateFrom &&
                    selectedPeriod?.dateTo
                      ? {
                          label: formatDatePeriod(
                            selectedPeriod.dateFrom,
                            selectedPeriod.dateTo,
                          ),
                          value: selectedPeriod.id,
                        }
                      : undefined
                  }
                  onChange={(option) =>
                    setSelectedPeriod(
                      data.rightsPortalDrugsPaymentPeroids.find(
                        (period) => period.id === option?.value,
                      ) ?? null,
                    )
                  }
                />
              </Box>
              <Box
                borderBottomWidth="standard"
                marginBottom={SECTION_GAP}
                borderColor="blue200"
              >
                <Text variant="eyebrow" color="purple600" marginBottom={1}>
                  {formatMessage(messages.periodStatus)}
                </Text>
                <Stack dividers="blueberry200" space={0}>
                  <UserInfoLine
                    paddingY={3}
                    label={formatMessage(messages.period)}
                    content={
                      formatDatePeriod(
                        selectedPeriod?.dateFrom,
                        selectedPeriod?.dateTo,
                      ) ?? ''
                    }
                  />
                  <UserInfoLine
                    paddingY={3}
                    label={formatMessage(messages.medicinePaymentStatus)}
                    content={formatMessage(messages.medicinePaymentPaidAmount, {
                      amount: selectedPeriod?.paidAmount,
                    })}
                  />
                  <UserInfoLine
                    paddingY={3}
                    label={formatMessage(messages.medicineStep)}
                    content={
                      formatMessage(messages.medicineStepStatus, {
                        step: selectedPeriod?.levelNumber,
                        ratio: selectedPeriod?.levelPercentage,
                      }) ?? ''
                    }
                  />
                </Stack>
              </Box>
            </Box>
          )}
          <Box
            marginBottom={SECTION_GAP}
            display="flex"
            justifyContent="flexStart"
            columnGap={2}
          >
            <Button variant="utility" icon="open" iconType="outline">
              <LinkV2 href="#">
                {formatMessage(messages.medicinePriceList)}
              </LinkV2>
            </Button>
            <Button
              variant="utility"
              onClick={() => setSelectedTab(MedicineTabs.CALCULATOR)} // Does not update the Tabs component internal state (useTabState).. needs further investigation
              icon="print"
              iconType="outline"
            >
              {formatMessage(messages.medicineCalculatorTitle)}
            </Button>
          </Box>
          <Box>
            <Text marginBottom={CONTENT_GAP} variant="h5">
              {formatMessage(messages.medicineBills)}
            </Text>
          </Box>
        </Box>
      ),
    },
    {
      id: MedicineTabs.CALCULATOR,
      label: formatMessage(messages.medicineCalculatorTitle),
      content: (
        <Box paddingY={4}>
          <Text marginBottom={CONTENT_GAP} variant="h5">
            {formatMessage(messages.medicineCalculatorIntroTitle)}
          </Text>
          <Text>{formatMessage(messages.medicineCalculatorIntroText)}</Text>
        </Box>
      ),
    },
    {
      id: MedicineTabs.LICENSE,
      label: formatMessage(messages.medicineLicenseTitle),
      content: (
        <Box paddingY={4}>
          <Text marginBottom={CONTENT_GAP} variant="h5">
            {formatMessage(messages.medicineLicenseIntroTitle)}
          </Text>
          <Text>{formatMessage(messages.medicineLicenseIntroText)}</Text>
        </Box>
      ),
    },
  ]

  return (
    <Box>
      <IntroHeader
        title={formatMessage(messages.medicineTitle)}
        intro={formatMessage(messages.medicineTitleIntro)}
      />
      <Tabs
        label={formatMessage(messages.chooseTherapy)}
        tabs={tabs}
        contentBackground="transparent"
        selected={selectedTab}
        size="xs"
        onChange={(id) => setSelectedTab(id as MedicineTabs)}
      />
    </Box>
  )
}

export default Medicine
