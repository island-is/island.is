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
import {
  FormSystemFormApplicantType,
  FormSystemLanguageType,
} from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../../../lib/messages'

interface Props {
  title: string
  nameSuggestions?: FormSystemLanguageType[]
  name: FormSystemLanguageType
  formApplicantType: FormSystemFormApplicantType
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
    React.SetStateAction<FormSystemFormApplicantType[]>
  >
  isOther: boolean
}

export const FormApplicantType = ({
  title,
  name,
  nameSuggestions,
  handleSelect,
  index,
  blur,
  setOnFocus,
  setFormApplicantTypes,
  isOther,
}: Props) => {
  const [inputEnabled, setInputEnabled] = useState(false)
  const other = { label: 'Annað', value: 'Annað' }
  const { formatMessage } = useIntl()
  const getOptions = () => {
    const options =
      nameSuggestions?.map((suggestion) => {
        return {
          label: suggestion?.is ?? '',
          value: suggestion?.en ?? '',
        }
      }) || []
    options.push(other)
    return options
  }

  const handleSelectChange = (e: { label: string; value: string }) => {
    if (e.label === 'Annað') {
      setInputEnabled(true)
    } else {
      setInputEnabled(false)
      handleSelect(e, index)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    language: 'is' | 'en',
  ) => {
    setFormApplicantTypes((prev: FormSystemFormApplicantType[]) => {
      const newApplicantTypes = prev.map(
        (f: FormSystemFormApplicantType, i: number) => {
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
        },
      )
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
              label={formatMessage(m.suggestions)}
              name="suggestions"
              backgroundColor="blue"
              defaultValue={
                isOther ? other : { label: name.is ?? '', value: name.en ?? '' }
              }
              options={getOptions()}
              onChange={(e) =>
                handleSelectChange(e ?? { label: '', value: '' })
              }
            />
          </Column>
        </Row>
        <Row>
          <Column span="5/10">
            <Input
              label={formatMessage(m.name)}
              name="name"
              backgroundColor="blue"
              value={name.is ?? ''}
              disabled={!inputEnabled}
              onFocus={(e) => setOnFocus(e.target.value)}
              onBlur={(e) => blur(e.target.value)}
              onChange={(e) => handleInputChange(e, 'is')}
            />
          </Column>
          <Column span="5/10">
            <Input
              label={formatMessage(m.nameEnglish)}
              name="nameEn"
              backgroundColor="blue"
              value={name.en ?? ''}
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
