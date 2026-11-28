import type { ReadWriteValues } from '@island.is/application/types'

import { splitWritableAnswers } from '../writable-answers'

describe('splitWritableAnswers', () => {
  it.each<{
    label: string
    write: ReadWriteValues | undefined
    answers: Record<string, unknown> | undefined
    writable: Record<string, unknown>
    forbidden: Record<string, unknown>
  }>([
    {
      label: 'allows every answer for write: "all"',
      write: 'all',
      answers: { a: 1, b: 2 },
      writable: { a: 1, b: 2 },
      forbidden: {},
    },
    {
      label: 'allows no answers without a write entry',
      write: undefined,
      answers: { a: 1 },
      writable: {},
      forbidden: { a: 1 },
    },
    {
      label: 'allows no answers without a write.answers list',
      write: { externalData: ['provider'] },
      answers: { a: 1 },
      writable: {},
      forbidden: { a: 1 },
    },
    {
      label: 'splits by the listed keys',
      write: { answers: ['a'] },
      answers: { a: 1, b: 2 },
      writable: { a: 1 },
      forbidden: { b: 2 },
    },
    {
      label: 'allows a dotted key under a listed key',
      write: { answers: ['applicant'] },
      answers: { 'applicant.phone': '5812345' },
      writable: { 'applicant.phone': '5812345' },
      forbidden: {},
    },
    {
      label: 'allows a bracketed key under a listed key',
      write: { answers: ['items'] },
      answers: { 'items[0].name': 'x' },
      writable: { 'items[0].name': 'x' },
      forbidden: {},
    },
    {
      label: 'does not treat a listed key as a prefix',
      write: { answers: ['applicant'] },
      answers: { applicantX: 1, 'applicantX.phone': 2 },
      writable: {},
      forbidden: { applicantX: 1, 'applicantX.phone': 2 },
    },
    {
      label: 'returns empty objects for no answers',
      write: { answers: ['a'] },
      answers: undefined,
      writable: {},
      forbidden: {},
    },
  ])('$label', ({ write, answers, writable, forbidden }) => {
    expect(splitWritableAnswers(write, answers)).toEqual({
      writable,
      forbidden,
    })
  })
})
