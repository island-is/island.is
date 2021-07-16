import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { MinistrySlug } from '@island.is/regulations'
import {
  Box,
  Option,
  DatePicker,
  Input,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { EditorInput } from './EditorInput'
import { editorMsgs as msg } from '../messages'
import { HTMLText } from '@island.is/regulations'
import { RegDraftForm, useDraftingState } from '../state/useDraftingState'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { emptyOption, findValueOption } from '../utils'
import { RegulationMinistry } from '@island.is/regulations/web'

const MinistriesQuery = gql`
  query RegulationMinistriesQuery {
    getRegulationMinistries
  }
`

type WrapProps = {
  legend?: string
  children: ReactNode
}
const Wrap = (props: WrapProps) => (
  <Box marginBottom={2} aria-label={props.legend}>
    {props.legend && (
      <Text
        variant="small"
        as="h4"
        color="blue400"
        fontWeight="medium"
        marginBottom={1}
      >
        {props.legend}
      </Text>
    )}
    {props.children}
  </Box>
)

export type EditBasicsProps = {
  draft: RegDraftForm
  new?: boolean
  actions?: any
}

export const EditBasics = (props: EditBasicsProps) => {
  const t = useIntl().formatMessage
  const { draft, actions } = props

  const [titleValue, setTitleValue] = useState(draft.title?.value)
  const [ministryValue, setMinistryValue] = useState(draft.ministry?.value)
  const [dateValue, setDateValue] = useState(draft.idealPublishDate?.value)

  const textRef = useRef(() => draft.text.value)

  const {
    data: getRegulationMinistriesData,
    loading: getRegulationMinistriesLoading,
  } = useQuery<Query>(MinistriesQuery)
  const { getRegulationMinistries: ministries } =
    getRegulationMinistriesData || {}

  const ministryOptions = useMemo(() => {
    return [emptyOption(t(msg.chooseMinistry))].concat(
      ministries?.map(
        (m: RegulationMinistry): Option => ({
          value: m.slug,
          label: m.name + (m.current ? '' : ` ${t(msg.legacyMinistry)}`),
        }),
      ) ?? [],
    ) as ReadonlyArray<Option>
  }, [ministries, t])

  const onAnyInputChange = useCallback(
    (data: { name: string; value: string | Date }) => {
      actions.updateState({ ...data })
    },
    [actions],
  )

  useEffect(() => {
    onAnyInputChange({
      name: 'title',
      value: titleValue,
    })
  }, [titleValue, onAnyInputChange])

  useEffect(() => {
    onAnyInputChange({
      name: 'ministry',
      value: ministryValue as string,
    })
  }, [ministryValue, onAnyInputChange])

  useEffect(() => {
    onAnyInputChange({
      name: 'idealPublishDate',
      value: dateValue as Date,
    })
  }, [dateValue, onAnyInputChange])

  return (
    <>
      <Wrap>
        <Input
          label={t(msg.title)}
          name="title"
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
        />
      </Wrap>

      <Wrap>
        <EditorInput
          label={t(msg.text)}
          baseText={'' as HTMLText}
          initialText={draft.text.value}
          isImpact={false}
          draftId={draft.id}
          valueRef={textRef}
          onChange={() =>
            onAnyInputChange({
              name: 'text',
              value: textRef.current(),
            })
          }
        />
      </Wrap>

      <Wrap>
        <Select
          name="rn"
          isSearchable
          label={t(msg.ministry)}
          placeholder={t(msg.ministry)}
          value={findValueOption(ministryOptions, ministryValue)}
          options={ministryOptions}
          onChange={(option) =>
            setMinistryValue((option as Option).value as MinistrySlug)
          }
          size="sm"
        />
      </Wrap>

      <Wrap>
        <DatePicker
          label={t(msg.idealPublishDate)}
          placeholderText={t(msg.idealPublishDate_soon)}
          minDate={new Date()}
          selected={dateValue ? new Date(dateValue) : null}
          handleChange={(date: Date) => setDateValue(date)}
        />
      </Wrap>
    </>
  )
}
