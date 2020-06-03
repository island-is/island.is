import {SearcherService as Service} from '@island.is/api/schema'
import {ElasticService, SearchIndexes, SearchResult} from "@island.is/api/content-search";

export class SearcherService implements Service {
  constructor(private repository: ElasticService) {}

  async find(query): Promise<SearchResult> {
    const { body } = await this.repository.query(SearchIndexes.test, query);

    return body?.hits?.hits.map((hit) => {
      const obj = hit._source;
      obj._id = hit._id;
      return obj;
    });
  }

  getMessage(name: string) {
    const searcher = 'Searcher Testing '
    return `${searcher} ${name}!`
  }
}

export default SearcherService
