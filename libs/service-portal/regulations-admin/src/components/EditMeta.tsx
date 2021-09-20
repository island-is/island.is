import React from 'react'
import {
  Box,
  Button,
  Column,
  Columns,
  DatePicker,
  Input,
  Option,
  Select,
} from '@island.is/island-ui/core'
import { StepComponent } from '../state/useDraftingState'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { RegulationLawChapter } from '@island.is/regulations/web'
import { editorMsgs as msg } from '../messages'
import { findValueOption, useLocale } from '../utils'
import { regulationTypes } from '../utils/constants'
import { LawChapterSlug, RegulationType } from '@island.is/regulations'
import { LawChaptersSelect } from './LawChaptersSelect'
import { useMinistriesQuery } from '@island.is/service-portal/graphql'

const LawChaptersQuery = gql`
  query DraftRegulationsLawChaptersQuery {
    getDraftRegulationsLawChapters
  }
`

// ---------------------------------------------------------------------------

export const EditMeta: StepComponent = (props) => {
  const { formatMessage: t, formatDateFns } = useLocale()
  const { draft, actions } = props
  const { updateState, updateLawChapterProp } = actions

  const lawChapterQuery = useQuery<Query>(LawChaptersQuery)
  const lawChapters = lawChapterQuery.data
    ?.getDraftRegulationsLawChapters as RegulationLawChapter[]

  const { ministries } = useMinistriesQuery()
  const ministryName = (ministries || []).find(
    (m) => m.slug === draft.ministry.value,
  )?.name

  return (
    <>
      <Columns space={3} collapseBelow="lg">
        <Column>
          <Box marginBottom={3}>
            <Input
              label={t(msg.ministry)}
              value={ministryName || draft.ministry.value}
              placeholder={t(msg.ministryPlaceholder)}
              name="_rn"
              size="sm"
              backgroundColor="blue"
              readOnly
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
              errorMessage={t(draft.type.error)}
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
            <Input
              label={t(msg.signatureDate)}
              value={
                draft.signatureDate.value &&
                formatDateFns(draft.signatureDate.value, 'dd/mm/yyyy')
              }
              placeholder={t(msg.signatureDatePlaceholder)}
              name="_signatureDate"
              size="sm"
              backgroundColor="blue"
              readOnly
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
              errorMessage={t(draft.effectiveDate.error)}
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
