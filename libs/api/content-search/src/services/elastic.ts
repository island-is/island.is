import {environment} from '../environments/environment'
import {Client} from '@elastic/elasticsearch'
import {SearchIndexes} from '../types'

const {elastic} = environment

const getConnection = (): Client => {
  //todo handle pool?
  return new Client(elastic)
}

const esb = require('elastic-builder');

export class ElasticService {
  constructor() {
  }

  async index(index: SearchIndexes, document: object) {
    const client = getConnection()

    await client.index({
      index: index,
      body: document,
    })
  }

  async query(index: SearchIndexes, query) {
    const requestBody = esb.requestBodySearch();
    let must = [];

    if (query?.queryString) {
      requestBody.query(
        esb.queryStringQuery(query.queryString).fields([
          'title^10',
          'content^2',
          'tag'
        ])
      )
    }

    if (query?._id) {
      must.push(esb.matchQuery('_id', query._id));
    }
    if (query?.tag) {
      must.push(esb.termQuery('tag', query.tag));
    }
    if (query?.content) {
      must.push(esb.matchQuery('content', query.content));
    }
    if (query?.title) {
      must.push(esb.matchQuery('title', query.title));
    }

    if (must.length) {
      requestBody.query(
        esb.boolQuery()
          .must(must)
      );
    }

    return getConnection().search({
      index: index,
      body: requestBody.toJSON()
    });
  }
}
