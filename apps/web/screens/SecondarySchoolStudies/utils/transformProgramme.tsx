import { ReactElement } from 'react'
import { IntlShape } from 'react-intl'

import { SecondarySchoolAllProgrammesQuery } from '@island.is/web/graphql/schema'

import { m } from '../messages/messages'
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
  formatMessage: IntlShape['formatMessage'],
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
      text: `${programme.credits} ${formatMessage(m.details.credits)}`,
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

  const schoolData = getSchoolData(school?.abbreviation)

  const unknownSchool = formatMessage(m.details.unknownSchool)

  return {
    id: `${programme.programmeId}${school?.id ? `-${school.id}` : ''}`,
    schoolName: school?.name || unknownSchool,
    schoolIcon: (
      <img
        src={`/assets/framhaldsskolar/${schoolData.icon}`}
        alt={`${school?.name || unknownSchool} logo`}
      />
    ),
    title: programme.title || '',
    description: programme.description || undefined,
    detailLines,
    href: `/framhaldsskolanam/${programme.programmeId}`,
  }
}
