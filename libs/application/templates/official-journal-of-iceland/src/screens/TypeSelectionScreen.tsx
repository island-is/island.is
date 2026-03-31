import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { typeSelection, error as errorMessages } from '../lib/messages'
import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import { ApplicationTypes, DEPARTMENT_B } from '../lib/constants'
import { useFormContext } from 'react-hook-form'
import { useApplication } from '../hooks/useUpdateApplication'
import { useRegulationDraft } from '../hooks/useRegulationDraft'
import { useDepartments } from '../hooks/useDepartments'
import { useInvolvedParties } from '../hooks/useInvolvedParties'
import { useLazyQuery } from '@apollo/client'
import { MAIN_TYPES_QUERY } from '../graphql/queries'
import { cleanTypename } from '../lib/utils'
import set from 'lodash/set'
import {
  Box,
  RadioButton,
  Select,
  Stack,
  Text,
  Tooltip,
  toast,
} from '@island.is/island-ui/core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { useFeatureFlag } from '@island.is/react/feature-flags'
import { OfficialJournalOfIcelandMainTypesResponse } from '@island.is/api/schema'

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
  const defaultSetRef = useRef(false)
  useEffect(() => {
    if (!currentType && !defaultSetRef.current) {
      defaultSetRef.current = true
      setValue('applicationType', ApplicationTypes.AD)
      updateApplicationV2({
        path: 'applicationType',
        value: ApplicationTypes.AD,
      })
    }
  }, [currentType, setValue, updateApplicationV2])

  const { departments } = useDepartments()

  const [fetchMainTypes] = useLazyQuery<{
    officialJournalOfIcelandMainTypes: OfficialJournalOfIcelandMainTypesResponse
  }>(MAIN_TYPES_QUERY, { fetchPolicy: 'network-only' })

  const currentInvolvedPartyId = getValueViaPath<string>(
    application.answers,
    InputFields.advert.involvedPartyId,
  )

  const currentReader = getValueViaPath<{
    id: string
    title: string
    slug: string
    nationalId: string
  }>(application.answers, InputFields.typeSelection.reader)

  const { involvedParties } = useInvolvedParties({
    applicationId: application.id,
  })

  const readerOptions = useMemo(() => {
    if (!involvedParties) return []
    return involvedParties
      .filter((p) => p.id !== currentInvolvedPartyId)
      .map((p) => ({
        label: p.title,
        value: p,
      }))
  }, [involvedParties, currentInvolvedPartyId])

  const { value: regulationsEnabled } = useFeatureFlag(
    Features.officialJournalOfIcelandRegulations,
    false,
  )

  useEffect(() => {
    setSubmitButtonDisabled && setSubmitButtonDisabled(!selected)
  }, [selected, setSubmitButtonDisabled])

  const autoSelectRegulationType = async (answers: Record<string, unknown>) => {
    const departmentB = departments?.find((d) => d.slug === DEPARTMENT_B)
    if (!departmentB) return answers

    const dept = {
      id: departmentB.id,
      title: departmentB.title,
      slug: departmentB.slug,
    }
    set(answers, InputFields.advert.department, dept)
    setValue(InputFields.advert.department, dept)

    const { data } = await fetchMainTypes({
      variables: { params: { department: departmentB.id, pageSize: 100 } },
    })

    const mainTypes = data?.officialJournalOfIcelandMainTypes.mainTypes ?? []
    const regulationMainType = mainTypes.find((mt) =>
      mt.slug?.toLowerCase().includes('reglug'),
    )
    if (!regulationMainType) return answers

    set(answers, InputFields.advert.mainType, regulationMainType)
    setValue(InputFields.advert.mainType, regulationMainType)

    const regulationType = regulationMainType.types.find((t) =>
      t.slug?.toLowerCase().includes('reglug'),
    )
    if (regulationType) {
      const typeValue = cleanTypename(regulationType)
      set(answers, InputFields.advert.type, typeValue)
      setValue(InputFields.advert.type, typeValue)
    }

    return answers
  }

  const handleReaderChange = async (
    party: {
      id: string
      title: string
      slug: string
      nationalId: string
    } | null,
  ) => {
    const currentAnswers = structuredClone(application.answers) as Record<
      string,
      unknown
    >

    if (party) {
      set(currentAnswers, InputFields.typeSelection.reader, {
        id: party.id,
        title: party.title,
        slug: party.slug,
        nationalId: party.nationalId,
      })
      setValue(InputFields.typeSelection.reader, {
        id: party.id,
        title: party.title,
        slug: party.slug,
        nationalId: party.nationalId,
      })
    } else {
      set(currentAnswers, InputFields.typeSelection.reader, undefined)
      setValue(InputFields.typeSelection.reader, undefined)
    }

    await updateApplication(currentAnswers)
  }

  const handleSelect = async (value: string) => {
    const previousValue = selected
    setSelected(value)
    setValue('applicationType', value)

    try {
      let currentAnswers = structuredClone(application.answers) as Record<
        string,
        unknown
      >
      set(currentAnswers, 'applicationType', value)

      const isRegulation =
        value === ApplicationTypes.BASE_REGULATION ||
        value === ApplicationTypes.AMENDING_REGULATION

      if (isRegulation) {
        currentAnswers = await autoSelectRegulationType(currentAnswers)
      } else {
        // Clear reader when switching away from regulation type
        set(currentAnswers, InputFields.typeSelection.reader, undefined)
        setValue(InputFields.typeSelection.reader, undefined)
      }

      await updateApplication(currentAnswers)

      // Create the regulation draft in the DB as soon as a regulation type
      // is selected. The createInFlightRef in useRegulationDraft prevents
      // duplicate creates if handleSelect is called rapidly.
      if (isRegulation && !draftId) {
        await ensureDraft(value)
      }
    } catch (error) {
      console.error('Failed to select application type:', error)
      setSelected(previousValue)
      setValue('applicationType', previousValue)
      toast.error(f(errorMessages.dataSubmissionErrorTitle))
    }
  }

  const options = useMemo(() => {
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
    return regulationsEnabled
      ? allOptions
      : allOptions.filter((o) => o.value === ApplicationTypes.AD)
  }, [regulationsEnabled, f])

  const isRegulationType =
    selected === ApplicationTypes.BASE_REGULATION ||
    selected === ApplicationTypes.AMENDING_REGULATION

  const defaultReaderOption = currentReader
    ? readerOptions.find((o) => o.value.id === currentReader.id)
    : undefined

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
              borderRadius="large"
              borderColor={selected === option.value ? 'blue300' : 'blue200'}
              borderWidth="standard"
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
        {isRegulationType && readerOptions.length > 0 && (
          <Box marginTop={3}>
            <Box
              display="flex"
              alignItems="center"
              marginBottom={1}
              columnGap={1}
            >
              <Text variant="h5">{f(typeSelection.reader.label)}</Text>
              <Tooltip text={f(typeSelection.reader.tooltip)} />
            </Box>
            <Select
              size="sm"
              name={InputFields.typeSelection.reader}
              label=""
              placeholder={f(typeSelection.reader.placeholder)}
              backgroundColor="blue"
              isClearable
              options={readerOptions}
              defaultValue={defaultReaderOption}
              onChange={(opt) => {
                const party = opt?.value
                if (party?.nationalId) {
                  handleReaderChange({
                    id: party.id,
                    title: party.title,
                    slug: party.slug,
                    nationalId: party.nationalId,
                  })
                } else {
                  handleReaderChange(null)
                }
              }}
            />
          </Box>
        )}
      </Box>
    </FormScreen>
  )
}

export default TypeSelectionScreen
