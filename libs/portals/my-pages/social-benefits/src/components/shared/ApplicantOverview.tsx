import {
  Box,
  Divider,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { UserInfoLine, LinkButton } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import type { ReactElement } from 'react'
import { sharedMessages as um } from '../../lib/messages/shared'
import {
  useGetApplicantOverviewQuery,
  GetApplicantOverviewQuery,
} from './ApplicantOverview.generated'

export type ApplicantOverviewField =
  | 'passCode'
  | 'preferredJobs'
  | 'bankAccount'
  | 'union'
  | 'pensionFund'
  | 'usedPersonalTaxCredit'
  | 'numberOfChildren'
  | 'employmentHistory'
  | 'educationHistory'
  | 'drivingLicenses'
  | 'languageAbilities'
  | 'serviceArea'
  | 'currentAddressDifferent'
  | 'savedToEures'

type Overview = GetApplicantOverviewQuery['vmstApplicantOverview'] | undefined

interface ApplicantOverviewProps {
  fields: ApplicantOverviewField[]
}

export const ApplicantOverview = ({ fields }: ApplicantOverviewProps) => {
  useNamespaces('sp.social-benefits-shared')
  const { formatMessage, locale } = useLocale()
  const { data, loading, error } = useGetApplicantOverviewQuery({
    variables: { locale },
  })

  const overview = data?.vmstApplicantOverview

  const formatBoolean = (val?: boolean | null) =>
    val == null ? undefined : val ? formatMessage(um.yes) : formatMessage(um.no)

  const buildItem = (
    field: ApplicantOverviewField,
    o: Overview,
  ): { label: string; value: string | ReactElement | undefined } => {
    switch (field) {
      case 'passCode':
        return {
          label: formatMessage(um.applicantPassCode),
          value: o?.passCode ?? undefined,
        }
      case 'preferredJobs':
        return {
          label: formatMessage(um.applicantPreferredJobs),
          value: o?.preferredJobs?.join(', ') || undefined,
        }
      case 'bankAccount':
        return {
          label: formatMessage(um.applicantBankAccount),
          value: o?.bankAccount ?? undefined,
        }
      case 'union':
        return {
          label: formatMessage(um.applicantUnion),
          value: o?.union ?? undefined,
        }
      case 'pensionFund':
        return {
          label: formatMessage(um.applicantPensionFund),
          value: o?.pensionFund ?? undefined,
        }
      case 'usedPersonalTaxCredit':
        return {
          label: formatMessage(um.applicantUsedPersonalTaxCredit),
          value: o?.usedPersonalTaxCredit?.toString() ?? undefined,
        }
      case 'numberOfChildren':
        return {
          label: formatMessage(um.applicantNumberOfChildren),
          value: o?.numberOfChildren?.toString() ?? undefined,
        }
      case 'employmentHistory':
        return {
          label: formatMessage(um.applicantEmploymentHistory),
          value: o?.employmentHistory?.join(', ') || undefined,
        }
      case 'educationHistory':
        return {
          label: formatMessage(um.applicantEducationHistory),
          value: o?.educationHistory?.join(', ') || undefined,
        }
      case 'drivingLicenses':
        return {
          label: formatMessage(um.applicantDrivingLicenses),
          value: o?.drivingLicenses?.join(', ') || undefined,
        }
      case 'languageAbilities':
        return {
          label: formatMessage(um.applicantLanguageAbilities),
          value:
            o?.languageAbilities && o.languageAbilities.length > 0 ? (
              <Stack space={1}>
                {o.languageAbilities.map((l, i) => (
                  <Text key={i}>
                    {[l.name, l.proficiency].filter(Boolean).join(': ')}
                  </Text>
                ))}
              </Stack>
            ) : undefined,
        }
      case 'serviceArea':
        return {
          label: formatMessage(um.applicantServiceArea),
          value: o?.serviceArea ?? undefined,
        }
      case 'currentAddressDifferent':
        return {
          label: formatMessage(um.applicantCurrentAddressDifferent),
          value: formatBoolean(o?.currentAddressDifferent),
        }
      case 'savedToEures':
        return {
          label: formatMessage(um.applicantSavedToEures),
          value: formatBoolean(o?.savedToEures),
        }
    }
  }

  const visibleItems = fields
    .map((field) => buildItem(field, overview))
    .filter(
      (item): item is { label: string; value: string | ReactElement } =>
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
        <LinkButton
          to={formatMessage(um.applicantEditInfoUrl)}
          variant="utility"
          text={formatMessage(um.applicantEditInfo)}
          size="small"
          icon="pencil"
        />
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
