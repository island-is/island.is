import { useQuery } from '@apollo/client'

import { TeamList, TeamListProps } from '@island.is/island-ui/contentful'
import { isDefined } from '@island.is/shared/utils'
import {
  ConnectedComponent,
  IcelandicGovernmentInstitutionsEmployee,
  Query,
} from '@island.is/web/graphql/schema'

import { GET_ORGANIZATION_TEAM_MEMBERS } from './queries'

interface Props {
  slice: ConnectedComponent
}

const parseOrganizationId = (
  organizationNumber: string | number | undefined,
): string | undefined => {
  if (!organizationNumber) return undefined
  return String(organizationNumber)
}

const mapTeamMember = (
  member: IcelandicGovernmentInstitutionsEmployee,
): TeamListProps['teamMembers'][0] => {
  const address =
    member.location?.address && member.location.postalCode
      ? `${member.location.address}, ${member.location.postalCode}`
      : undefined
  return {
    title: member.job ?? '',
    name: member.name,
    email: member.email ?? '',
    phone: member.phoneNumber ? member.phoneNumber.toString() : undefined,
    extraIntroProperties: [
      address
        ? {
            label: 'Starfsstöð',
            value: address,
          }
        : undefined,
    ].filter(isDefined),
  }
}

const ConnectedTeamList = ({ slice }: Props) => {
  const organizationId: string =
    parseOrganizationId(slice.configJson?.['organizationNumber']) ?? ''
  const { data } = useQuery<Query>(GET_ORGANIZATION_TEAM_MEMBERS, {
    variables: { input: { organizationId } },
  })

  const employeeList =
    data?.icelandicGovernmentInstitutionsEmployees?.data ?? []

  const teamMembers = employeeList.map((e) => mapTeamMember(e))

  return <TeamList variant="accordion" teamMembers={teamMembers}></TeamList>
}

export default ConnectedTeamList
