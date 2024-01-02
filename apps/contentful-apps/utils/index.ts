import { CollectionProp, EntryProps, KeyValueMap } from 'contentful-management'
import { CMAClient } from '@contentful/app-sdk'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../constants'

export const getContentfulEntries = async (
  cma: CMAClient,
  contentType: string,
  query?: Record<string, string>,
) => {
  const items: EntryProps<KeyValueMap>[] = []
  let response: CollectionProp<EntryProps<KeyValueMap>> | null = null

  let chunkSize = 1000

  while (
    chunkSize > 0 &&
    (response === null || items.length < response.total)
  ) {
    try {
      response = await cma.entry.getMany({
        environmentId: CONTENTFUL_ENVIRONMENT,
        spaceId: CONTENTFUL_SPACE,
        query: {
          content_type: contentType,
          limit: chunkSize,
          skip: items.length,
          ...query,
        },
      })
      for (const item of response.items) {
        items.push(item)
      }
    } catch (error: unknown) {
      if (
        ((error as { message?: string })?.message as string)
          ?.toLowerCase()
          ?.includes('response size too big')
      ) {
        chunkSize = Math.floor(chunkSize / 2)
      } else {
        return items
      }
    }
  }

  return items
}

export const parseContentfulErrorMessage = (error: unknown) => {
  let errorMessage = ''
  try {
    const errorObject = JSON.parse((error as { message: string })?.message)
      ?.details?.errors?.[0]
    errorMessage = `${errorObject?.details ?? ''}${
      errorObject?.value ? ' - value: ' + errorObject.value : ''
    }`
  } catch (_) {
    // Do nothing in case an error occurs during JSON.parse()
  }
  return errorMessage
}
