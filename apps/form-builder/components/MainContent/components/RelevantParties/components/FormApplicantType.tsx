import React, { useState } from 'react'
import {
  Box,
  GridColumn as Column,
  GridRow as Row,
  Input,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { IFormApplicantType, ILanguage } from '../../../../../types/interfaces'

interface Props {
  title: string
  nameSuggestions: ILanguage[]
  name: ILanguage
  formApplicantType: IFormApplicantType
  handleSelect(
    e: {
      label: string
      value: string
    },
    index: number,
  ): void
  index: number
  blur(value: string): void
  setOnFocus(value: string): void
  setFormApplicantTypes: React.Dispatch<
    React.SetStateAction<IFormApplicantType[]>
  >
  isOther: boolean
}

export function FormApplicantType({
  title,
  name,
  nameSuggestions,
  handleSelect,
  index,
  blur,
  setOnFocus,
  setFormApplicantTypes,
  isOther,
}: Props) {
  const [inputEnabled, setInputEnabled] = useState(isOther)

  const other = { label: 'Annað', value: 'Annað' }

  function getOptions() {
    const options = nameSuggestions.map((suggestion) => {
      return {
        label: suggestion.is,
        value: suggestion.en,
      }
    })
    options.push(other)
    return options
  }

  function handleSelectChange(e: { label: string; value: string }) {
    if (e.label === 'Annað') {
      setInputEnabled(true)
    } else {
      setInputEnabled(false)
      handleSelect(e, index)
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    language: 'is' | 'en',
  ) {
    setFormApplicantTypes((prev: IFormApplicantType[]) => {
      const newApplicantTypes = prev.map((f: IFormApplicantType, i: number) => {
        if (i === index) {
          return {
            ...f,
            name: {
              ...f.name,
              [language]: e.target.value,
            },
          }
        }
        return f
      })
      return newApplicantTypes
    })
  }

  return (
    <Box marginBottom={2}>
      <Stack space={2}>
        <Row>
          <Column>
            <Box marginBottom={1}>
              <Text variant="h4">{title}</Text>
            </Box>
          </Column>
        </Row>
        <Row>
          <Column span="5/10">
            <Select
              label="Tillögur"
              name="suggestions"
              backgroundColor="blue"
              defaultValue={
                isOther ? other : { label: name.is, value: name.en }
              }
              options={getOptions()}
              onChange={handleSelectChange}
            />
          </Column>
        </Row>
        <Row>
          <Column span="5/10">
            <Input
              label="Heiti"
              name="name"
              backgroundColor="blue"
              value={name.is}
              disabled={!inputEnabled}
              onFocus={(e) => setOnFocus(e.target.value)}
              onBlur={(e) => blur(e.target.value)}
              onChange={(e) => handleInputChange(e, 'is')}
            />
          </Column>
          <Column span="5/10">
            <Input
              label="Heiti (enska)"
              name="nameEn"
              backgroundColor="blue"
              value={name.en}
              disabled={!inputEnabled}
              onFocus={(e) => setOnFocus(e.target.value)}
              onBlur={(e) => blur(e.target.value)}
              onChange={(e) => handleInputChange(e, 'en')}
            />
          </Column>
        </Row>
      </Stack>
    </Box>
  )
}
