import {SearcherService as Service} from '@island.is/api/schema'
import {ElasticService, SearchIndexes, SearchResult, Document as ContentDocument} from "@island.is/api/content-search";

export class SearcherService implements Service {
  constructor(private repository: ElasticService) {}

  async find(query): Promise<SearchResult> {
    const { body } = await this.repository.query(SearchIndexes.test, query);

    let items = body?.hits?.hits.map((hit) => {
      const obj = hit._source;
      obj._id = hit._id;
      return obj;
    });

    return {
      total: items.length,
      items: items
    }
  }

  async fetchSingle(input): Promise<ContentDocument> {
    const { body } = await this.repository.query(SearchIndexes.test, input);

    const hit = body?.hits?.hits[0];
    if (!hit) {
      return null;
    }

    const obj = hit._source;
    obj._id = hit._id;
    return obj;
  }
}

export default SearcherService
