import dynamic from 'next/dynamic'

export const VerAnnouncementCalculator = dynamic(
  () => import('./VerAnnouncementCalculator'),
  {
    ssr: false,
  },
)
