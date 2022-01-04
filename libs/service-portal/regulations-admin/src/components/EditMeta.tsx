import React from 'react'
import {
  Box,
  Button,
  Column,
  Columns,
  DatePicker,
  Option,
  Select,
} from '@island.is/island-ui/core'
import { StepComponent } from '../state/useDraftingState'
import { editorMsgs as msg } from '../messages'
import { findValueOption, useLocale } from '../utils'
import { regulationTypes } from '../utils/constants'
import { LawChapterSlug, RegulationType } from '@island.is/regulations'
import { LawChaptersSelect } from './LawChaptersSelect'

export const EditMeta: StepComponent = (props) => {
  const { formatMessage: t } = useLocale()
  const { draft, actions } = props
  const { updateState, updateLawChapterProp } = actions

  return (
    <>
      <Columns space={3} collapseBelow="lg">
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
                  true,
                )
              }
              backgroundColor="blue"
            />
          </Box>

          <Box marginBottom={3}>
            <DatePicker
              size="sm"
              label={t(msg.effectiveDate)}
              placeholderText={t(msg.effectiveDate_default)}
              minDate={draft.idealPublishDate.value || null}
              selected={draft.effectiveDate.value}
              handleChange={(date: Date) =>
                updateState('effectiveDate', date, true)
              }
              hasError={!!draft.effectiveDate.error}
              errorMessage={t(draft.effectiveDate.error)}
              backgroundColor="blue"
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
