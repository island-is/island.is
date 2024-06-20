import { useLocale } from '@island.is/localization'
import { FormGroup } from '../components/form/FormGroup'
import {
  InputFields,
  OfficialJournalOfIcelandGraphqlResponse,
  OJOIFieldBaseProps,
  Override,
} from '../lib/types'
import { publishing } from '../lib/messages'
import {
  AnswerOption,
  DEBOUNCE_INPUT_TIMER,
  MINIMUM_WEEKDAYS,
  INITIAL_ANSWERS,
} from '../lib/constants'
import { useCallback, useEffect, useState } from 'react'
import {
  CheckboxController,
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'
import { Box, Icon, Select, Tag } from '@island.is/island-ui/core'
import addYears from 'date-fns/addYears'
import { addWeekdays, getWeekendDates } from '../lib/utils'
import { useMutation, useQuery } from '@apollo/client'
import { CATEGORIES_QUERY } from '../graphql/queries'
import { ChannelList } from '../components/communicationChannels/ChannelList'
import { AddChannel } from '../components/communicationChannels/AddChannel'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'

type LocalState = Override<
  typeof INITIAL_ANSWERS['publishing'],
  {
    contentCategories: CategoryOption[]
    communicationChannels: Channel[]
  }
>

type Channel = {
  email: string
  phone: string
}

type CategoryOption = {
  label: string
  value: string
}

export const Publishing = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f, locale } = useLocale()
  const { application } = props
  const { answers } = application

  const today = new Date()
  const maxEndDate = addYears(today, 5)
  const minDate = new Date()
  if (minDate.getHours() >= 12) {
    minDate.setDate(minDate.getDate() + 1)
  }

  const defaultDate = answers.publishing?.date
    ? new Date(answers.publishing.date).toISOString().split('T')[0]
    : addWeekdays(today, MINIMUM_WEEKDAYS).toISOString().split('T')[0]

  const { setValue, clearErrors } = useFormContext()

  const [channelState, setChannelState] = useState<Channel>({
    email: '',
    phone: '',
  })

  const [categories, setCategories] = useState<CategoryOption[]>([])

  const [state, setState] = useState<LocalState>({
    date: answers.publishing?.date ?? '',
    contentCategories:
      answers.publishing?.contentCategories ?? ([] as CategoryOption[]),
    communicationChannels:
      answers.publishing?.communicationChannels ?? ([] as Channel[]),
    message: answers.publishing?.message ?? '',
  })

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  useQuery<OfficialJournalOfIcelandGraphqlResponse<'categories'>>(
    CATEGORIES_QUERY,
    {
      variables: {
        params: {
          pageSize: 1000,
        },
      },
      onCompleted: (data) => {
        setCategories(
          data.officialJournalOfIcelandCategories.categories.map(
            (category) => ({
              label: category.title,
              value: category.id,
            }),
          ),
        )
      },
    },
  )

  const onSelect = (opt: CategoryOption) => {
    if (!opt.value) return

    const shouldAdd = !state.contentCategories.some(
      (category) => category.value === opt.value,
    )
    const updatedCategories = shouldAdd
      ? [...state.contentCategories, { label: opt.label, value: opt.value }]
      : state.contentCategories.filter(
          (category) => category.value !== opt.value,
        )

    setState({ ...state, contentCategories: updatedCategories })
    setValue(InputFields.publishing.contentCategories, updatedCategories)
  }

  const onEditChannel = (channel: Channel) => {
    onRemoveChannel(channel)
    setChannelState(channel)
  }

  const onRemoveChannel = (channel: Channel) => {
    setState({
      ...state,
      communicationChannels: state.communicationChannels.filter(
        (c) => c.email !== channel.email,
      ),
    })
  }

  const onAddChannel = (channel: Channel) => {
    setState({
      ...state,
      communicationChannels: [...state.communicationChannels, channel],
    })
  }

  const updateHandler = useCallback(async () => {
    await updateApplication({
      variables: {
        locale,
        input: {
          skipValidation: true,
          id: application.id,
          answers: {
            ...application.answers,
            publishing: state,
          },
        },
      },
    })

    setValue(InputFields.publishing.date, state.date)
    setValue(InputFields.publishing.contentCategories, state.contentCategories)
    setValue(
      InputFields.publishing.communicationChannels,
      state.communicationChannels,
    )
    setValue(InputFields.publishing.message, state.message)
  }, [
    application.answers,
    application.id,
    locale,
    setValue,
    state,
    updateApplication,
  ])

  const updateState = useCallback((newState: typeof state) => {
    setState((prev) => ({ ...prev, ...newState }))
  }, [])

  useEffect(() => {
    updateHandler()
  }, [updateHandler])
  const debouncedStateUpdate = debounce(updateState, DEBOUNCE_INPUT_TIMER)

  return (
    <>
      <FormGroup title={f(publishing.headings.date)}>
        <Box width="half">
          <DatePickerController
            id={InputFields.publishing.date}
            label={f(publishing.inputs.datepicker.label)}
            placeholder={f(publishing.inputs.datepicker.placeholder)}
            key={defaultDate}
            backgroundColor="blue"
            size="sm"
            locale="is"
            defaultValue={defaultDate}
            minDate={minDate}
            maxDate={maxEndDate}
            excludeDates={getWeekendDates(today, maxEndDate)}
            onChange={(date) => setState({ ...state, date })}
            error={
              props.errors &&
              getErrorViaPath(props.errors, InputFields.publishing.date)
            }
          />
        </Box>
        <Box width="half">
          <Select
            size="sm"
            backgroundColor="blue"
            id={InputFields.publishing.contentCategories}
            name={InputFields.publishing.contentCategories}
            label={f(publishing.inputs.contentCategories.label)}
            options={categories}
            hasError={
              props.errors &&
              !!getErrorViaPath(
                props.errors,
                InputFields.publishing.contentCategories,
              )
            }
            errorMessage={
              props.errors &&
              getErrorViaPath(
                props.errors,
                InputFields.publishing.contentCategories,
              )
            }
            onChange={(opt) => {
              if (!opt) return
              clearErrors(InputFields.publishing.contentCategories)
              onSelect({ label: opt.label, value: opt.value })
            }}
          />
          <Box
            marginTop={1}
            display="flex"
            flexWrap="wrap"
            rowGap={1}
            columnGap={1}
          >
            {state.contentCategories.map((c, i) => (
              <Tag key={i} outlined onClick={() => onSelect(c)}>
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
        title={f(publishing.headings.communications)}
        intro={f(publishing.general.communicationIntro)}
      >
        <ChannelList
          channels={state.communicationChannels}
          onEditChannel={onEditChannel}
          onRemoveChannel={onRemoveChannel}
        />
        <AddChannel
          state={channelState}
          setState={setChannelState}
          onAdd={onAddChannel}
        />
      </FormGroup>
      <FormGroup title={f(publishing.headings.messages)}>
        <InputController
          label={f(publishing.inputs.messages.label)}
          placeholder={f(publishing.inputs.messages.placeholder)}
          id={InputFields.publishing.message}
          defaultValue={state.message}
          onChange={(e) =>
            debouncedStateUpdate({ ...state, message: e.target.value })
          }
          textarea
          rows={4}
        />
      </FormGroup>
    </>
  )
}
