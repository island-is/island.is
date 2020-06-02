import {environment} from '../environments/environment'
import {Client} from '@elastic/elasticsearch'
import {SearchIndexes} from '../types'

const {elastic} = environment

const getConnection = (): Client => {
  //todo handle pool?
  return new Client(elastic)
}

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
    let body = {
      query: {
        bool: {
          must: []
        }
      }
    };
    let isEmpty = true;

    if (query?.tag) {
      isEmpty = false;
      body.query.bool.must.push({ "term": { "tag": query.tag }});
    }
    if (query?.content) {
      isEmpty = false;
      body.query.bool.must.push({ "match": { "content": query.content }});
    }
    if (query?.title) {
      isEmpty = false;
      body.query.bool.must.push({ "match": { "title": query.title }});
    }

    if (isEmpty) {
      return getConnection().search({
        index: index,
        body: {
          query: {
            match_all: {},
          },
        }
      });
    }

    return getConnection().search({
      index: index,
      body,
    });
  }
}
