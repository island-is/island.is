import { environment } from '../environments/environment'
import { Client } from '@elastic/elasticsearch'
import { Document, SearchIndexes } from '../types'

const { elastic } = environment

const getConnection = (): Client => {
  //todo handle pool?
  return new Client(elastic)
}

export class ElasticService {
  async index(index: SearchIndexes, document: Document) {
    const client = getConnection()

    try {
      const _id = document._id
      delete document._id
      return await client.index({
        id: _id,
        index: index,
        body: document,
      })
    } catch (e) {
      console.log('error indexing document')
    }
  }

  async findByQuery(index: SearchIndexes, query) {
    return getConnection().search({
      index: index,
      body: query,
    })
  }

  async query(index: SearchIndexes, query) {
    const body = {
      query: {
        bool: {
          must: [],
        },
      },
    }
    let isEmpty = true

    if (query?.tag) {
      isEmpty = false
      body.query.bool.must.push({ term: { tag: query.tag } })
    }
    if (query?.content) {
      isEmpty = false
      body.query.bool.must.push({ match: { content: query.content } })
    }
    if (query?.title) {
      isEmpty = false
      body.query.bool.must.push({ match: { title: query.title } })
    }

    if (isEmpty) {
      return getConnection().search({
        index: index,
        body: {
          query: {
            match_all: {},
          },
        },
      })
    }

    return getConnection().search({
      index: index,
      body,
    })
  }
}
