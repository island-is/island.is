import { useState } from 'react'
import flatten from 'lodash/flatten'
import { useLazyQuery } from '@apollo/client'

import { TeamList, type TeamListProps } from '@island.is/island-ui/contentful'
import { GenericList } from '@island.is/web/components'
import {
  type GenericTag,
  type Query,
  TeamMemberResponse,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { GET_TEAM_MEMBERS_QUERY } from '@island.is/web/screens/queries/TeamList'

const ITEMS_PER_PAGE = 10

interface TeamMemberListWrapperProps {
  id: string
  filterTags?: GenericTag[] | null
}

export const TeamMemberListWrapper = ({
  id,
  filterTags,
}: TeamMemberListWrapperProps) => {
  const searchQueryId = `${id}q`
  const pageQueryId = `${id}page`
  const tagQueryId = `${id}tag`

  const { activeLocale } = useI18n()

  const [itemsResponse, setItemsResponse] = useState<TeamMemberResponse | null>(
    null,
  )
  const [errorOccurred, setErrorOccurred] = useState(false)

  const [fetchListItems, { loading, called }] = useLazyQuery<Query>(
    GET_TEAM_MEMBERS_QUERY,
    {
      onCompleted(data) {
        const searchParams = new URLSearchParams(window.location.search)

        const queryString = searchParams.get(searchQueryId) || ''
        const pageQuery = searchParams.get(pageQueryId) || '1'
        const tagQuery = searchParams.get(tagQueryId) || '{}'

        const tags: string[] = flatten(Object.values(JSON.parse(tagQuery)))

        if (
          // Make sure the response matches the request input
          queryString === data?.getTeamMembers?.input?.queryString &&
          pageQuery === data?.getTeamMembers?.input?.page?.toString() &&
          tags.every((tag) =>
            (data?.getTeamMembers?.input?.tags ?? []).includes(tag),
          )
        ) {
          setItemsResponse(data.getTeamMembers)
          setErrorOccurred(false)
        }
      },
      onError(_) {
        setErrorOccurred(true)
      },
    },
  )

  const totalItems = itemsResponse?.total ?? 0

  const items = itemsResponse?.items ?? []

  return (
    <GenericList
      filterTags={filterTags}
      searchInputPlaceholder={activeLocale === 'is' ? 'Leit' : 'Search'}
      displayError={errorOccurred}
      fetchListItems={({ page, searchValue, tags, tagGroups }) => {
        fetchListItems({
          variables: {
            input: {
              teamListId: id,
              size: ITEMS_PER_PAGE,
              lang: activeLocale,
              page: page,
              queryString: searchValue,
              tags,
              tagGroups,
            },
          },
        })
      }}
      totalItems={totalItems}
      loading={loading || !called}
      pageQueryId={pageQueryId}
      searchQueryId={searchQueryId}
      tagQueryId={tagQueryId}
    >
      <TeamList
        teamMembers={items as TeamListProps['teamMembers']}
        variant="accordion"
        prefixes={{
          email: activeLocale === 'is' ? 'Netfang:' : 'Email:',
          phone: activeLocale === 'is' ? 'Sími:' : 'Phone:',
        }}
      />
    </GenericList>
  )
}

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
  if (variant === 'accordion') {
    return <TeamMemberListWrapper id={id} filterTags={filterTags} />
  }
  return <TeamList teamMembers={teamMembers} variant="card" />
}
