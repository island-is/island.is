import React, { useMemo } from 'react'
import {
  Box,
  Button,
  Column,
  Columns,
  DatePicker,
  Option,
  Select,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { StepComponent } from '../state/useDraftingState'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  RegulationLawChapter,
  RegulationMinistry,
} from '@island.is/regulations/web'
import { editorMsgs as msg } from '../messages'
import { emptyOption, findValueOption } from '../utils'
import { regulationTypes } from '../utils/constants'
import {
  MinistrySlug,
  LawChapterSlug,
  RegulationType,
} from '@island.is/regulations'
import { LawChaptersSelect } from './LawChaptersSelect'

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

// ---------------------------------------------------------------------------

export const EditMeta: StepComponent = (props) => {
  const t = useIntl().formatMessage
  const { draft, actions } = props
  const { updateState, updateLawChapterProp } = actions
  // const textRef = useRef(() => draft.text)

  // FIXME: Remove the any typing on these...
  const ministryQuery = useQuery<Query>(MinistriesQuery)
  const lawChapterQuery = useQuery<Query>(LawChaptersQuery)

  const ministries = ministryQuery.data
    ?.getDraftRegulationsMinistries as RegulationMinistry[]
  const lawChapters = lawChapterQuery.data
    ?.getDraftRegulationsLawChapters as RegulationLawChapter[]

  const ministryOptions = useMemo((): ReadonlyArray<Option> => {
    return [
      emptyOption(t(msg.ministryPlaceholder)),
      ...(ministries || []).map((m) => ({
        value: m.slug,
        label: m.name,
      })),
    ]
  }, [ministries, t])

  return (
    <>
      <Columns space={3} collapseBelow="lg">
        <Column>
          <Box marginBottom={3}>
            <Select
              label={t(msg.ministry)}
              name="rn"
              isSearchable
              placeholder={t(msg.ministry)}
              value={findValueOption(ministryOptions, draft.ministry.value)}
              options={ministryOptions}
              required
              errorMessage={t(msg.requiredFieldError)}
              hasError={!!draft.ministry.error}
              onChange={(option) =>
                updateState(
                  'ministry',
                  (option as Option).value as MinistrySlug,
                )
              }
              size="sm"
            />
          </Box>
        </Column>
        <Column>
          <Box marginBottom={3}>
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
                updateState(
                  'type',
                  (typeOption as Option).value as RegulationType,
                )
              }
            />
          </Box>
        </Column>
      </Columns>

      <Columns space={3} collapseBelow="lg">
        <Column>
          <Box marginBottom={3}>
            <DatePicker
              label={t(msg.signatureDate)}
              size="sm"
              placeholderText={t(msg.signatureDate)}
              selected={draft.signatureDate.value}
              required
              errorMessage={t(msg.requiredFieldError)}
              hasError={!!draft.signatureDate.error}
              handleChange={(date: Date) => updateState('signatureDate', date)}
            />
          </Box>
        </Column>
        <Column>
          <Box marginBottom={3}>
            <DatePicker
              size="sm"
              label={t(msg.effectiveDate)}
              placeholderText={t(msg.effectiveDate_default)}
              minDate={draft.idealPublishDate.value || null}
              selected={draft.effectiveDate.value}
              handleChange={(date: Date) => updateState('effectiveDate', date)}
              hasError={!!draft.effectiveDate.error}
              errorMessage={t(msg.requiredFieldError)}
            />
            {!!draft.effectiveDate.value && (
              <Button
                size="small"
                variant="text"
                preTextIcon="close"
                onClick={() => {
                  updateState('effectiveDate', undefined)
                }}
              >
                {t(msg.effectiveDate_default)}
              </Button>
            )}
          </Box>
        </Column>
      </Columns>

      <Box>
        <LawChaptersSelect
          lawChapters={lawChapters}
          activeChapters={draft.lawChapters.value}
          addChapter={(slug: LawChapterSlug) =>
            updateLawChapterProp('add', slug)
          }
          removeChapter={(slug: LawChapterSlug) =>
            updateLawChapterProp('delete', slug)
          }
        />
      </Box>
    </>
  )
}
