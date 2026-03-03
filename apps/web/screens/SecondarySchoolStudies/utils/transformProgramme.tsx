import { ReactElement } from 'react'

import { SecondarySchoolAllProgrammesQuery } from '@island.is/web/graphql/schema'

import { getSchoolData } from './schoolDataMap'

type SecondarySchoolProgramme =
  SecondarySchoolAllProgrammesQuery['secondarySchoolAllProgrammes'][0]

export interface ProgrammeCardProps {
  id: string
  schoolName: string
  schoolIcon: ReactElement
  title: string
  description?: string
  detailLines: Array<{
    icon: 'grid' | 'receipt' | 'school'
    text: string
  }>
  href: string
}

export const transformProgrammeToCard = (
  programme: SecondarySchoolProgramme,
): ProgrammeCardProps => {
  const school = programme.school
  const detailLines: ProgrammeCardProps['detailLines'] = []

  if (programme.studyTrack?.name) {
    detailLines.push({
      icon: 'grid',
      text: programme.studyTrack.name,
    })
  }

  if (programme.credits) {
    detailLines.push({
      icon: 'receipt',
      text: `${programme.credits} einingar`,
    })
  }

  if (programme.specialization?.title) {
    detailLines.push({
      icon: 'school',
      text:
        programme.specialization.title.charAt(0).toUpperCase() +
        programme.specialization.title.slice(1),
    })
  }

  const schoolData = getSchoolData(school?.id)

  return {
    id: `${programme.id}-${school?.id || 'unknown'}`,
    schoolName: school?.name || 'Óþekktur skóli',
    schoolIcon: (
      <img
        src={`/assets/framhaldsskolar/${schoolData.icon}`}
        alt={`${school?.name || 'School'} logo`}
      />
    ),
    title: programme.title || 'Óþekkt námsbraut',
    description: programme.description || undefined,
    detailLines,
    href: `/framhaldsskolanam/${programme.id}`,
  }
}
