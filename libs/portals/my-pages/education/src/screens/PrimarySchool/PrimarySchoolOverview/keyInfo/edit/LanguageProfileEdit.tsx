import { useEffect, useState, useId } from 'react'
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
import { mmsErrorMessage } from '../mmsError'
import { focusSelect } from './focusField'

/**
 * Dedicated edit screen for Tungumálaumhverfi (language profile).
 * Save/cancel return to the overview.
 *
 * The language-environment options come from the `primarySchoolLanguageEnvironments`
 * query, which reads Frigg `GET /key-options?type=languageEnvironment`. The
 * child's languages / preferred language come from the Ísland.is language list
 * (getAllLanguageCodes), not MMS.
 *
 */
export const LanguageProfileEdit = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const interpreterLabelId = useId()
  const signLanguageLabelId = useId()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()
  const { languageProfile, saveLanguageProfile, saving } =
    usePrimarySchoolKeyInfo(studentId, ['languageProfile'])
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

  // Every field is required. Save reports what is missing rather than staying
  // disabled, so the guardian is never left guessing.
  const [showErrors, setShowErrors] = useState(false)
  const missingLanguageEnvironment = !languageEnvironmentId
  const missingLanguages = languages.length === 0
  const missingPreferredLanguage = !preferredLanguage

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
    // The undefined checks also narrow languageEnvironmentId to string and
    // interpreter/signLanguage to boolean for the required
    // LanguageProfileUpdateInput.
    if (
      !isValid ||
      !languageEnvironmentId ||
      interpreter === undefined ||
      signLanguage === undefined
    ) {
      setShowErrors(true)
      if (missingLanguageEnvironment) focusSelect('languageEnvironment')
      else if (missingLanguages) focusSelect('languages')
      else if (missingPreferredLanguage) focusSelect('preferredLanguage')
      return
    }
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
    } catch (error) {
      toast.error(formatMessage(mmsErrorMessage(error)))
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
                    hasError={showErrors && missingLanguageEnvironment}
                    errorMessage={
                      showErrors && missingLanguageEnvironment
                        ? formatMessage(kim.fieldRequired)
                        : undefined
                    }
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
                    hasError={showErrors && missingLanguages}
                    errorMessage={
                      showErrors && missingLanguages
                        ? formatMessage(kim.fieldRequired)
                        : undefined
                    }
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
                    hasError={showErrors && missingPreferredLanguage}
                    errorMessage={
                      showErrors && missingPreferredLanguage
                        ? formatMessage(kim.fieldRequired)
                        : undefined
                    }
                    backgroundColor="blue"
                    size="sm"
                    required
                    label={formatMessage(kim.preferredLanguage)}
                    // Picked from the languages chosen above, so there is
                    // nothing to wait for.
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
              <Box
                display="flex"
                alignItems="center"
                columnGap={1}
                marginBottom={1}
              >
                <Text
                  id={interpreterLabelId}
                  variant="h5"
                  fontWeight="semiBold"
                >
                  {formatMessage(kim.interpreter)}
                </Text>
                <Tooltip text={formatMessage(kim.interpreterInfo)} />
              </Box>
              <Box
                role="radiogroup"
                aria-labelledby={interpreterLabelId}
                display="flex"
                flexDirection="column"
                rowGap={2}
              >
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
              <Box
                display="flex"
                alignItems="center"
                columnGap={1}
                marginBottom={1}
              >
                <Text
                  id={signLanguageLabelId}
                  variant="h5"
                  fontWeight="semiBold"
                >
                  {formatMessage(kim.signLanguage)}
                </Text>
                <Tooltip text={formatMessage(kim.signLanguageInfo)} />
              </Box>
              <Box
                role="radiogroup"
                aria-labelledby={signLanguageLabelId}
                display="flex"
                flexDirection="column"
                rowGap={2}
              >
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
                disabled={!isDirty}
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
