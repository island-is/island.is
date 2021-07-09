import {
  HTMLText,
  RegName,
  toISODate,
  MinistrySlug,
  Kennitala,
} from '@island.is/regulations'
import { RegulationMinistryList } from '@island.is/regulations/web'
import { startOfDay } from 'date-fns/esm'
import { useEffect, useRef, useState } from 'react'
import {
  DraftSummary,
  ShippedSummary,
  RegulationDraft,
  RegulationList,
  EmailAddress,
  Author,
  RegulationDraftId,
} from '@island.is/regulations/admin'
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

export const mockAuthors: ReadonlyArray<Author> = [
  {
    authorId: '1234567809' as Kennitala,
    name: 'Már Örlygsson',
    email: 'mar@hugsmidjan.is' as EmailAddress,
  },
  {
    authorId: '6543217809' as Kennitala,
    name: 'Valur Sverrisson',
    email: 'valur@hugsmidjan.is' as EmailAddress,
  },
]

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
    authors: mockAuthors.slice(0, 1),
  },
  {
    id: 345 as RegulationDraftId,
    title: 'Reglugerð um amet dolore ipsum',
    draftingStatus: 'proposal',
    idealPublishDate: dateFromNow(3),
    authors: mockAuthors.slice(1, 2),
  },
  {
    id: 123 as RegulationDraftId,
    title: 'Reglugerð um ritstjórn reglugerða',
    draftingStatus: 'proposal',
    idealPublishDate: undefined,
    authors: mockAuthors.slice(0, 2),
  },
  {
    id: 456 as RegulationDraftId,
    title: 'Reglugerð um lorem ipsum dolor sit',
    draftingStatus: 'draft',
    idealPublishDate: undefined,
    authors: mockAuthors.slice(0, 1),
  },
]

// ---------------------------------------------------------------------------

export const mockMinistrylist: RegulationMinistryList = [
  {
    name: 'Forsætisráðuneyti',
    slug: 'fsr' as MinistrySlug,
    current: true,
  },
  {
    name: 'Samgöngu- og sveitarstjórnarráðuneyti',
    slug: 'ssvrn' as MinistrySlug,
    current: false,
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

export const mockDraftRegulations: Record<
  string,
  RegulationDraft | undefined
> = {
  '123': {
    id: 123 as RegulationDraftId,
    draftingStatus: 'proposal',
    draftingNotes: '<p>Fór í banka.</p>' as HTMLText,
    authors: mockAuthors,
    title: 'Reglugerð um ristjórn reglugerða',
    text: `
      <p>Lorem ipsum dolor <strong>sit</strong> H<sub>2</sub>O. E = mc<sup>2</sup>
      consectetur adipiscing elit, sed do eiusmod tempor incididunt
      consectetur adipiscing elit, sed do eiusmod tempor incididunt
      consectetur adipiscing elit, sed do eiusmod tempor incididunt
      ....</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
    ` as HTMLText,
    appendixes: [
      {
        title: 'Viðauki I',
        text: '<p>consectetur <strong>adipiscing elit</strong>, sed do eiusmod tempor incididunt</p>' as HTMLText,
      },
    ],
    comments: '' as HTMLText,
    ministry: mockMinistrylist[0],
    lawChapters: [],
    impacts: [],
  },
}

// ---------------------------------------------------------------------------

export const mockRegulationOptions: RegulationList = [
  {
    name: '0244/2021' as RegName,
    title: 'Reglugerð fyrir hafnir Hafnasjóðs Dalvíkurbyggðar.',
    migrated: true,
  },
  {
    name: '0245/2021' as RegName,
    title: 'Reglugerð um (1.) breytingu á reglugerð nr. 101/2021.',
    cancelled: true,
    migrated: true,
  },
  {
    name: '0001/1975' as RegName,
    title: 'Reglugerð um eitthvað gamalt og gott.',
    migrated: false,
  },
]
