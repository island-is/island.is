import { TeamList, type TeamListProps } from '@island.is/island-ui/contentful'
import { GenericList } from '@island.is/web/components'
import type { GenericTag } from '@island.is/web/graphql/schema'

interface TeamListSliceProps extends TeamListProps {
  id: string
  filterTags?: GenericTag[] | null
}

export const TeamListSlice = ({
  teamMembers,
  variant,
  filterTags,
  id,
}: TeamListSliceProps) => {
  // TODO: get team member data from graphql

  // if (variant === 'accordion') {
  //   return (
  //     <GenericList
  //       id={id}
  //       filterTags={filterTags}
  //       customItemRenderer={(items) => {
  //         return (
  //           <TeamList
  //             teamMembers={items.map((item) => ({
  //               name: item.title,
  //             }))}
  //             variant="accordion"
  //           />
  //         )
  //       }}
  //     />
  //   )
  // }

  return <TeamList teamMembers={teamMembers} variant={variant} />
}
