import dynamic from 'next/dynamic'

export const AdministrationOfOccupationalSafetyAndHealthCourses = dynamic(
  () => import('./AdministrationOfOccupationalSafetyAndHealthCourses'),
  {
    ssr: true,
  },
)
