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
import { StepComponent } from '../state/useDraftingState'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { RegulationMinistry } from '@island.is/regulations/web'
import { editorMsgs as msg } from '../messages'
import {
  emptyOption,
  findValueOption,
  findSignatureInText,
  findRegulationType,
} from '../utils'
import { regulationTypes } from '../utils/constants'
import {
  MinistrySlug,
  LawChapterSlug,
  RegulationType,
} from '@island.is/regulations'
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
  // const textRef = useRef(() => draft.text)

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
          required
          errorMessage={t(msg.requiredFieldError)}
          hasError={!!draft.ministry?.error}
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
          addChapter={(chapter: LawChapterSlug) =>
            actions.updateLawChapterProp({ action: 'add', value: chapter })
          }
          removeChapter={(chapter: LawChapterSlug) =>
            actions.updateLawChapterProp({ action: 'delete', value: chapter })
          }
        />
      </Wrap>
      <Wrap>
        <Select
          name="type-select"
          placeholder={t(msg.type)}
          size="sm"
          isSearchable={false}
          label={t(msg.type)}
          options={regulationTypes}
          value={findValueOption(regulationTypes, draft.type.value)}
          required
          errorMessage={t(msg.requiredFieldError)}
          hasError={!!draft.type.error}
          onChange={(typeOption) =>
            actions.updateState({
              name: 'type',
              value: (typeOption as Option).value as RegulationType,
            })
          }
        />
      </Wrap>
      <Wrap>
        <DatePicker
          label={t(msg.signatureDate)}
          size="sm"
          placeholderText={t(msg.signatureDate)}
          selected={draft.signatureDate?.value}
          required
          errorMessage={t(msg.requiredFieldError)}
          hasError={!!draft.signatureDate?.error}
          handleChange={(date: Date) =>
            actions.updateState({
              name: 'signatureDate',
              value: date,
            })
          }
        />
      </Wrap>
      <Wrap>
        <DatePicker
          label={t(msg.effectiveDate)}
          size="sm"
          placeholderText={t(msg.effectiveDate)}
          selected={draft.effectiveDate?.value}
          minDate={draft.idealPublishDate?.value || null}
          required
          errorMessage={t(msg.requiredFieldError)}
          hasError={!!draft.effectiveDate.error}
          handleChange={(date: Date) =>
            actions.updateState({
              name: 'effectiveDate',
              value: date,
            })
          }
        />
      </Wrap>
    </>
  )
}
