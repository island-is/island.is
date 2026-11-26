import React from 'react'

import { KeyValueCard } from './KeyValueCard'

export default {
  title: 'Cards/KeyValueCard',
  component: KeyValueCard,
}

export const Default = () => (
  <KeyValueCard
    columns={[
      [
        { label: 'Skilaskylda jafnréttisáætlun', value: 'Já' },
        { label: 'Næstu skil jafnréttisáætlunar', value: '01.03.2027' },
      ],
      [
        { label: 'Skilaskylda skýrslugjöf', value: 'Já' },
        { label: 'Næstu skil skýrslu', value: '28.02.2027' },
      ],
    ]}
  />
)

const placeholderImage = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="114" height="170" viewBox="0 0 114 170"><rect x="20" y="30" width="80" height="50" rx="4" fill="none" stroke="#6a2ea0" stroke-width="2"/><circle cx="24" cy="30" r="14" fill="#4a90e2"/><path d="M0 120 Q40 100 70 125 T114 110" fill="none" stroke="#6a2ea0" stroke-width="2"/><circle cx="90" cy="160" r="3" fill="#0061ff"/></svg>',
)}`

export const WithImage = () => (
  <KeyValueCard
    img={placeholderImage}
    columns={[
      [
        { label: 'Skilaskylda jafnréttisáætlun', value: 'Já' },
        { label: 'Næstu skil jafnréttisáætlunar', value: '01.03.2027' },
      ],
      [
        { label: 'Skilaskylda skýrslugjöf', value: 'Já' },
        { label: 'Næstu skil skýrslu', value: '28.02.2027' },
      ],
    ]}
  />
)

export const EightPairs = () => (
  <KeyValueCard
    img={placeholderImage}
    columns={[
      [
        { label: 'Skilaskylda jafnréttisáætlun', value: 'Já' },
        { label: 'Næstu skil jafnréttisáætlunar', value: '01.03.2027' },
        { label: 'Síðustu skil jafnréttisáætlunar', value: '14.10.2025' },
        { label: 'Staða jafnréttisáætlunar', value: 'Í vinnslu' },
      ],
      [
        { label: 'Skilaskylda skýrslugjöf', value: 'Já' },
        { label: 'Næstu skil skýrslu', value: '28.02.2027' },
        { label: 'Síðustu skil skýrslu', value: '03.03.2022' },
        { label: 'Staða skýrslu', value: 'Samþykkt' },
      ],
    ]}
  />
)

export const UnevenColumns = () => (
  <KeyValueCard
    columns={[
      [{ label: 'Skilaskylda jafnréttisáætlun', value: 'Nei' }],
      [
        { label: 'Skilaskylda skýrslugjöf', value: 'Já' },
        { label: 'Næstu skil skýrslu', value: '28.02.2027' },
      ],
    ]}
  />
)

export const Loading = () => (
  <KeyValueCard
    loading
    columns={[
      [{ label: 'Skilaskylda jafnréttisáætlun', value: '' }],
      [{ label: 'Skilaskylda skýrslugjöf', value: '' }],
    ]}
  />
)
