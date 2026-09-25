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
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader } from '@island.is/portals/my-pages/core'
import * as styles from './editForm.css'
import { primarySchoolKeyInfoMessages as kim } from '../../../../../lib/messages'
import { EducationPaths } from '../../../../../lib/paths'
import { SectionError } from '../SectionError'
import { useAllergyOptions } from '../useAllergyOptions'
import { usePrimarySchoolKeyInfo } from '../usePrimarySchoolKeyInfo'
import { AllergyCategory } from '../types'
import type { Allergy, HealthProfileUpdateInput } from '../types'

/**
 * Dedicated edit screen for Heilsufarsupplýsingar (health profile). Save/cancel return to the overview.
 *
 * Saving stays disabled until the guardian actually changes something (isDirty).
 *
 * The allergy multi-selects load from MMS `GET /allergies` — one flat list
 * covering all categories, split by `type` into food / medicine / environmental
 * (values match AllergyCategory). See useAllergyOptions.
 *
 * handleSave already assembles the whole HealthProfileUpdateInput (allergies
 * rebuilt from the three id lists tagged by category, epipen forced false when
 * no allergy is selected).
 *
 * TODO(MMS v0.2): wire the PATCH — replace the `void payload` in handleSave with
 * the generated mutation and surface error.requestId on failure.
 */
export const HealthProfileEdit = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()
  const { healthProfile, saveHealthProfile, saving } =
    usePrimarySchoolKeyInfo(studentId)
  const { data: profile, loading, error } = healthProfile

  // Allergy options come from MMS `GET /allergies` — one flat list covering all
  // categories; `type` splits it into food / medicine / environmental (values
  // match AllergyCategory).
  const {
    options: allergyOptions,
    loading: allergyOptionsLoading,
    error: allergyOptionsError,
  } = useAllergyOptions()

  const optionsInCategory = (category: AllergyCategory) =>
    allergyOptions.filter((option) => option.type === category)
  const foodAllergyOptions = optionsInCategory(AllergyCategory.Food)
  const medicineAllergyOptions = optionsInCategory(AllergyCategory.Medicine)
  const environmentalAllergyOptions = optionsInCategory(
    AllergyCategory.Environmental,
  )

  const allergyIdsInCategory = (category: AllergyCategory) =>
    (profile?.allergies ?? [])
      .filter((allergy) => allergy.type === category)
      .map((allergy) => allergy.id)

  const [foodAllergyIds, setFoodAllergyIds] = useState<string[]>(
    allergyIdsInCategory(AllergyCategory.Food),
  )
  const [medicineAllergyIds, setMedicineAllergyIds] = useState<string[]>(
    allergyIdsInCategory(AllergyCategory.Medicine),
  )
  const [environmentalAllergyIds, setEnvironmentalAllergyIds] = useState<
    string[]
  >(allergyIdsInCategory(AllergyCategory.Environmental))
  const [epipen, setEpipen] = useState<boolean>(profile?.epipen ?? false)
  const [medicalDiagnoses, setMedicalDiagnoses] = useState<boolean>(
    profile?.medicalDiagnoses ?? false,
  )
  const [medicationAssistance, setMedicationAssistance] = useState<boolean>(
    profile?.medicationAssistance ?? false,
  )
  // Each category has its own Já/Nei gate. Starts "Já" when the child already
  // has allergies recorded in that category, otherwise unset so the guardian
  // answers explicitly.
  const hasInCategory = (category: AllergyCategory) =>
    allergyIdsInCategory(category).length > 0 ? true : undefined
  const [hasFoodAllergies, setHasFoodAllergies] = useState<boolean | undefined>(
    hasInCategory(AllergyCategory.Food),
  )
  const [hasMedicineAllergies, setHasMedicineAllergies] = useState<
    boolean | undefined
  >(hasInCategory(AllergyCategory.Medicine))
  const [hasEnvironmentalAllergies, setHasEnvironmentalAllergies] = useState<
    boolean | undefined
  >(hasInCategory(AllergyCategory.Environmental))

  // A value-based signature of the server data. `profile` is rebuilt as a fresh
  // object on every render in the hook, so it can't be used as an effect dep —
  // doing so re-runs the prefill on every render and clobbers the guardian's
  // in-progress edits (e.g. choosing "Nei" or clearing an allergy). This string
  // only changes when the data itself changes (initial load / after save).
  // Booleans are normalized with `?? false` to match how the form state is
  // initialized below — otherwise an undefined `medicationAssistance` is dropped
  // by JSON.stringify (or a null epipen stays null) and the signature never
  // matches the current one, leaving Save permanently enabled.
  const profileSignature = profile
    ? JSON.stringify({
        allergies: (profile.allergies ?? [])
          .map((allergy) => allergy.id)
          .sort(),
        epipen:
          (profile.allergies ?? []).length > 0
            ? profile.epipen ?? false
            : false,
        medicalDiagnoses: profile.medicalDiagnoses ?? false,
        medicationAssistance: profile.medicationAssistance ?? false,
      })
    : ''

  // Prefill when the profile first arrives (and re-sync after a save/refetch).
  useEffect(() => {
    setFoodAllergyIds(allergyIdsInCategory(AllergyCategory.Food))
    setMedicineAllergyIds(allergyIdsInCategory(AllergyCategory.Medicine))
    setEnvironmentalAllergyIds(
      allergyIdsInCategory(AllergyCategory.Environmental),
    )
    setEpipen(profile?.epipen ?? false)
    setMedicalDiagnoses(profile?.medicalDiagnoses ?? false)
    setMedicationAssistance(profile?.medicationAssistance ?? false)
    setHasFoodAllergies(hasInCategory(AllergyCategory.Food))
    setHasMedicineAllergies(hasInCategory(AllergyCategory.Medicine))
    setHasEnvironmentalAllergies(hasInCategory(AllergyCategory.Environmental))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileSignature])

  const yesNoOptions = [
    { value: 'true', label: formatMessage(kim.yes) },
    { value: 'false', label: formatMessage(kim.no) },
  ]

  const selectedIn = (options: typeof allergyOptions, ids: string[]) =>
    options.filter((option) => ids.includes(option.value))
  const selectedFoodAllergies = selectedIn(foodAllergyOptions, foodAllergyIds)
  const selectedMedicineAllergies = selectedIn(
    medicineAllergyOptions,
    medicineAllergyIds,
  )
  const selectedEnvironmentalAllergies = selectedIn(
    environmentalAllergyOptions,
    environmentalAllergyIds,
  )

  // The adrenaline pen is only meaningful when at least one allergy is
  // registered (ticket §3).
  const hasAnyAllergy =
    foodAllergyIds.length +
      medicineAllergyIds.length +
      environmentalAllergyIds.length >
    0

  // Value-based signature of the current form state, built the same way as
  // `profileSignature` (and normalized like the payload). Save stays disabled
  // until this diverges from the loaded profile, i.e. the guardian has actually
  // changed something.
  const currentSignature = JSON.stringify({
    allergies: [
      ...foodAllergyIds,
      ...medicineAllergyIds,
      ...environmentalAllergyIds,
    ].sort(),
    epipen: hasAnyAllergy ? epipen : false,
    medicalDiagnoses,
    medicationAssistance,
  })
  const isDirty = currentSignature !== profileSignature

  // Every allergy category must be answered Já/Nei, and a "Já" must have at
  // least one allergy selected. Save stays blocked until then.
  const categoriesAnswered =
    hasFoodAllergies !== undefined &&
    hasMedicineAllergies !== undefined &&
    hasEnvironmentalAllergies !== undefined

  const categoriesConsistent =
    (hasFoodAllergies !== true || foodAllergyIds.length > 0) &&
    (hasMedicineAllergies !== true || medicineAllergyIds.length > 0) &&
    (hasEnvironmentalAllergies !== true || environmentalAllergyIds.length > 0)

  const isValid = categoriesAnswered && categoriesConsistent

  const overviewPath = generatePath(EducationPaths.PrimarySchoolOverview, {
    studentId: studentId ?? '',
  })

  const handleSave = async () => {
    if (!isValid) return

    // Rebuild allergies[] (whole document, per ticket) from the three id lists,
    // tagging each with its category and label from the option list. The hook
    // reduces these to ids for the PATCH body (contract §4.5).
    const optionById = new Map(
      allergyOptions.map((option) => [option.value, option]),
    )
    const toAllergies = (ids: string[], category: AllergyCategory): Allergy[] =>
      ids.flatMap((id) => {
        const option = optionById.get(id)
        return option ? [{ id, type: category, label: option.label }] : []
      })

    const payload: HealthProfileUpdateInput = {
      allergies: [
        ...toAllergies(foodAllergyIds, AllergyCategory.Food),
        ...toAllergies(medicineAllergyIds, AllergyCategory.Medicine),
        ...toAllergies(environmentalAllergyIds, AllergyCategory.Environmental),
      ],
      // When no allergy is selected, epipen must be sent as false (ticket §3).
      epipen: hasAnyAllergy ? epipen : false,
      medicalDiagnoses,
      medicationAssistance,
    }

    try {
      await saveHealthProfile(payload)
      toast.success(formatMessage(kim.saveSuccess))
      navigate(overviewPath)
    } catch {
      // Expect 403 FEATURE_DISABLED until MMS enables the health PATCH (§8).
      toast.error(formatMessage(kim.saveError))
    }
  }

  return (
    <>
      {loading && <CardLoader />}
      {!loading && error && <SectionError error={error} />}
      {!loading && !error && (
        <Box className={styles.formContainer}>
          <Stack space={2}>
            <Stack space={5}>
              <Box>
                <Stack space={2}>
                  <GridRow>
                    <GridColumn span={['12/12', '12/12', '10/12']}>
                      <Select
                        name="hasFoodAllergies"
                        required
                        backgroundColor="blue"
                        size="sm"
                        label={formatMessage(kim.foodAllergies)}
                        options={yesNoOptions}
                        value={
                          yesNoOptions.find(
                            (option) =>
                              option.value === String(hasFoodAllergies),
                          ) ?? null
                        }
                        onChange={(option) => {
                          const next = option?.value === 'true'
                          setHasFoodAllergies(next)
                          if (!next) setFoodAllergyIds([])
                        }}
                      />
                    </GridColumn>
                  </GridRow>
                  {hasFoodAllergies === true && (
                    <GridRow>
                      <GridColumn span={['12/12', '12/12', '10/12']}>
                        <Select
                          name="foodAllergies"
                          backgroundColor="blue"
                          required={hasFoodAllergies === true}
                          size="sm"
                          label={formatMessage(kim.foodAllergyChoose)}
                          isMulti
                          isSearchable
                          isClearable={false}
                          isLoading={allergyOptionsLoading}
                          options={foodAllergyOptions}
                          value={selectedFoodAllergies}
                          onChange={(selected) =>
                            setFoodAllergyIds(
                              (selected ?? []).map((option) => option.value),
                            )
                          }
                        />
                      </GridColumn>
                    </GridRow>
                  )}
                </Stack>
              </Box>
              <Box>
                <Stack space={2}>
                  <GridRow>
                    <GridColumn span={['12/12', '12/12', '10/12']}>
                      <Select
                        name="hasMedicineAllergies"
                        required
                        backgroundColor="blue"
                        size="sm"
                        label={formatMessage(kim.medicineAllergies)}
                        options={yesNoOptions}
                        value={
                          yesNoOptions.find(
                            (option) =>
                              option.value === String(hasMedicineAllergies),
                          ) ?? null
                        }
                        onChange={(option) => {
                          const next = option?.value === 'true'
                          setHasMedicineAllergies(next)
                          if (!next) setMedicineAllergyIds([])
                        }}
                      />
                    </GridColumn>
                  </GridRow>
                  {hasMedicineAllergies === true && (
                    <GridRow>
                      <GridColumn span={['12/12', '12/12', '10/12']}>
                        <Select
                          name="medicineAllergies"
                          backgroundColor="blue"
                          required={hasMedicineAllergies === true}
                          size="sm"
                          label={formatMessage(kim.medicineAllergyChoose)}
                          isMulti
                          isSearchable
                          isClearable={false}
                          isLoading={allergyOptionsLoading}
                          options={medicineAllergyOptions}
                          value={selectedMedicineAllergies}
                          onChange={(selected) =>
                            setMedicineAllergyIds(
                              (selected ?? []).map((option) => option.value),
                            )
                          }
                        />
                      </GridColumn>
                    </GridRow>
                  )}
                </Stack>
              </Box>
              <Box>
                <Stack space={2}>
                  <GridRow>
                    <GridColumn span={['12/12', '12/12', '10/12']}>
                      <Select
                        name="hasEnvironmentalAllergies"
                        required
                        backgroundColor="blue"
                        size="sm"
                        label={formatMessage(kim.environmentalAllergies)}
                        options={yesNoOptions}
                        value={
                          yesNoOptions.find(
                            (option) =>
                              option.value ===
                              String(hasEnvironmentalAllergies),
                          ) ?? null
                        }
                        onChange={(option) => {
                          const next = option?.value === 'true'
                          setHasEnvironmentalAllergies(next)
                          if (!next) setEnvironmentalAllergyIds([])
                        }}
                      />
                    </GridColumn>
                  </GridRow>
                  {hasEnvironmentalAllergies === true && (
                    <GridRow>
                      <GridColumn span={['12/12', '12/12', '10/12']}>
                        <Select
                          name="environmentalAllergies"
                          backgroundColor="blue"
                          required={hasEnvironmentalAllergies === true}
                          size="sm"
                          label={formatMessage(kim.environmentalAllergyChoose)}
                          isMulti
                          isSearchable
                          isClearable={false}
                          isLoading={allergyOptionsLoading}
                          options={environmentalAllergyOptions}
                          value={selectedEnvironmentalAllergies}
                          onChange={(selected) =>
                            setEnvironmentalAllergyIds(
                              (selected ?? []).map((option) => option.value),
                            )
                          }
                        />
                      </GridColumn>
                    </GridRow>
                  )}
                </Stack>
              </Box>
              {allergyOptionsError && (
                <SectionError
                  error={{ message: allergyOptionsError.message }}
                />
              )}
              {hasAnyAllergy && (
                <Box>
                  <Stack space={2}>
                    <Text variant="h5" fontWeight="semiBold" marginBottom={0}>
                      {formatMessage(kim.epipen)}
                    </Text>
                    <Box display="flex" flexDirection="column" rowGap={2}>
                      <RadioButton
                        name="epipen"
                        id="epipen-yes"
                        label={formatMessage(kim.yes)}
                        checked={epipen === true}
                        onChange={() => setEpipen(true)}
                      />
                      <RadioButton
                        name="epipen"
                        id="epipen-no"
                        label={formatMessage(kim.no)}
                        checked={epipen === false}
                        onChange={() => setEpipen(false)}
                      />
                    </Box>
                  </Stack>
                </Box>
              )}
              <Box>
                <Stack space={2}>
                  <Text variant="h5" fontWeight="semiBold" marginBottom={0}>
                    {formatMessage(kim.medicalDiagnoses)}
                  </Text>
                  <Box display="flex" flexDirection="column" rowGap={2}>
                    <RadioButton
                      name="medicalDiagnoses"
                      id="medicalDiagnoses-yes"
                      label={formatMessage(kim.yes)}
                      checked={medicalDiagnoses === true}
                      onChange={() => setMedicalDiagnoses(true)}
                    />
                    <RadioButton
                      name="medicalDiagnoses"
                      id="medicalDiagnoses-no"
                      label={formatMessage(kim.no)}
                      checked={medicalDiagnoses === false}
                      onChange={() => setMedicalDiagnoses(false)}
                    />
                  </Box>
                </Stack>
              </Box>
              <Box>
                <Stack space={2}>
                  <Text variant="h5" fontWeight="semiBold" marginBottom={0}>
                    {formatMessage(kim.medicationAssistance)}
                  </Text>
                  <Box display="flex" flexDirection="column" rowGap={2}>
                    <RadioButton
                      name="medicationAssistance"
                      id="medicationAssistance-yes"
                      label={formatMessage(kim.yes)}
                      checked={medicationAssistance === true}
                      onChange={() => setMedicationAssistance(true)}
                    />
                    <RadioButton
                      name="medicationAssistance"
                      id="medicationAssistance-no"
                      label={formatMessage(kim.no)}
                      checked={medicationAssistance === false}
                      onChange={() => setMedicationAssistance(false)}
                    />
                  </Box>
                </Stack>
              </Box>
            </Stack>
            <Box display="flex" columnGap={2} justifyContent="flexEnd">
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
                disabled={!isValid || !isDirty}
                loading={saving}
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

export default HealthProfileEdit
