import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { Button, Divider, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'
import { CardLoader, InfoLine } from '@island.is/portals/my-pages/core'
import { primarySchoolKeyInfoMessages as kim } from '../../../../lib/messages'
import { EducationPaths } from '../../../../lib/paths'
import { KeyInfoSection } from './KeyInfoSection'
import { SectionError } from './SectionError'
import type { LanguageProfile, MmsError } from './types'

interface Props {
  profile: LanguageProfile | undefined
  loading: boolean
  error: MmsError | undefined
}

/**
 * 2. Tungumálaumhverfi — GET/PATCH /me/children/{childId}/language-profile
 *
 * Read view per ticket: language environment, child's languages, preferred
 * language, interpreter, sign language. Editing lives on its own screen
 * (PrimarySchoolLanguageEdit) rather than an inline toggle.
 */
export const LanguageProfileSection = ({ profile, loading, error }: Props) => {
  const { formatMessage } = useLocale()
  const { sm } = useBreakpoint()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()

  const yesNo = (value: boolean) => formatMessage(value ? kim.yes : kim.no)

  const editPath = generatePath(EducationPaths.PrimarySchoolLanguageEdit, {
    studentId: studentId ?? '',
  })

  return (
    <KeyInfoSection
      title={kim.languageProfileTitle}
      action={
        !loading && !error ? (
          <Button
            variant="text"
            icon="pencil"
            size="small"
            onClick={() => navigate(editPath)}
          >
            {formatMessage(sm ? sharedMessages.edit : kim.languageEditTitle)}
          </Button>
        ) : undefined
      }
    >
      <Divider />
      {loading && <CardLoader />}
      {!loading && error && <SectionError error={error} />}
      {!loading && !error && (
        <>
          <InfoLine
            label={kim.languageEnvironment}
            content={profile?.languageEnvironmentLabel ?? undefined}
            paddingY={3}
          />
          <Divider />
          <InfoLine
            label={kim.childLanguages}
            // TODO(MMS v0.2): map ISO 639-1 codes to display names
            content={profile?.languages?.join(', ') || undefined}
            paddingY={3}
          />
          <Divider />

          <InfoLine
            label={kim.preferredLanguage}
            content={profile?.preferredLanguage ?? undefined}
            paddingY={3}
          />
          <Divider />

          <InfoLine
            label={kim.interpreter}
            content={profile ? yesNo(profile.interpreter) : undefined}
            paddingY={3}
          />
          <Divider />

          <InfoLine
            label={kim.signLanguage}
            content={profile ? yesNo(profile.signLanguage) : undefined}
            paddingY={3}
          />
          <Divider />
        </>
      )}
    </KeyInfoSection>
  )
}

export default LanguageProfileSection
