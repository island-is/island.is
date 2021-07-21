import React, { useMemo, useState } from 'react'

import {
  Box,
  Option,
  DatePicker,
  Input,
  Select,
  Text,
  Button,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { editorMsgs as msg } from '../messages'

import { LawChapterSlug } from '@island.is/regulations'
import { RegulationLawChapter } from '@island.is/regulations/web'
import { emptyOption, findValueOption } from '../utils'

type LawChaptersSelectProps = {
  lawChapters?: RegulationLawChapter[]
  activeChapters?: readonly LawChapterSlug[]
  addChapter?: any
  removeChapter?: any
}

export const LawChaptersSelect = (props: LawChaptersSelectProps) => {
  const t = useIntl().formatMessage
  const { lawChapters, activeChapters, addChapter, removeChapter } = props

  const [activeSel, setActiveSel] = useState<LawChapterSlug>()

  const lawChaptersOptions = useMemo(() => {
    return [emptyOption(t(msg.chooseMinistry))].concat(
      lawChapters?.map(
        (m: RegulationLawChapter): Option => ({
          value: m.slug,
          label: m.name,
        }),
      ) ?? [],
    ) as ReadonlyArray<Option>
  }, [lawChapters, t])

  console.log({ activeChapters, lawChapters })

  return (
    <>
      <ul>
        {activeChapters?.map((chapter) => {
          return (
            <li key={chapter}>
              {lawChapters?.find((c) => c.slug === chapter)?.name ?? chapter}{' '}
              <Button
                icon={'remove'}
                variant={'text'}
                onClick={(e) => {
                  removeChapter(chapter)
                }}
              >
                Fjarlægja
              </Button>
            </li>
          )
        })}
      </ul>
      <div>
        <Select
          name="addLawChapter"
          isSearchable
          label={'Lagakafli'}
          placeholder={'Lagakafli'}
          value={findValueOption(lawChaptersOptions, activeSel)}
          options={lawChaptersOptions}
          onChange={(option) =>
            setActiveSel((option as Option).value as LawChapterSlug)
          }
          size="sm"
        />
        <Button
          icon={'add'}
          onClick={(e) => {
            addChapter(activeSel)
            setActiveSel(undefined)
          }}
        >
          Bæta við
        </Button>
      </div>
    </>
  )
}
