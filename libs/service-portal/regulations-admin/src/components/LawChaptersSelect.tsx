import React, { useMemo } from 'react'

import { Box, Inline, Option, Select, Tag } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { editorMsgs as msg } from '../messages'

import { LawChapterSlug } from '@island.is/regulations'
import { RegulationLawChapter } from '@island.is/regulations/web'
import { emptyOption } from '../utils'

type LawChaptersSelectProps = {
  lawChapters?: RegulationLawChapter[]
  activeChapters: readonly LawChapterSlug[]
  addChapter: (slug: LawChapterSlug) => void
  removeChapter: (slug: LawChapterSlug) => void
}

export const LawChaptersSelect = (props: LawChaptersSelectProps) => {
  const t = useIntl().formatMessage
  const { lawChapters = [], activeChapters, addChapter, removeChapter } = props

  const chaptersBySlug = useMemo(
    () =>
      lawChapters.reduce<Record<string, string>>((map, ch) => {
        map[ch.slug] = ch.name
        return map
      }, {}),
    [lawChapters],
  )

  const lawChaptersOptions = useMemo(
    (): ReadonlyArray<Option> => [
      emptyOption(t(msg.lawChapterPlaceholder)),
      ...lawChapters.map((ch) => ({
        value: ch.slug,
        label: ch.name,
        disabled: activeChapters.includes(ch.slug),
      })),
    ],
    [lawChapters, activeChapters, t],
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
