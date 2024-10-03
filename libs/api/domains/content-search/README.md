```markdown
# API Domains Content Search

This documentation provides details on the module that exposes endpoints for querying searchable data using Elasticsearch in a content search context.

## Making Data Searchable

When a client initiates a search request, a response of type `SearchResult` is returned. The `SearchResult` has the following characteristics:

- `SearchResult` consolidates results, aggregations, and metrics into a unified response structure.
- `SearchResult.items` is defined as a union type to handle various types of search results seamlessly.
- You are required to incorporate your document type into this union as a NestJS model within the types array.
- Ensure you add a `typename` field to your mapped data, which facilitates the correct type resolution in `src/lib/models/searchResult.model.ts`.

**Note**: The mapping for the search response is executed during the import process.
```