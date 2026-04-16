import dynamic from 'next/dynamic'

export const LandsretturCourtOfAppealAppeals = dynamic(
  () => import('./LandsretturCourtOfAppealAppeals'),
  {
    ssr: true,
  },
)
