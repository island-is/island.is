import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { typeSelection } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { ApplicationTypes } from '../lib/constants'
import { useFormContext } from 'react-hook-form'
import { useApplication } from '../hooks/useUpdateApplication'
import { useRegulationDraft } from '../hooks/useRegulationDraft'
import set from 'lodash/set'
import { Box, RadioButton, Stack, Text } from '@island.is/island-ui/core'
import { useEffect, useMemo, useState } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { useFeatureFlag } from '@island.is/react/feature-flags'

export const TypeSelectionScreen = ({
  application,
  setSubmitButtonDisabled,
}: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()
  const { updateApplication, updateApplicationV2 } = useApplication({
    applicationId: application.id,
  })

  const { ensureDraft, draftId } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  const currentType = getValueViaPath<string>(
    application.answers,
    'applicationType',
  )

  const [selected, setSelected] = useState<string>(
    currentType || ApplicationTypes.AD,
  )

  // For applications created before TypeSelection existed, applicationType is
  // absent from answers. Save the 'ad' default so future visits are pre-filled.
  useEffect(() => {
    if (!currentType) {
      setValue('applicationType', ApplicationTypes.AD)
      updateApplicationV2({ path: 'applicationType', value: ApplicationTypes.AD })
    }
  }, [currentType, setValue, updateApplicationV2])

  const { value: regulationsEnabled } = useFeatureFlag(
    Features.officialJournalOfIcelandRegulations,
    true, // TODO CHANGE TO FALSE BEFORE PROD
  )

  useEffect(() => {
    setSubmitButtonDisabled && setSubmitButtonDisabled(!selected)
  }, [selected, setSubmitButtonDisabled])

  const handleSelect = async (value: string) => {
    setSelected(value)
    setValue('applicationType', value)

    const currentAnswers = structuredClone(application.answers)
    const updatedAnswers = set(currentAnswers, 'applicationType', value)
    await updateApplication(updatedAnswers)

    // Create the regulation draft in the DB as soon as a regulation type
    // is selected. By the time the user reaches any regulation screen,
    // the draftId is already persisted in answers.
    if (
      value === ApplicationTypes.BASE_REGULATION ||
      value === ApplicationTypes.AMENDING_REGULATION
    ) {
      if (!draftId) {
        await ensureDraft(value)
      }
    }
  }

  const allOptions = [
    {
      value: ApplicationTypes.AD,
      label: f(typeSelection.options.ad),
      description: f(typeSelection.options.adDescription),
    },
    {
      value: ApplicationTypes.BASE_REGULATION,
      label: f(typeSelection.options.baseRegulation),
      description: f(typeSelection.options.baseRegulationDescription),
    },
    {
      value: ApplicationTypes.AMENDING_REGULATION,
      label: f(typeSelection.options.amendingRegulation),
      description: f(typeSelection.options.amendingRegulationDescription),
    },
  ]

  const options = useMemo(
    () =>
      regulationsEnabled
        ? allOptions
        : allOptions.filter((o) => o.value === ApplicationTypes.AD),
    [regulationsEnabled],
  )

  return (
    <FormScreen
      title={f(typeSelection.general.title)}
      intro={f(typeSelection.general.description)}
    >
      <Box>
        <Stack space={3}>
          {options.map((option) => (
            <Box
              key={option.value}
              border={selected === option.value ? 'focus' : 'standard'}
              borderRadius="large"
              padding={3}
              cursor="pointer"
              onClick={() => handleSelect(option.value)}
            >
              <RadioButton
                id={`applicationType-${option.value}`}
                name="applicationType"
                label={option.label}
                value={option.value}
                checked={selected === option.value}
                onChange={() => handleSelect(option.value)}
                large
              />
              <Box marginTop={1} paddingLeft={4}>
                <Text variant="small" color="dark300">
                  {option.description}
                </Text>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </FormScreen>
  )
}

export default TypeSelectionScreen
