import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { Button, Divider, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'
import { CardLoader, InfoLine } from '@island.is/portals/my-pages/core'
import { primarySchoolKeyInfoMessages as kim } from '../../../../lib/messages'
import { EducationPaths } from '../../../../lib/paths'
import { KeyInfoSection } from './KeyInfoSection'
import { SectionError } from './SectionError'
import { AllergyCategory } from './types'
import type { HealthProfile, MmsError } from './types'

interface Props {
  profile: HealthProfile | undefined
  loading: boolean
  error: MmsError | undefined
}

/**
 * 3. Heilsufarsupplýsingar — GET/PATCH /me/children/{childId}/health-profile
 *
 * Display rules (ticket §3): do not render empty allergy rows; the adrenaline
 * pen is only shown when at least one allergy exists; allergies are grouped from
 * `allergies[].type` into food / medicine / environmental.
 *
 * Editing lives on its own screen (PrimarySchoolHealthEdit) rather than an
 * inline toggle. Saving there stays disabled until MMS opens the health PATCH.
 */
export const HealthProfileSection = ({ profile, loading, error }: Props) => {
  const { formatMessage } = useLocale()
  const { sm } = useBreakpoint()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()

  const allergyLabels = (category: AllergyCategory) =>
    profile?.allergies
      ?.filter((a) => a.type === category)
      .map((a) => a.label)
      .join(', ')

  const foodAllergies = allergyLabels(AllergyCategory.Food)
  const medicineAllergies = allergyLabels(AllergyCategory.Medicine)
  const environmentalAllergies = allergyLabels(AllergyCategory.Environmental)
  const hasAnyAllergy = (profile?.allergies?.length ?? 0) > 0

  const editPath = generatePath(EducationPaths.PrimarySchoolHealthEdit, {
    studentId: studentId ?? '',
  })

  return (
    <KeyInfoSection
      title={kim.healthProfileTitle}
      action={
        !loading && !error ? (
          <Button
            variant="text"
            icon="pencil"
            size="small"
            onClick={() => navigate(editPath)}
          >
            {formatMessage(sm ? sharedMessages.edit : kim.healthEditTitle)}
          </Button>
        ) : undefined
      }
    >
      <Divider />
      {loading && <CardLoader />}
      {!loading && error && <SectionError error={error} />}
      {!loading && !error && (
        <>
          {foodAllergies && (
            <>
              <InfoLine
                label={kim.foodAllergies}
                content={foodAllergies}
                paddingY={3}
              />
              <Divider />
            </>
          )}
          {medicineAllergies && (
            <>
              <InfoLine
                label={kim.medicineAllergies}
                content={medicineAllergies}
                paddingY={3}
              />
              <Divider />
            </>
          )}
          {environmentalAllergies && (
            <>
              <InfoLine
                label={kim.environmentalAllergies}
                content={environmentalAllergies}
                paddingY={3}
              />
              <Divider />
            </>
          )}
          {hasAnyAllergy && (
            <>
              <InfoLine
                label={kim.epipen}
                content={formatMessage(profile?.epipen ? kim.yes : kim.no)}
                paddingY={3}
              />
              <Divider />
            </>
          )}
          <InfoLine
            label={kim.medicalDiagnoses}
            content={formatMessage(
              profile?.medicalDiagnoses ? kim.yes : kim.no,
            )}
            paddingY={3}
          />
          <Divider />
          <InfoLine
            label={kim.medicationAssistance}
            content={formatMessage(
              profile?.medicationAssistance ? kim.yes : kim.no,
            )}
            paddingY={3}
          />
          <Divider />
        </>
      )}
    </KeyInfoSection>
  )
}

export default HealthProfileSection
