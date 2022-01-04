import React, { useMemo } from 'react'

import { Box, Inline, Option, Select, Tag } from '@island.is/island-ui/core'
import { editorMsgs as msg } from '../messages'

import { LawChapterSlug } from '@island.is/regulations'
import { emptyOption, useLocale } from '../utils'
import { useLawChaptersQuery } from '@island.is/service-portal/graphql'

const useLawChapters = (
  activeChapters: ReadonlyArray<LawChapterSlug>,
  placeholder: string,
) => {
  const lawChapters = useLawChaptersQuery().data

  const chaptersBySlug = useMemo(
    () =>
      (lawChapters || []).reduce<Record<string, string>>((map, ch) => {
        map[ch.slug] = ch.name
        return map
      }, {}),
    [lawChapters],
  )

  const lawChaptersOptions = useMemo(
    () => [
      emptyOption(placeholder),
      ...(lawChapters || []).map(
        (ch): Option => ({
          value: ch.slug,
          label: ch.name,
          disabled: activeChapters.includes(ch.slug),
        }),
      ),
    ],
    [lawChapters, activeChapters, placeholder],
  )

  return {
    chaptersBySlug,
    lawChaptersOptions,
  }
}

// ---------------------------------------------------------------------------

type LawChaptersSelectProps = {
  activeChapters: ReadonlyArray<LawChapterSlug>
  addChapter: (slug: LawChapterSlug) => void
  removeChapter: (slug: LawChapterSlug) => void
}

export const LawChaptersSelect = (props: LawChaptersSelectProps) => {
  const t = useLocale().formatMessage
  const { activeChapters, addChapter, removeChapter } = props

  const { chaptersBySlug, lawChaptersOptions } = useLawChapters(
    activeChapters,
    t(msg.lawChapterPlaceholder),
  )

  return (
    <>
      <Select
        size="sm"
        label={t(msg.lawChapter)}
        name="addLawChapter"
        isSearchable
        value={lawChaptersOptions[0]}
        placeholder={'Lagakafli'}
        options={lawChaptersOptions}
        onChange={(option) =>
          addChapter((option as Option).value as LawChapterSlug)
        }
        backgroundColor="blue"
      />

      {activeChapters.length > 0 && (
        <Box marginTop={2}>
          <Inline space={2}>
            {activeChapters.map((slug) => (
              <Tag key={slug} onClick={() => removeChapter(slug)} removable>
                {chaptersBySlug[slug]}
              </Tag>
            ))}
          </Inline>
        </Box>
      )}
    </>
  )
}
