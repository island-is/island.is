import dynamic from 'next/dynamic'

export const UniversityStudiesHeader = dynamic(
  () => import('./UniversityStudiesHeader'),
  {
    ssr: true,
  },
)
