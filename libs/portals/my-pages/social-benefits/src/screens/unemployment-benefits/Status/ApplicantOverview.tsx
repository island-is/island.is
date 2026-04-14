import {
  Box,
  Button,
  Divider,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { UserInfoLine } from '@island.is/portals/my-pages/core'
import { useLocale } from '@island.is/localization'
import { useGetApplicantOverviewQuery } from './Status.generated'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { Problem } from '@island.is/react-spa/shared'

export const ApplicantOverview = () => {
  const { formatMessage, locale } = useLocale()
  const { data, loading, error } = useGetApplicantOverviewQuery({
    variables: { locale },
  })

  const overview = data?.vmstApplicantOverview

  const formatBoolean = (val?: boolean | null) =>
    val == null ? undefined : val ? formatMessage(um.yes) : formatMessage(um.no)

  const items: Array<{
    label: string
    value: string | JSX.Element | undefined
  }> = [
    {
      label: formatMessage(um.applicantPassCode),
      value: overview?.passCode ?? undefined,
    },
    {
      label: formatMessage(um.applicantPreferredJobs),
      value: overview?.preferredJobs?.join(', ') || undefined,
    },
    {
      label: formatMessage(um.applicantBankAccount),
      value: overview?.bankAccount ?? undefined,
    },
    {
      label: formatMessage(um.applicantUnion),
      value: overview?.union ?? undefined,
    },
    {
      label: formatMessage(um.applicantPensionFund),
      value: overview?.pensionFund ?? undefined,
    },
    {
      label: formatMessage(um.applicantUsedPersonalTaxCredit),
      value: overview?.usedPersonalTaxCredit?.toString() ?? undefined,
    },
    {
      label: formatMessage(um.applicantNumberOfChildren),
      value: overview?.numberOfChildren?.toString() ?? undefined,
    },
    {
      label: formatMessage(um.applicantEmploymentHistory),
      value: overview?.employmentHistory?.join(', ') || undefined,
    },
    {
      label: formatMessage(um.applicantEducationHistory),
      value: overview?.educationHistory?.join(', ') || undefined,
    },
    {
      label: formatMessage(um.applicantDrivingLicenses),
      value: overview?.drivingLicenses?.join(', ') || undefined,
    },
    {
      label: formatMessage(um.applicantLanguageAbilities),
      value:
        overview?.languageAbilities && overview.languageAbilities.length > 0 ? (
          <Stack space={1}>
            {overview.languageAbilities.map((l, i) => (
              <Text key={i}>
                {[l.name, l.proficiency].filter(Boolean).join(': ')}
              </Text>
            ))}
          </Stack>
        ) : undefined,
    },
    {
      label: formatMessage(um.applicantServiceArea),
      value: overview?.serviceArea ?? undefined,
    },
    {
      label: formatMessage(um.applicantCurrentAddressDifferent),
      value: formatBoolean(overview?.currentAddressDifferent),
    },
    {
      label: formatMessage(um.applicantSavedToEures),
      value: formatBoolean(overview?.savedToEures),
    },
  ]

  const visibleItems = items.filter(
    (item): item is { label: string; value: string | JSX.Element } =>
      !!item.value,
  )

  if (loading) {
    return (
      <Box paddingTop={4}>
        <SkeletonLoader repeat={5} space={2} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box marginTop={2}>
        <Problem error={error} noBorder={false} />
      </Box>
    )
  }

  return (
    <Box paddingTop={4}>
      <Box marginBottom={3} display="inlineBlock">
        <a
          href={formatMessage(um.applicantEditInfoUrl)}
          target="_blank"
          rel="noreferrer"
        >
          <Button
            as="span"
            unfocusable
            variant="utility"
            size="small"
            icon="pencil"
            iconType="outline"
          >
            {formatMessage(um.applicantEditInfo)}
          </Button>
        </a>
      </Box>
      <Stack space={0}>
        {visibleItems.map((item, index) => (
          <Box key={index}>
            <UserInfoLine
              label={item.label}
              content={item.value}
              labelColumnSpan={['12/12', '5/12', '5/12', '5/12', '4/12']}
              valueColumnSpan={['1/1', '7/12', '7/12', '7/12', '6/12']}
            />
            <Divider />
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
