import { useEffect, useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  RadioButton,
  Select,
  Stack,
  Text,
  toast,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader } from '@island.is/portals/my-pages/core'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import * as styles from './editForm.css'
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
  const [interpreter, setInterpreter] = useState<boolean | undefined>(
    profile?.interpreter,
  )
  const [signLanguage, setSignLanguage] = useState<boolean | undefined>(
    profile?.signLanguage,
  )

  // A value-based signature of the server data. `profile` is rebuilt as a fresh
  // object on every render in the hook (and `languages` is a new array each
  // time), so using those as effect deps re-runs the prefill on every render and
  // clobbers the guardian's in-progress edits (e.g. an interpreter/sign-language
  // "Nei"). This string only changes when the data itself changes.
  const profileSignature = profile
    ? JSON.stringify({
        languageEnvironmentId: profile.languageEnvironmentId,
        languages: profile.languages ?? [],
        preferredLanguage: profile.preferredLanguage,
        interpreter: profile.interpreter,
        signLanguage: profile.signLanguage,
      })
    : ''

  // Prefill when the profile first arrives (and re-sync after a save/refetch).
  useEffect(() => {
    setLanguageEnvironmentId(profile?.languageEnvironmentId)
    setLanguages(profile?.languages ?? [])
    setPreferredLanguage(profile?.preferredLanguage)
    setInterpreter(profile?.interpreter)
    setSignLanguage(profile?.signLanguage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileSignature])

  // Value-based signature of the current form state, built the same way as
  // `profileSignature`. Save stays disabled until this diverges from the loaded
  // profile, i.e. the guardian has actually changed something.
  const currentSignature = JSON.stringify({
    languageEnvironmentId,
    languages,
    preferredLanguage,
    interpreter,
    signLanguage,
  })
  const isDirty = currentSignature !== profileSignature

  // Every field is required, so save stays blocked until they are all filled in.
  const isValid =
    !!languageEnvironmentId &&
    languages.length > 0 &&
    !!preferredLanguage &&
    interpreter !== undefined &&
    signLanguage !== undefined

  const overviewPath = generatePath(EducationPaths.PrimarySchoolOverview, {
    studentId: studentId ?? '',
  })

  const handleSave = async () => {
    // The undefined checks also narrow interpreter/signLanguage to boolean for
    // the required LanguageProfileUpdateInput.
    if (!isValid || interpreter === undefined || signLanguage === undefined)
      return
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
        <Box className={styles.formContainer}>
          <Stack space={3}>
            <Box>
              <GridRow>
                <GridColumn span="12/12">
                  <Select
                    name="languageEnvironment"
                    backgroundColor="blue"
                    label={formatMessage(kim.languageEnvironment)}
                    size="sm"
                    isLoading={optionsLoading}
                    options={languageEnvironmentOptions}
                    value={selectedLanguageEnvironment}
                    required
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
              <GridRow>
                <GridColumn span="12/12">
                  <Select
                    name="languages"
                    backgroundColor="blue"
                    label={formatMessage(kim.childLanguages)}
                    size="sm"
                    isMulti
                    isSearchable
                    required
                    isClearable={false}
                    options={languageOptions}
                    value={selectedLanguages}
                    onChange={(selected) => {
                      const next = (selected ?? []).map(
                        (option) => option.value,
                      )
                      setLanguages(next)
                      // Drop the preferred language if it is no longer selected,
                      // so it can't be saved as a preferred language outside the
                      // child's language list.
                      if (
                        preferredLanguage &&
                        !next.includes(preferredLanguage)
                      ) {
                        setPreferredLanguage(undefined)
                      }
                    }}
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box>
              <GridRow>
                <GridColumn span="12/12">
                  <Select
                    name="preferredLanguage"
                    backgroundColor="blue"
                    size="sm"
                    required
                    label={formatMessage(kim.preferredLanguage)}
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
            <Box>
              <Text variant="h5" fontWeight="semiBold" marginBottom={1}>
                {formatMessage(kim.interpreter)}{' '}
                <Tooltip text={formatMessage(kim.interpreterInfo)} />
              </Text>
              <Box display="flex" flexDirection="column" rowGap={2}>
                <RadioButton
                  name="interpreter"
                  id="interpreter-yes"
                  label={formatMessage(kim.yes)}
                  checked={interpreter === true}
                  onChange={() => setInterpreter(true)}
                />
                <RadioButton
                  name="interpreter"
                  id="interpreter-no"
                  label={formatMessage(kim.no)}
                  checked={interpreter === false}
                  onChange={() => setInterpreter(false)}
                />
              </Box>
            </Box>
            <Box>
              <Text variant="h5" fontWeight="semiBold" marginBottom={1}>
                {formatMessage(kim.signLanguage)}
                <Tooltip text={formatMessage(kim.signLanguageInfo)} />
              </Text>
              <Box display="flex" flexDirection="column" rowGap={2}>
                <RadioButton
                  name="signLanguage"
                  id="signLanguage-yes"
                  label={formatMessage(kim.yes)}
                  checked={signLanguage === true}
                  onChange={() => setSignLanguage(true)}
                />
                <RadioButton
                  name="signLanguage"
                  id="signLanguage-no"
                  label={formatMessage(kim.no)}
                  checked={signLanguage === false}
                  onChange={() => setSignLanguage(false)}
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="flexEnd" columnGap={2}>
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate(overviewPath)}
              >
                {formatMessage(kim.cancel)}
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleSave}
                loading={saving}
                disabled={!isValid || !isDirty}
              >
                {formatMessage(kim.save)}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  )
}

export default LanguageProfileEdit
