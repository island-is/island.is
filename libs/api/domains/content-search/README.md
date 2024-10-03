# api-domains-content-search

Exposes endpoints to allow querying of searchable data in content search elasticsearch

## Making data searchable

When a client makes a search request we return a response of type `SearchResult`.  
`SearchResult` groups results, aggregations and metrics into a single response.  
`SearchResult.items` is a union type used to resolve search result types.  
You must add your documents type to the union as a nestjs model under the types array. You should then add a `typename` field to your mapped data for the type to resolve correctly. (`src/lib/models/searchResult.model.ts`)  
All mapping for the search response is done on import.
