import React, { useMemo } from 'react'

import { Box, Inline, Option, Select, Tag } from '@island.is/island-ui/core'
import { editorMsgs as msg } from '../messages'

import { LawChapter, LawChapterSlug } from '@island.is/regulations'
import { emptyOption, useLocale } from '../utils'
import { useDraftingState } from '../state/useDraftingState'

const useLawChapterOptions = (
  lawChapters: Array<LawChapter>,
  activeChapters: ReadonlyArray<LawChapterSlug>,
  placeholder: string,
) =>
  useMemo(
    () => [
      emptyOption(placeholder, true),
      ...lawChapters.map(
        (ch): Option => ({
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

  const lawChaptersOptions = useLawChapterOptions(
    lawChapters.list,
    activeChapters,
    t(msg.lawChapterPlaceholder),
  )

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
          actions.updateLawChapterProp(
            'add',
            (option as Option).value as LawChapterSlug,
          )
        }
        backgroundColor="blue"
        hasError={chaptersField.showError && !!chaptersField.error}
        errorMessage={t(chaptersField.error)}
      />

      {activeChapters.length > 0 && (
        <Box marginTop={2}>
          <Inline space={2}>
            {activeChapters.map((slug) => (
              <Tag
                key={slug}
                onClick={() => actions.updateLawChapterProp('delete', slug)}
                removable
              >
                {lawChapters.bySlug[slug]}
              </Tag>
            ))}
          </Inline>
        </Box>
      )}
    </Box>
  )
}
