import { useEffect, useMemo } from 'react'

import { Box, Inline, Option, Select } from '@island.is/island-ui/core'
import { editorMsgs as msg } from '../lib/messages'

import { LawChapter, LawChapterSlug } from '@island.is/regulations'
import { emptyOption } from '../utils'
import { useDraftingState } from '../state/useDraftingState'
import { useLocale } from '@island.is/localization'
import { useRegulationListQuery } from '../utils/dataHooks'
import { RegulationTag } from './RegulationTag'

const useLawChapterOptions = (
  lawChapters: Array<LawChapter>,
  activeChapters: ReadonlyArray<LawChapterSlug>,
  placeholder: string,
) =>
  useMemo(
    () => [
      emptyOption(placeholder, true),
      ...lawChapters.map(
        (ch): Option<LawChapterSlug> => ({
          value: ch.slug,
          label: ch.name,
          disabled: activeChapters.includes(ch.slug),
        }),
      ),
    ],
    [lawChapters, activeChapters, placeholder],
  )

// ---------------------------------------------------------------------------

export const LawChaptersSelect = () => {
  const { draft, lawChapters, actions } = useDraftingState()
  const t = useLocale().formatMessage
  const chaptersField = draft.lawChapters
  const activeChapters = chaptersField.value

  const { data: mentionedList /*, loading  , error */ } =
    useRegulationListQuery(draft.mentioned)

  const lawChaptersOptions = useLawChapterOptions(
    lawChapters.list,
    activeChapters,
    t(msg.lawChapterPlaceholder),
  )

  // Auto fill lawChapters if there are mentions and no lawchapters present
  useEffect(() => {
    if (mentionedList?.length && !draft.lawChapters.value.length) {
      mentionedList.forEach((mention) => {
        mention.lawChapters?.forEach((ch) => {
          actions.updateLawChapterProp('add', ch.slug)
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentionedList])

  return (
    <Box>
      <Select
        size="sm"
        label={t(msg.lawChapters)}
        name="addLawChapter"
        isSearchable
        value={lawChaptersOptions[0]}
        placeholder={'Lagakafli'}
        options={lawChaptersOptions}
        onChange={(option) =>
          actions.updateLawChapterProp('add', option?.value as LawChapterSlug)
        }
        backgroundColor="blue"
        hasError={chaptersField.showError && !!chaptersField.error}
        errorMessage={chaptersField.error && t(chaptersField.error)}
      />

      {activeChapters.length > 0 && (
        <Box marginTop={2}>
          <Inline space={2}>
            {activeChapters.map((slug) => (
              <RegulationTag
                key={slug}
                onClick={() => actions.updateLawChapterProp('delete', slug)}
                removable
              >
                {lawChapters.bySlug[slug]}
              </RegulationTag>
            ))}
          </Inline>
        </Box>
      )}
    </Box>
  )
}
