import { Box, Checkbox, Icon, Select, Tag } from '@island.is/island-ui/core'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { publishing } from '../../lib/messages'
import { AnswerOption, InputFields, OJOIFieldBaseProps } from '../../lib/types'
import { getWeekendDates } from '../../lib/utils'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import {
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import addYears from 'date-fns/addYears'
import { Controller, useFormContext } from 'react-hook-form'
import { CommunicationChannels } from '../../components/CommunicationChannels/CommunicationChannels'
import { getErrorViaPath } from '@island.is/application/core'
import { useLazyQuery } from '@apollo/client'
import { CATEGORIES_QUERY } from '../../graphql/queries'
import { useEffect, useState } from 'react'
import { MinistryOfJusticeAdvertEntity } from '@island.is/api/schema'

type SelectableCategory = { label: string; value: string }

export const Publishing = ({ application, errors }: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)

  const { setValue } = useFormContext()

  const { answers } = application

  const today = new Date()
  const maxEndDate = addYears(today, 5)

  const [categories, setCategories] = useState<SelectableCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<
    SelectableCategory[]
  >(answers.publishing?.contentCategories ?? [])

  const [lazyCategoryQuery] = useLazyQuery(CATEGORIES_QUERY, {
    onError: (error) => {
      console.error('error', error)
    },
    onCompleted: (data) => {
      setCategories(
        data.ministryOfJusticeCategories.categories.map(
          (c: MinistryOfJusticeAdvertEntity) => ({
            label: c.title,
            value: c.id,
          }),
        ),
      )
    },
    variables: {
      input: {
        search: '',
      },
    },
  })

  useEffect(() => {
    lazyCategoryQuery()
  }, [])

  const onSelect = (label: string, value: string) => {
    const so = selectedCategories.find((c) => c.value === value)

    if (so) {
      const filtered = selectedCategories.filter((c) => c.value !== value)
      setSelectedCategories(filtered)
      setValue(InputFields.publishing.contentCategories, filtered)
    } else {
      const updated = [...selectedCategories, { label: label, value }]
      setSelectedCategories(updated)
      setValue(InputFields.publishing.contentCategories, updated)
    }
  }

  return (
    <>
      <FormIntro
        title={f(publishing.general.formTitle)}
        intro={f(publishing.general.formIntro)}
      />
      <FormGroup title={f(publishing.dateChapter.title)}>
        <DatePickerController
          backgroundColor="blue"
          size="sm"
          name={InputFields.publishing.date}
          id={InputFields.publishing.date}
          label={f(publishing.inputs.datepicker.label)}
          minDate={today}
          maxDate={maxEndDate}
          defaultValue={answers.publishing?.date ?? ''}
          excludeDates={getWeekendDates(today, maxEndDate)}
          error={getErrorViaPath(errors, InputFields.publishing.date)}
        />
        <Controller
          name={InputFields.publishing.fastTrack}
          defaultValue={
            application.answers.publishing?.fastTrack ?? AnswerOption.NO
          }
          render={({ field: { onChange, value } }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(
                    e.target.checked ? AnswerOption.YES : AnswerOption.NO,
                  )
                }}
                checked={value === AnswerOption.YES}
                label={f(publishing.inputs.fastTrack.label)}
                name={InputFields.publishing.fastTrack}
                id={InputFields.publishing.fastTrack}
              />
            )
          }}
        />
      </FormGroup>
      <FormGroup>
        <Box width="half">
          <Select
            size="sm"
            backgroundColor="blue"
            id={InputFields.publishing.contentCategories}
            name={InputFields.publishing.contentCategories}
            label={f(publishing.inputs.contentCategories.label)}
            options={categories}
            onChange={(e) =>
              e?.label && e?.value ? onSelect(e.label, e.value) : undefined
            }
          />
          <Box
            marginTop={1}
            display="flex"
            flexWrap="wrap"
            rowGap={1}
            columnGap={1}
          >
            {selectedCategories.map((c, i) => (
              <Tag key={i} outlined onClick={() => onSelect(c.label, c.value)}>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  columnGap={1}
                >
                  {c.label}
                  <Icon icon="close" size="small" />
                </Box>
              </Tag>
            ))}
          </Box>
        </Box>
      </FormGroup>
      <FormGroup
        title={f(publishing.communicationChapter.title)}
        description={f(publishing.communicationChapter.intro)}
      >
        <Box width="full">
          <Controller
            name={InputFields.publishing.communicationChannels}
            defaultValue={
              application.answers.publishing?.communicationChannels ?? []
            }
            render={({ field: { onChange, value } }) => {
              return (
                <CommunicationChannels
                  onChange={(channels) => onChange(channels)}
                  channels={
                    application.answers.publishing?.communicationChannels ?? []
                  }
                />
              )
            }}
          />
        </Box>
      </FormGroup>

      <FormGroup
        title={f(publishing.messagesChapter.title)}
        description={f(publishing.messagesChapter.intro)}
      >
        <Box width="full">
          <InputController
            id={InputFields.publishing.message}
            name={InputFields.publishing.message}
            textarea
            rows={4}
            placeholder={f(publishing.inputs.messages.placeholder)}
            label={f(publishing.inputs.messages.label)}
          />
        </Box>
      </FormGroup>
    </>
  )
}
