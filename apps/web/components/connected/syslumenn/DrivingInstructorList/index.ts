import dynamic from 'next/dynamic'

export const DrivingInstructorList = dynamic(
  () => import('./DrivingInstructorList'),
  { ssr: true },
)
