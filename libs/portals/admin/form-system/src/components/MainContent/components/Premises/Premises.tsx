import { FormSystemLanguageType } from '@island.is/api/schema'
import {
  Box,
  Button,
  GridColumn as Column,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'

type PremisesProps = {
  title: FormSystemLanguageType
  description: FormSystemLanguageType
}

type AdditionalPremises = PremisesProps[]

const defaultPremises = {
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
  const { control, controlDispatch, formUpdate, focus, setFocus } =
    useContext(ControlContext)
  const [premises, setPremises] = useState<AdditionalPremises>(
    (control.form.sectionInfo?.additionalPremises as AdditionalPremises) || [],
  )
  console.log(
    'additional premises',
    control.form.sectionInfo?.additionalPremises,
  )

  const add = () => {
    const newPremises: AdditionalPremises = [...premises, defaultPremises]
    setPremises(newPremises)
    controlDispatch({
      type: 'SET_ADDITIONAL_PREMISES',
      payload: {
        newValue: newPremises,
        update: formUpdate,
      },
    })
  }

  const remove = (index: number) => {
    const newPremises = premises.filter((_, i) => i !== index)
    setPremises(newPremises)
    controlDispatch({
      type: 'SET_ADDITIONAL_PREMISES',
      payload: {
        newValue: newPremises,
        update: formUpdate,
      },
    })
  }

  const onChange = (
    index: number,
    field: keyof PremisesProps,
    value: string,
    lang: keyof FormSystemLanguageType,
  ) => {
    const newPremises = [...premises]
    newPremises[index][field] = {
      ...newPremises[index][field],
      [lang]: value,
    }
    setPremises(newPremises)
    controlDispatch({
      type: 'SET_ADDITIONAL_PREMISES',
      payload: {
        newValue: newPremises,
      },
    })
  }

  return (
    <>
      <Box
        paddingBottom={2}
        background="blue100"
        padding={2}
        borderRadius="large"
      >
        <Column span="12/12">
          <Box width="full" justifyContent="flexEnd" display="flex">
            <Button variant="primary" icon="add" onClick={add}>
              Bæta við
            </Button>
          </Box>
        </Column>
      </Box>
      <>
        {premises.map((premise, index) => (
          <Box padding={2}>
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
              />
            </Box>
            <Stack space={2} key={index}>
              <Input
                name="titleIs"
                label="Titill"
                value={premise.title.is ?? ''}
                onChange={(e) => onChange(index, 'title', e.target.value, 'is')}
                onFocus={(e) => setFocus(e.target.value)}
                onBlur={() => {
                  if (focus !== premise.title.is) {
                    formUpdate()
                  }
                  setFocus('')
                }}
                backgroundColor={'blue'}
              />
              <Input
                name={'titleEn'}
                label="Titill á ensku"
                value={premise.title.en ?? ''}
                onChange={(e) => onChange(index, 'title', e.target.value, 'en')}
                backgroundColor={'blue'}
              />
              <Input
                name={'descriptionIs'}
                label="Lýsing"
                value={premise.description.is ?? ''}
                onChange={(e) =>
                  onChange(index, 'description', e.target.value, 'is')
                }
                backgroundColor={'blue'}
              />
              <Input
                name={'descriptionEn'}
                label="Lýsing á ensku"
                value={premise.description.en ?? ''}
                onChange={(e) =>
                  onChange(index, 'description', e.target.value, 'en')
                }
                backgroundColor={'blue'}
              />
            </Stack>
          </Box>
        ))}
      </>
    </>
  )
}
