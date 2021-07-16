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
import { LawChaptersSelect } from './LawChaptersSelect'

type WrapProps = {
  legend?: string
  children: ReactNode
}

const MinistriesQuery = gql`
  query DraftRegulationMinistriesQuery {
    getDraftRegulationsMinistries
  }
`

const LawChaptersQuery = gql`
  query DraftRegulationsLawChaptersQuery {
    getDraftRegulationsLawChapters
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
    data: getDraftRegulationsMinistriesData,
    loading: getDraftRegulationsMinistriesLoading,
  } = useQuery<Query>(MinistriesQuery)
  const { getDraftRegulationsMinistries: ministries } =
    getDraftRegulationsMinistriesData || {}

  const {
    data: getDraftRegulationsLawChaptersData,
    loading: getDraftRegulationsLawChaptersLoading,
  } = useQuery<Query>(LawChaptersQuery)
  const { getDraftRegulationsLawChapters: lawChapters } =
    getDraftRegulationsLawChaptersData || {}

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

  return (
    <>
      <Wrap>
        <Select
          name="rn"
          isSearchable
          label={t(msg.ministry)}
          placeholder={t(msg.ministry)}
          value={findValueOption(ministryOptions, draft.ministry.value)}
          options={ministryOptions}
          onChange={(option) =>
            actions.updateState({
              name: 'ministry',
              value: (option as Option).value as MinistrySlug,
            })
          }
          size="sm"
        />
      </Wrap>
      <Wrap>
        <LawChaptersSelect
          lawChapters={lawChapters}
          activeChapters={draft.lawChapters.value}
          addChapter={() => undefined}
          removeChapter={() => undefined}
        />
      </Wrap>
    </>
  )
}
