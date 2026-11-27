import {
  type TeamListProps,
  TeamMemberProfile,
} from '@island.is/island-ui/contentful'
import { useI18n } from '@island.is/web/i18n'

interface TeamMemberSliceProps {
  teamMember: TeamListProps['teamMembers'][number]
}

/** A single team member displayed like an expanded accordion team list item, without search or filters */
export const TeamMemberSlice = ({ teamMember }: TeamMemberSliceProps) => {
  const { activeLocale } = useI18n()
  return (
    <TeamMemberProfile
      member={teamMember}
      prefixes={{
        email: activeLocale === 'is' ? 'Netfang:' : 'Email:',
        phone: activeLocale === 'is' ? 'Sími:' : 'Phone:',
      }}
    />
  )
}
