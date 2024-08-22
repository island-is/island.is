import { createClient } from 'contentful'
import type { NextApiRequest, NextApiResponse } from 'next'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'

export interface RequestBody {
  searchValue: string
  limit?: number
  skip?: number
  contentTypeId?: string
  organizationId?: string
}

const deliveryClient = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  host: process.env.CONTENTFUL_HOST,
  space: CONTENTFUL_SPACE,
  environment: 'stefna' || CONTENTFUL_ENVIRONMENT, //TODO: remove 'stefna' constant
  resolveLinks: false,
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as RequestBody
  const response = await deliveryClient.getEntries({
    content_type: body.contentTypeId || undefined,
    query: body.searchValue,
    limit: body.limit,
    skip: body.skip,
    'fields.organization.sys.id': body.organizationId || undefined,
  })

  res.json({
    items: response.items,
    total: response.total,
    limit: response.limit,
    skip: response.skip,
    contentTypeId: body.contentTypeId,
    searchValue: body.searchValue,
  })
}

export default handler
