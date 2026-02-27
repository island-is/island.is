import dynamic from 'next/dynamic'

export const ComplaintsCommitteeRulings = dynamic(
  () => import('./ComplaintsCommitteeRulings'),
  {
    ssr: true,
  },
)
