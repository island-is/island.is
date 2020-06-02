import SearcherRepository from './repository'
import { SearcherService as Service } from '@island.is/api/schema'

export class SearcherService implements Service {
  constructor(private repository: SearcherRepository) {}

  getMessage(name: string) {
    const searcher = this.repository.getSearcher()
    return `${searcher} ${name}!`
  }
}

export default SearcherService
