import { useEffect, useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridRow,
  Select,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader } from '@island.is/portals/my-pages/core'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import { primarySchoolKeyInfoMessages as kim } from '../../../../../lib/messages'
import { EducationPaths } from '../../../../../lib/paths'
import { SectionError } from '../SectionError'
import { useLanguageEnvironmentOptions } from '../useKeyInfoOptions'
import { usePrimarySchoolKeyInfo } from '../usePrimarySchoolKeyInfo'

/**
 * Dedicated edit screen for Tungumálaumhverfi (language profile).
 * Save/cancel return to the overview.
 *
 * The language-environment options are loaded from MMS (Frigg) via
 * `friggOptions(type: languageEnvironment)` — the same source the
 * new-primary-school application uses. The child's languages / preferred
 * language come from the ISO 639-1 list (getAllLanguageCodes), not MMS.
 * TODO: Should the languages come from MMS as well, or is the ISO 639-1 list sufficient?
 *
 */
export const LanguageProfileEdit = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()
  const { languageProfile, saveLanguageProfile, saving } =
    usePrimarySchoolKeyInfo(studentId)
  const { data: profile, loading, error } = languageProfile

  const {
    options: languageEnvironmentOptions,
    loading: optionsLoading,
    error: optionsError,
  } = useLanguageEnvironmentOptions()

  const languageOptions = getAllLanguageCodes().map((language) => ({
    value: language.code,
    label: language.name,
  }))

  const [languageEnvironmentId, setLanguageEnvironmentId] = useState<
    string | undefined
  >(profile?.languageEnvironmentId)
  const [languages, setLanguages] = useState<string[]>(profile?.languages ?? [])
  const [preferredLanguage, setPreferredLanguage] = useState<
    string | undefined
  >(profile?.preferredLanguage)
  const [interpreter, setInterpreter] = useState<boolean>(
    profile?.interpreter ?? false,
  )
  const [signLanguage, setSignLanguage] = useState<boolean>(
    profile?.signLanguage ?? false,
  )

  // Prefill once the profile arrives from the data seam.
  useEffect(() => {
    setLanguageEnvironmentId(profile?.languageEnvironmentId)
    setLanguages(profile?.languages ?? [])
    setPreferredLanguage(profile?.preferredLanguage)
    setInterpreter(profile?.interpreter ?? false)
    setSignLanguage(profile?.signLanguage ?? false)
  }, [
    profile?.languageEnvironmentId,
    profile?.languages,
    profile?.preferredLanguage,
    profile?.interpreter,
    profile?.signLanguage,
  ])

  const overviewPath = generatePath(EducationPaths.PrimarySchoolOverview, {
    studentId: studentId ?? '',
  })

  const handleSave = async () => {
    try {
      await saveLanguageProfile({
        languageEnvironmentId,
        preferredLanguage,
        languages,
        interpreter,
        signLanguage,
      })
      toast.success(formatMessage(kim.saveSuccess))
      navigate(overviewPath)
    } catch {
      toast.error(formatMessage(kim.saveError))
    }
  }

  const selectedLanguageEnvironment =
    languageEnvironmentOptions.find(
      (option) => option.value === languageEnvironmentId,
    ) ?? null

  const selectedLanguages = languageOptions.filter((option) =>
    languages.includes(option.value),
  )
  const preferredLanguageOption =
    languageOptions.find((option) => option.value === preferredLanguage) ?? null

  return (
    <>
      {loading && <CardLoader />}
      {!loading && error && <SectionError error={error} />}
      {!loading && !error && (
        <Stack space={3}>
          <Box>
            <Text variant="small" fontWeight="semiBold" marginBottom={1}>
              {formatMessage(kim.languageEnvironment)}
            </Text>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '10/12']}>
                <Select
                  name="languageEnvironment"
                  size="sm"
                  isLoading={optionsLoading}
                  options={languageEnvironmentOptions}
                  value={selectedLanguageEnvironment}
                  onChange={(option) =>
                    setLanguageEnvironmentId(option?.value ?? undefined)
                  }
                />
              </GridColumn>
            </GridRow>
          </Box>
          {optionsError && (
            <SectionError error={{ message: optionsError.message }} />
          )}
          <Box>
            <Text variant="small" fontWeight="semiBold" marginBottom={1}>
              {formatMessage(kim.childLanguages)}
            </Text>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '10/12']}>
                <Select
                  name="languages"
                  size="sm"
                  isMulti
                  options={languageOptions}
                  value={selectedLanguages}
                  onChange={(selected) =>
                    setLanguages((selected ?? []).map((option) => option.value))
                  }
                />
              </GridColumn>
            </GridRow>
          </Box>
          <Box>
            <Text variant="small" fontWeight="semiBold" marginBottom={1}>
              {formatMessage(kim.preferredLanguage)}
            </Text>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '10/12']}>
                <Select
                  name="preferredLanguage"
                  size="sm"
                  isLoading={optionsLoading}
                  options={selectedLanguages}
                  value={preferredLanguageOption}
                  onChange={(option) =>
                    setPreferredLanguage(option?.value ?? undefined)
                  }
                />
              </GridColumn>
            </GridRow>
          </Box>

          <Checkbox
            name="interpreter"
            label={formatMessage(kim.interpreter)}
            checked={interpreter}
            onChange={(event) => setInterpreter(event.target.checked)}
          />
          <Checkbox
            name="signLanguage"
            label={formatMessage(kim.signLanguage)}
            checked={signLanguage}
            onChange={(event) => setSignLanguage(event.target.checked)}
          />
          <Box display="flex" columnGap={2}>
            <Button
              variant="primary"
              size="small"
              onClick={handleSave}
              loading={saving}
            >
              {formatMessage(kim.save)}
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate(overviewPath)}
            >
              {formatMessage(kim.cancel)}
            </Button>
          </Box>
        </Stack>
      )}
    </>
  )
}

export default LanguageProfileEdit
