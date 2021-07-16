import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Box,
  Option,
  DatePicker,
  Input,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { RegDraftForm, StepComponent } from '../state/useDraftingState'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { RegulationMinistry } from '@island.is/regulations/web'
import { editorMsgs as msg } from '../messages'
import { emptyOption, findValueOption } from '../utils'
import { MinistrySlug } from '@island.is/regulations'

type WrapProps = {
  legend?: string
  children: ReactNode
}

const MinistriesQuery = gql`
  query RegulationMinistriesQuery {
    getRegulationsMinistries
  }
`

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

export const EditMeta: StepComponent = (props) => {
  const t = useIntl().formatMessage
  const { draft, actions } = props
  const textRef = useRef(() => draft.text)

  const {
    data: getRegulationsMinistriesData,
    loading: getRegulationsMinistriesLoading,
  } = useQuery<Query>(MinistriesQuery)
  const { getRegulationsMinistries: ministries } =
    getRegulationsMinistriesData || {}

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

  console.log('ministry!!!', draft.ministry?.value);


  const [ministryValue, setMinistryValue] = useState(draft.ministry?.value)

  useEffect(() => {
    onAnyInputChange({
      name: 'ministry',
      value: ministryValue as string,
    })
  }, [ministryValue, onAnyInputChange])

  return (
    <>
      <Wrap>
        <p>Meta step</p>
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
    </>
  )
}
