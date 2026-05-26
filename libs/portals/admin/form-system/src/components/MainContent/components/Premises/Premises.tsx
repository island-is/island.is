import { FormSystemLanguageType } from '@island.is/api/schema'
import { Box, Button, Input, Stack, Text } from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'

type PremisesProps = {
  title: FormSystemLanguageType
  description: FormSystemLanguageType
}

type AdditionalPremises = PremisesProps[]
type PremiseField = keyof PremisesProps
type PremiseLanguage = keyof FormSystemLanguageType

const defaultPremises: PremisesProps = {
  title: {
    is: '',
    en: '',
  },
  description: {
    is: '',
    en: '',
  },
}

export const Premises = () => {
  const {
    control,
    controlDispatch,
    formUpdate,
    focus,
    setFocus,
    getTranslation,
  } = useContext(ControlContext)
  const { isReadOnly } = control
  const [premises, setPremises] = useState<AdditionalPremises>(
    (control.form.sectionInfo?.additionalPremises as AdditionalPremises) ?? [],
  )

  const updatePremises = (
    newPremises: AdditionalPremises,
    shouldUpdateForm = false,
  ) => {
    setPremises(newPremises)

    controlDispatch({
      type: 'SET_ADDITIONAL_PREMISES',
      payload: {
        newValue: newPremises,
        update: shouldUpdateForm ? formUpdate : undefined,
      },
    })
  }

  const getUpdatedPremises = (
    index: number,
    field: PremiseField,
    value: string,
    lang: PremiseLanguage,
  ) =>
    premises.map((premise, premiseIndex) =>
      premiseIndex === index
        ? {
            ...premise,
            [field]: {
              ...premise[field],
              [lang]: value,
            },
          }
        : premise,
    )

  const add = () => {
    updatePremises([...premises, defaultPremises], true)
  }

  const remove = (index: number) => {
    const newPremises = premises.filter(
      (_, premiseIndex) => premiseIndex !== index,
    )

    updatePremises(newPremises, true)
  }

  const onChange = (
    index: number,
    field: PremiseField,
    value: string,
    lang: PremiseLanguage,
  ) => {
    updatePremises(getUpdatedPremises(index, field, value, lang))
  }

  const onBlur = (
    index: number,
    field: PremiseField,
    lang: PremiseLanguage,
  ) => {
    const value = premises[index]?.[field]?.[lang] ?? ''

    if (focus !== value) {
      updatePremises(premises, true)
    }

    setFocus('')
  }

  const onEnglishFocus = async (
    index: number,
    field: PremiseField,
    englishValue: string,
    icelandicValue?: string | null,
  ) => {
    if (icelandicValue && !englishValue) {
      const translation = await getTranslation(icelandicValue)
      const translatedValue = translation.translation

      const newPremises = getUpdatedPremises(
        index,
        field,
        translatedValue,
        'en',
      )

      updatePremises(newPremises, true)
      setFocus(translatedValue)

      return
    }

    setFocus(englishValue)
  }

  return (
    <>
      <Box
        background="blue100"
        padding={2}
        borderRadius="large"
        display="flex"
        alignItems="center"
        justifyContent="center"
        columnGap={2}
      >
        <Text variant="default" as="h2">
          Hér er hægt að bæta við skilaboðum til umsækjenda ef þarf að afla
          frekari gagna
        </Text>

        <Box flexShrink={0} alignSelf="center">
          <Button
            variant="primary"
            icon="add"
            onClick={add}
            disabled={isReadOnly}
          >
            Bæta við
          </Button>
        </Box>
      </Box>

      {premises.map((premise, index) => (
        <Box padding={2} key={index}>
          <Box
            display="flex"
            justifyContent="flexEnd"
            marginBottom={2}
            width="full"
          >
            <Button
              name={`remove-${index}`}
              variant="ghost"
              colorScheme="destructive"
              onClick={() => remove(index)}
              size="small"
              icon="trash"
              disabled={isReadOnly}
            />
          </Box>

          <Stack space={2}>
            <Input
              name={`title-is-${index}`}
              label="Titill"
              value={premise.title.is ?? ''}
              onChange={(e) => onChange(index, 'title', e.target.value, 'is')}
              onFocus={(e) => setFocus(e.target.value)}
              onBlur={() => onBlur(index, 'title', 'is')}
              backgroundColor="blue"
              disabled={isReadOnly}
            />

            <Input
              name={`title-en-${index}`}
              label="Titill á ensku"
              value={premise.title.en ?? ''}
              onChange={(e) => onChange(index, 'title', e.target.value, 'en')}
              onFocus={(e) =>
                onEnglishFocus(index, 'title', e.target.value, premise.title.is)
              }
              onBlur={() => onBlur(index, 'title', 'en')}
              backgroundColor="blue"
              disabled={isReadOnly}
            />

            <Input
              name={`description-is-${index}`}
              label="Lýsing"
              value={premise.description.is ?? ''}
              onChange={(e) =>
                onChange(index, 'description', e.target.value, 'is')
              }
              onFocus={(e) => setFocus(e.target.value)}
              onBlur={() => onBlur(index, 'description', 'is')}
              backgroundColor="blue"
              disabled={isReadOnly}
            />

            <Input
              name={`description-en-${index}`}
              label="Lýsing á ensku"
              value={premise.description.en ?? ''}
              onChange={(e) =>
                onChange(index, 'description', e.target.value, 'en')
              }
              onFocus={(e) =>
                onEnglishFocus(
                  index,
                  'description',
                  e.target.value,
                  premise.description.is,
                )
              }
              onBlur={() => onBlur(index, 'description', 'en')}
              backgroundColor="blue"
              disabled={isReadOnly}
            />
          </Stack>
        </Box>
      ))}
    </>
  )
}
