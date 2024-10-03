```markdown
# api-domains-content-search

This module exposes endpoints for querying searchable data in an Elasticsearch content search.

## Making Data Searchable

When a client makes a search request, we return a response of type `SearchResult`. 

- `SearchResult` organizes results, aggregations, and metrics into a single response.
- `SearchResult.items` is a union type used to resolve various search result types.
- You must add your document type to this union as a NestJS model under the types array.
- Add a `typename` field to your mapped data, allowing the type to resolve correctly in (`src/lib/models/searchResult.model.ts`).
  
Note: All mapping for the search response is performed during import.
```