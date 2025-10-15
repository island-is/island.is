import { useQuery } from "@apollo/client";

import { TeamList, TeamListProps } from "@island.is/island-ui/contentful";
import { ConnectedComponent, IcelandicGovernmentEmployee, Query } from "@island.is/web/graphql/schema";

import { GET_ORGANIZATION_TEAM_MEMBERS } from "./queries"


interface Props {
  slice: ConnectedComponent
}

const parseOrganizationId = (organizationNumber: string | number | undefined): string | undefined => {
  if (!organizationNumber) return undefined;
  return String(organizationNumber);
}

const mapTeamMember = (member: IcelandicGovernmentEmployee): TeamListProps['teamMembers'][0] => {
  return {
    title: member.job ?? '',
    name: member.name
  };
};


const ConnectedTeamList = ({slice}: Props) => {
  const organizationId: string = parseOrganizationId(slice.configJson?.["organizationNumber"]) ?? "";
  const { data } = useQuery<Query>(GET_ORGANIZATION_TEAM_MEMBERS, {variables: {input: { organizationId }}})

  const employeeList = data?.icelandicGovernmentEmployees?.data ?? []

  const teamMembers = employeeList.map(e => mapTeamMember(e))

  return (
    <TeamList variant="card" teamMembers={teamMembers}></TeamList>
  );
};

export default ConnectedTeamList;
