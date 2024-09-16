import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import {
  CollectionProp,
  EntryProps,
  KeyValueMap,
  QueryOptions,
  SysLink,
} from 'contentful-management'
import type { CMAClient, FieldExtensionSDK } from '@contentful/app-sdk'
import { Checkbox, Spinner, Stack, Text } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { sortAlpha } from '@island.is/shared/utils'

const DEBOUNCE_TIME = 500

const fetchAll = async (cma: CMAClient, query: QueryOptions) => {
  let response: CollectionProp<EntryProps<KeyValueMap>> | null = null
  const items: EntryProps<KeyValueMap>[] = []
  let limit = 100

  while ((response === null || items.length < response.total) && limit > 0) {
    try {
      response = await cma.entry.getMany({
        query: {
          ...query,
          limit,
          skip: items.length,
        },
      })
      items.push(...response.items)
    } catch (error) {
      const isResponseTooBig = (error?.message as string)
        ?.toLowerCase()
        ?.includes('response size too big')

      if (isResponseTooBig) limit = Math.floor(limit / 2)
      else throw error
    }
  }

  return items
}

const TeamMemberFilterTagsField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [isLoading, setIsLoading] = useState(true)

  const [filterTagSysLinks, setFilterTagSysLinks] = useState<SysLink[]>(
    sdk.field.getValue() ?? [],
  )

  const [tagGroups, setTagGroups] = useState<
    {
      tagGroup: EntryProps<KeyValueMap>
      tags: EntryProps<KeyValueMap>[]
    }[]
  >([])

  useEffect(() => {
    sdk.window.startAutoResizer()
    return () => {
      sdk.window.stopAutoResizer()
    }
  }, [sdk.window])

  useEffect(() => {
    const fetchTeamList = async () => {
      try {
        const teamListResponse = await cma.entry.getMany({
          query: {
            links_to_entry: sdk.entry.getSys().id,
            content_type: 'teamList',
          },
        })

        if (teamListResponse.items.length === 0) {
          setIsLoading(false)
          return
        }

        const tagGroupSysLinks: SysLink[] =
          teamListResponse.items[0].fields.filterGroups?.[
            sdk.locales.default
          ] ?? []

        const promises = tagGroupSysLinks.map(async (tagGroupSysLink) => {
          const [tagGroup, tags] = await Promise.all([
            cma.entry.get({
              entryId: tagGroupSysLink.sys.id,
            }),
            fetchAll(cma, {
              links_to_entry: tagGroupSysLink.sys.id,
              content_type: 'genericTag',
            }),
          ])

          tags.sort((a, b) => {
            return sortAlpha(sdk.locales.default)(
              a.fields.title,
              b.fields.title,
            )
          })

          return { tagGroup, tags }
        })

        setTagGroups(await Promise.all(promises))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamList()
  }, [cma, sdk.entry, sdk.locales.default, setTagGroups])

  useDebounce(
    () => {
      sdk.field.setValue(filterTagSysLinks)
    },
    DEBOUNCE_TIME,
    [filterTagSysLinks],
  )

  return (
    <>
      {isLoading && <Spinner />}

      {!isLoading && (
        <Stack
          flexDirection="column"
          alignItems="flex-start"
          spacing="spacing2Xl"
        >
          {tagGroups.map(({ tagGroup, tags }) => {
            return (
              <Stack
                key={tagGroup.sys.id}
                flexDirection="column"
                alignItems="flex-start"
              >
                <Text fontSize="fontSizeL" fontWeight="fontWeightDemiBold">
                  {tagGroup.fields.title[sdk.locales.default]}
                </Text>
                <Stack flexDirection="column" alignItems="flex-start">
                  {tags.map((tag) => {
                    const isChecked = filterTagSysLinks.some(
                      (filterTagSysLink) =>
                        filterTagSysLink.sys.id === tag.sys.id,
                    )
                    return (
                      <Checkbox
                        key={tag.sys.id}
                        isChecked={isChecked}
                        onChange={() => {
                          setFilterTagSysLinks((prev) => {
                            const alreadyExists = prev.some(
                              (filterTagSysLink) =>
                                filterTagSysLink.sys.id === tag.sys.id,
                            )
                            if (alreadyExists) {
                              return prev.filter(
                                (filterTagSysLink) =>
                                  filterTagSysLink.sys.id !== tag.sys.id,
                              )
                            }
                            return prev.concat({
                              sys: {
                                id: tag.sys.id,
                                type: 'Link',
                                linkType: 'Entry',
                              },
                            })
                          })
                        }}
                      >
                        {tag.fields.title[sdk.locales.default]}
                      </Checkbox>
                    )
                  })}
                </Stack>
              </Stack>
            )
          })}
        </Stack>
      )}
    </>
  )
}

export default TeamMemberFilterTagsField
