import { CardLoader, m } from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Stack } from '@island.is/island-ui/core'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { primarySchoolMessages as psm } from '../../../lib/messages'
import { usePrimarySchoolStudentOverviewQuery } from './PrimarySchoolStudentOverview.generated'
import { usePrimarySchoolKeyInfo } from './keyInfo/usePrimarySchoolKeyInfo'
import { USE_MOCK_KEY_INFO, mockStudent } from './keyInfo/mockData'
import { BaseInfoSection } from './keyInfo/BaseInfoSection'
import { EmergencyContactsSection } from './keyInfo/EmergencyContactsSection'
import { LanguageProfileSection } from './keyInfo/LanguageProfileSection'
import { HealthProfileSection } from './keyInfo/HealthProfileSection'

export const PrimarySchoolOverview = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const { studentId } = useParams<{ studentId: string }>()

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = usePrimarySchoolStudentOverviewQuery({
    variables: { studentId: studentId ?? '' },
    skip: !studentId || USE_MOCK_KEY_INFO,
  })

  // DEV-ONLY mock override: bypass the (not-yet-existing) backend so the whole
  // page renders. Remove together with mockData.ts once MMS v0.2 lands.
  const loading = USE_MOCK_KEY_INFO ? false : queryLoading
  const error = USE_MOCK_KEY_INFO ? undefined : queryError
  const student = USE_MOCK_KEY_INFO ? mockStudent : data?.primarySchoolStudent

  // Lykilupplýsingar (key information) sections. Each section owns its own
  // loading/error/save state and PATCH — there is no shared page-level save.
  const {
    emergencyContacts,
    languageProfile,
    healthProfile,
    removeAgent,
    saving,
  } = usePrimarySchoolKeyInfo(studentId)

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

          <EmergencyContactsSection
            contacts={emergencyContacts.data}
            loading={emergencyContacts.loading}
            error={emergencyContacts.error}
            saving={saving}
            onRemove={removeAgent}
          />

          <LanguageProfileSection
            profile={languageProfile.data}
            loading={languageProfile.loading}
            error={languageProfile.error}
          />

          <HealthProfileSection
            profile={healthProfile.data}
            loading={healthProfile.loading}
            error={healthProfile.error}
          />
        </Stack>
      )}
    </>
  )
}

export default PrimarySchoolOverview
