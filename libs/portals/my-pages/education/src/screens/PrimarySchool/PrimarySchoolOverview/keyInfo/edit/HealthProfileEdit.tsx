import { useEffect, useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  GridColumn,
  GridRow,
  Select,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader } from '@island.is/portals/my-pages/core'
import { primarySchoolKeyInfoMessages as kim } from '../../../../../lib/messages'
import { EducationPaths } from '../../../../../lib/paths'
import { SectionError } from '../SectionError'
import { useAllergyOptions } from '../useAllergyOptions'
import { usePrimarySchoolKeyInfo } from '../usePrimarySchoolKeyInfo'
import { AllergyCategory } from '../types'
import type { Allergy, HealthProfileUpdateInput } from '../types'

/**
 * Dedicated edit screen for Heilsufarsupplýsingar (health profile). Promoted from
 * the inline edit state on the overview so editing is its own routed page
 * (PrimarySchoolHealthEdit). Save/cancel return to the overview.
 *
 * Saving stays disabled until MMS opens the health PATCH (`healthEditEnabled`).
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
 * the generated mutation and surface error.requestId on failure. Expect 403
 * FEATURE_DISABLED until MMS enables it (healthEditEnabled).
 */
export const HealthProfileEdit = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()
  const { healthProfile, healthEditEnabled, saveHealthProfile, saving } =
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

  // Prefill once the profile arrives from the data seam.
  useEffect(() => {
    setFoodAllergyIds(allergyIdsInCategory(AllergyCategory.Food))
    setMedicineAllergyIds(allergyIdsInCategory(AllergyCategory.Medicine))
    setEnvironmentalAllergyIds(
      allergyIdsInCategory(AllergyCategory.Environmental),
    )
    setEpipen(profile?.epipen ?? false)
    setMedicalDiagnoses(profile?.medicalDiagnoses ?? false)
    setMedicationAssistance(profile?.medicationAssistance ?? false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

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

  const overviewPath = generatePath(EducationPaths.PrimarySchoolOverview, {
    studentId: studentId ?? '',
  })

  const handleSave = async () => {
    if (!healthEditEnabled) return

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
        <Stack space={2}>
          <Text variant="h3" color="dark400">
            {formatMessage(kim.allergyTitle)}
          </Text>
          <Text variant="small" fontWeight="semiBold" marginBottom={1}>
            {formatMessage(kim.foodAllergies)}
          </Text>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '10/12']}>
              <Select
                name="foodAllergies"
                size="sm"
                isMulti
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
          <Text variant="small" fontWeight="semiBold" marginBottom={1}>
            {formatMessage(kim.medicineAllergies)}
          </Text>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '10/12']}>
              <Select
                name="medicineAllergies"
                size="sm"
                isMulti
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
          <Text variant="small" fontWeight="semiBold" marginBottom={1}>
            {formatMessage(kim.environmentalAllergies)}
          </Text>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '10/12']}>
              <Select
                name="environmentalAllergies"
                size="sm"
                isMulti
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
          {allergyOptionsError && (
            <SectionError error={{ message: allergyOptionsError.message }} />
          )}
          {hasAnyAllergy && (
            <Checkbox
              name="epipen"
              label={formatMessage(kim.epipen)}
              checked={epipen}
              onChange={(event) => setEpipen(event.target.checked)}
            />
          )}
          <Divider />
          <Box
            display="flex"
            flexDirection="column"
            rowGap={2}
            paddingBottom={2}
          >
            <Text variant="h3" color="dark400">
              {formatMessage('Aðrar heilsufarsupplýsingar')}
            </Text>
            <Checkbox
              name="medicalDiagnoses"
              label={formatMessage(kim.medicalDiagnoses)}
              checked={medicalDiagnoses}
              onChange={(event) => setMedicalDiagnoses(event.target.checked)}
            />
            <Checkbox
              name="medicationAssistance"
              label={formatMessage(kim.medicationAssistance)}
              checked={medicationAssistance}
              onChange={(event) =>
                setMedicationAssistance(event.target.checked)
              }
            />
          </Box>
          <Box display="flex" columnGap={2}>
            <Button
              variant="primary"
              size="small"
              onClick={handleSave}
              disabled={!healthEditEnabled}
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

export default HealthProfileEdit
