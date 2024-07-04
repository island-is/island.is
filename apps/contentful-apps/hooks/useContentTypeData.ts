import { useEffect, useState } from 'react'
import { ContentTypeProps } from 'contentful-management'
import { useCMA } from '@contentful/react-apps-toolkit'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../constants'

export const useContentTypeData = (contentTypeId: string) => {
  const [contentTypeData, setContentTypeData] = useState<ContentTypeProps>()

  const cma = useCMA()
  useEffect(() => {
    const fetchContentTypeData = async () => {
      const response = await cma.contentType.get({
        contentTypeId,
        environmentId: CONTENTFUL_ENVIRONMENT,
        spaceId: CONTENTFUL_SPACE,
      })
      setContentTypeData(response)
    }
    fetchContentTypeData()
  }, [cma.contentType, contentTypeId])

  return contentTypeData
}
