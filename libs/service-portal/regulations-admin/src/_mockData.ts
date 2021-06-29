import { HTMLText, RegName, toISODate } from '@island.is/regulations'
import { startOfDay } from 'date-fns/esm'
import { useEffect, useRef, useState } from 'react'
import { Kennitala } from './types'
import {
  DraftSummary,
  ShippedSummary,
  RegulationDraft,
  RegulationOption,
  RegulationList,
} from './types-api'
import {
  DraftAuthorId,
  RegulationDraftId,
  MinistryId,
  RegulationId,
} from './types-database'
// import { } from './utils'

export const useMockQuery = <T>(data: T, skip?: boolean) => {
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState<Error | undefined>(undefined)

  const timeout = useRef<ReturnType<typeof setTimeout> | null>()
  useEffect(() => {
    const d = Math.random()
    timeout.current = setTimeout(() => {
      if (Math.random() < 0.1) {
        setError(new Error('Mock data loading error'))
      }
      setLoading(false)
    }, 1000 * d * d)
    return () => {
      timeout.current && clearTimeout(timeout.current)
    }
  }, [])

  return loading || skip
    ? { loading }
    : error
    ? { error, loading: false }
    : { data, loading: false }
}

// ---------------------------------------------------------------------------

export const mockSave = (draft: RegulationDraft) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, 800)
  })

// ---------------------------------------------------------------------------

const DAY = 24 * 60 * 60 * 1000
const dateFromNow = (n: number) => toISODate(startOfDay(Date.now() + n * DAY))

// ---------------------------------------------------------------------------

export const mockDraftlist: ReadonlyArray<DraftSummary> = [
  {
    id: 234 as RegulationDraftId,
    title:
      'Reglugerð um breytingar á Reglugerð nr 123/2001 um Lorem ipsum dolor sit',
    draftingStatus: 'draft',
    idealPublishDate: dateFromNow(0),
  },
  {
    id: 345 as RegulationDraftId,
    title: 'Reglugerð um amet dolore ipsum',
    draftingStatus: 'proposal',
    idealPublishDate: dateFromNow(3),
  },
  {
    id: 123 as RegulationDraftId,
    title: 'Reglugerð um ritstjórn reglugerða',
    draftingStatus: 'proposal',
    idealPublishDate: undefined,
  },
  {
    id: 456 as RegulationDraftId,
    title: 'Reglugerð um lorem ipsum dolor sit',
    draftingStatus: 'draft',
    idealPublishDate: undefined,
  },
]

// ---------------------------------------------------------------------------

export const mockShippedList: ReadonlyArray<ShippedSummary> = [
  {
    id: 456 as RegulationDraftId,
    name: '1711/2021' as RegName,
    title: 'Reglugerð um komudaga jólasveinana á hlaupári',
    idealPublishDate: dateFromNow(1),
  },
]

// ---------------------------------------------------------------------------

export const mockAuthors: ReadonlyArray<RegulationDraft['authors'][0]> = [
  {
    id: 7 as DraftAuthorId,
    authorKt: '1012755239' as Kennitala,
  },
]

// ---------------------------------------------------------------------------

export const mockMinistries: ReadonlyArray<RegulationDraft['ministry']> = [
  {
    id: 9876 as MinistryId,
    name: 'Samgöngu- og sveitarstjórnarráðuneyti',
    slug: 'ssvrn',
    current: false,
  },
]

// ---------------------------------------------------------------------------

export const mockDraftRegulations: Record<
  number,
  RegulationDraft | undefined
> = {
  123: {
    id: 123 as RegulationDraftId,
    draftingStatus: 'proposal',
    draftingNotes: '<p>Fór í banka.</p>' as HTMLText,
    authors: mockAuthors,
    title: 'Reglugerð um ristjórn reglugerða',
    text: '<p>Lorem ipsum dolir sit....</p>' as HTMLText,
    appendixes: [
      {
        title: 'Viðauki I',
        text: '<p>consectetur <strong>adipiscing elit</strong>, sed do eiusmod tempor incididunt</p>' as HTMLText,
      },
    ],
    comments: '' as HTMLText,
    ministry: mockMinistries[0],
    lawChapters: [],
  },
}

// ---------------------------------------------------------------------------

export const mockRegulationOptions: RegulationList = [
  {
    id: 3456 as RegulationId,
    name: '0244/2021' as RegName,
    title: 'Reglugerð fyrir hafnir Hafnasjóðs Dalvíkurbyggðar.',
    migrated: true,
  },
  {
    id: 6543 as RegulationId,
    name: '0245/2021' as RegName,
    title: 'Reglugerð um (1.) breytingu á reglugerð nr. 101/2021.',
    migrated: true,
  },
  {
    name: '0001/1975' as RegName,
    title: 'Reglugerð um eitthvað gamalt og gott.',
    migrated: false,
  },
]
