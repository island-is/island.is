import React from 'react'
import {
  Box,
  Button,
  Column,
  Columns,
  DatePicker,
  Input,
} from '@island.is/island-ui/core'
import { StepComponent } from '../state/useDraftingState'
import { editorMsgs as msg } from '../messages'
import { useLocale } from '../utils'
import { LawChapterSlug } from '@island.is/regulations'
import { LawChaptersSelect } from './LawChaptersSelect'

export const EditMeta: StepComponent = (props) => {
  const { formatMessage: t } = useLocale()
  const { draft, actions } = props
  const { updateState, updateLawChapterProp } = actions

  const type = draft.type.value
  const typeName =
    type && t(type === 'amending' ? msg.type_amending : msg.type_base)

  return (
    <>
      <Columns space={3} collapseBelow="lg">
        <Column>
          <Box marginBottom={3}>
            <Input
              label={t(msg.type)}
              value={typeName || ''}
              placeholder={t(msg.typePlaceholder)}
              name="_type"
              size="sm"
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
