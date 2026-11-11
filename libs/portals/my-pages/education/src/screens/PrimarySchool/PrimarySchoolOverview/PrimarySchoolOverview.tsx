import { CardLoader, m } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Stack } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'
import { useParams } from 'react-router-dom'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import { usePrimarySchoolStudentOverviewQuery } from './PrimarySchoolStudentOverview.generated'
import {
  usePrimarySchoolKeyInfo,
  type KeyInfoSectionName,
} from './keyInfo/usePrimarySchoolKeyInfo'
import { SectionError } from './keyInfo/SectionError'
import { BaseInfoSection } from './keyInfo/BaseInfoSection'
import { EmergencyContactsSection } from './keyInfo/EmergencyContactsSection'
import { LanguageProfileSection } from './keyInfo/LanguageProfileSection'
import { HealthProfileSection } from './keyInfo/HealthProfileSection'

const KEY_INFO_SECTIONS: KeyInfoSectionName[] = [
  'emergencyContacts',
  'languageProfile',
  'healthProfile',
]

export const PrimarySchoolOverview = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()

  const { data, loading, error } = usePrimarySchoolStudentOverviewQuery({
    variables: { studentId: studentId ?? '' },
    skip: !studentId,
  })

  const student = data?.primarySchoolStudent

  const { value: keyInfoEnabled, loading: keyInfoFlagLoading } = useFeatureFlag(
    Features.isServicePortalPrimarySchoolKeyInfoEnabled,
    false,
  )

  const {
    hasKeyInfo,
    loading: keyInfoLoading,
    error: keyInfoError,
    emergencyContacts,
    languageProfile,
    healthProfile,
    removeAgent,
    saving,
  } = usePrimarySchoolKeyInfo(
    studentId,
    keyInfoEnabled ? KEY_INFO_SECTIONS : [],
  )

  // `hasKeyInfo` keeps its last known answer when a read fails (see the
  // EducationPrimarySchoolStudent type policy in the my-pages Apollo client),
  // so the error is what decides here.
  const showKeyInfo = hasKeyInfo && !keyInfoError && !keyInfoLoading

  return (
    <>
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && !student && (
        <Box marginTop={8}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(psm.assessmentNoData)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      )}
      {!loading && !error && student && (
        <Stack space={10}>
          <BaseInfoSection student={student} loading={loading} />

          {(keyInfoFlagLoading || keyInfoLoading) && <CardLoader />}

          {!keyInfoLoading && keyInfoError && (
            <SectionError error={keyInfoError} />
          )}

          {showKeyInfo && (
            <EmergencyContactsSection
              contacts={emergencyContacts.data}
              loading={emergencyContacts.loading}
              error={emergencyContacts.error}
              saving={saving}
              onRemove={removeAgent}
            />
          )}

          {showKeyInfo && (
            <LanguageProfileSection
              profile={languageProfile.data}
              loading={languageProfile.loading}
              error={languageProfile.error}
            />
          )}

          {showKeyInfo && (
            <HealthProfileSection
              profile={healthProfile.data}
              loading={healthProfile.loading}
              error={healthProfile.error}
            />
          )}
        </Stack>
      )}
    </>
  )
}

export default PrimarySchoolOverview
