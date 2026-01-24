# Open Data Portal Implementation

This implementation provides a complete data retrieval architecture similar to the University Gateway, with a service layer, GraphQL API middle layer, and React frontend.

## Architecture Overview

```
┌─────────────────┐
│  Frontend (Web) │
│   React + Apollo│
└────────┬────────┘
         │ GraphQL
┌────────┴────────┐
│  GraphQL API    │
│  (Resolver)     │
└────────┬────────┘
         │
┌────────┴────────┐
│  Service Layer  │
│  (Business Logic│
└────────┬────────┘
         │
┌────────┴────────┐
│  Client Layer   │
│  (HTTP/CKAN API)│
└────────┬────────┘
         │
┌────────┴────────┐
│  External API   │
│  (CKAN/Dummy)   │
└─────────────────┘
```

## Components

### 1. Client Layer (`libs/clients/open-data`)

**Purpose**: Handles communication with external Open Data APIs (CKAN-based) or provides dummy data fallback.

**Files**:
- `openDataClient.service.ts` - Main service for fetching data
- `openDataClient.config.ts` - Configuration (API URL, dummy data toggle)
- `openDataClient.types.ts` - TypeScript interfaces
- `openDataClient.module.ts` - NestJS module

**Key Features**:
- CKAN API integration (Catalogue of Life as example)
- Automatic fallback to dummy data if API fails
- Data transformation from CKAN format to internal format
- Client-side filtering support

**Configuration**:
```bash
# .env
OPEN_DATA_API_URL=https://catalogueoflife.org/data/api/3/action
OPEN_DATA_USE_DUMMY=false  # Set to true to always use dummy data
```

### 2. GraphQL API Layer (`libs/api/domains/open-data`)

**Purpose**: Provides GraphQL API for the frontend, handles business logic.

**Files**:
- `openData.resolver.ts` - GraphQL resolver
- `openData.service.ts` - Business logic layer
- `graphql/models.ts` - GraphQL object types
- `graphql/dto.ts` - Input types
- `openData.module.ts` - NestJS module

**GraphQL Schema**:
```graphql
type Query {
  openDataDatasets(input: GetOpenDataDatasetsInput!): OpenDataDatasetsResponse!
  openDataDataset(id: ID!): OpenDataDataset
  openDataFilters: [OpenDataFilter!]!
  openDataPublishers: [OpenDataPublisher!]!
}
```

### 3. Frontend Layer (`apps/web/screens/OpenData`)

**Purpose**: User interface for browsing and searching datasets.

**Files**:
- `Home/Index.tsx` - Main page component
- `Home/Index.css.ts` - Styling (Vanilla Extract)
- `queries/index.ts` - GraphQL queries

**Features**:
- Search functionality
- Multi-select filters (Category, Publisher, Format)
- Grid/List view toggle
- Pagination
- Responsive design (mobile, tablet, desktop)
- Loading states with skeletons
- Error handling

## Setup Instructions

### 1. Add to API Backend

Update your API backend module to include the Open Data domain:

```typescript
// apps/api/src/app/app.module.ts
import { OpenDataModule } from '@island.is/api/domains/open-data'

@Module({
  imports: [
    // ... other modules
    OpenDataModule,
  ],
})
export class AppModule {}
```

### 2. Generate GraphQL Types

```bash
# Run the GraphQL code generation
yarn nx run api:codegen
```

### 3. Update tsconfig paths (if needed)

Ensure these paths are in `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@island.is/clients/open-data": ["libs/clients/open-data/src/index.ts"],
      "@island.is/api/domains/open-data": ["libs/api/domains/open-data/src/index.ts"]
    }
  }
}
```

### 4. Start the Services

```bash
# Start API backend
yarn start api

# Start web frontend
yarn start web
```

### 5. Access the Page

Navigate to: `http://localhost:4200/open-data`

## Data Sources

### Current: CKAN API (Catalogue of Life)

The implementation uses a public CKAN instance as an example:
- **URL**: `https://catalogueoflife.org/data/api/3/action`
- **Endpoints**: `package_search`, `package_show`

### Alternative CKAN APIs

You can switch to other CKAN instances:

```bash
# Iceland Open Data (if available)
OPEN_DATA_API_URL=https://data.gov.is/api/3/action

# US Government Data
OPEN_DATA_API_URL=https://catalog.data.gov/api/3/action

# European Data Portal
OPEN_DATA_API_URL=https://data.europa.eu/api/hub/search
```

### Dummy Data Fallback

If the CKAN API is unavailable or you set `OPEN_DATA_USE_DUMMY=true`, the system automatically falls back to 15 dummy datasets covering:
- Demographics
- Environment
- Transportation
- Healthcare
- Economy
- Education
- Tourism
- Energy
- Construction
- Public Safety

## API Endpoints

### GraphQL Queries

#### Get Datasets with Filters
```graphql
query GetOpenDataDatasets($input: GetOpenDataDatasetsInput!) {
  openDataDatasets(input: $input) {
    datasets {
      id
      title
      description
      category
      publisher
      format
      lastUpdated
      tags
    }
    total
    page
    limit
    hasMore
  }
}
```

**Variables**:
```json
{
  "input": {
    "searchQuery": "population",
    "categories": ["Demographics"],
    "publishers": ["Statistics Iceland"],
    "formats": ["CSV"],
    "page": 1,
    "limit": 12
  }
}
```

#### Get Single Dataset
```graphql
query GetOpenDataDataset($id: ID!) {
  openDataDataset(id: $id) {
    id
    title
    description
    downloadUrl
    metadata {
      size
      recordCount
    }
  }
}
```

#### Get Available Filters
```graphql
query GetOpenDataFilters {
  openDataFilters {
    field
    label
    options {
      value
      label
    }
  }
}
```

## Testing

### Unit Tests
```bash
# Test client layer
yarn test clients-open-data

# Test API domain
yarn test api-domains-open-data
```

### Integration Testing

1. **With Real CKAN API**:
```bash
OPEN_DATA_USE_DUMMY=false yarn start api
```

2. **With Dummy Data**:
```bash
OPEN_DATA_USE_DUMMY=true yarn start api
```

### E2E Testing
```bash
yarn test:e2e web --grep="open-data"
```

## Customization

### Adding New Filters

1. Update types in `openDataClient.types.ts`:
```typescript
export interface GetDatasetsInput {
  // ... existing
  license?: string[]
}
```

2. Update GraphQL schema in `graphql/dto.ts`:
```typescript
@Field(() => [String], { nullable: true })
licenses?: string[]
```

3. Update filtering logic in `openDataClient.service.ts`

4. Add filter UI in frontend `Index.tsx`

### Custom Data Source

Replace the CKAN API client with your own:

```typescript
// libs/clients/open-data/src/lib/openDataClient.service.ts

async getDatasets(input: GetDatasetsInput): Promise<DatasetsResponse> {
  // Your custom API logic here
  const response = await fetch('your-api-endpoint')
  // Transform and return data
}
```

## Performance Optimizations

- **Caching**: Apollo Client caches GraphQL responses
- **Pagination**: Server-side pagination reduces data transfer
- **Debouncing**: Search input is debounced (can be added)
- **Lazy Loading**: Components load on demand
- **Skeleton Loading**: Improves perceived performance

## Future Enhancements

- [ ] Add dataset detail page
- [ ] Implement data preview
- [ ] Add download functionality
- [ ] Integrate data visualization
- [ ] Add favorites/bookmarks
- [ ] Implement API documentation viewer
- [ ] Add dataset quality indicators
- [ ] Support for multiple languages
- [ ] Add export functionality (CSV, JSON)
- [ ] Implement advanced search (faceted search)

## Troubleshooting

### GraphQL Schema Not Generated

```bash
yarn nx run api:codegen/backend-schema
```

### CKAN API Timeout

Increase timeout in `openDataClient.service.ts`:
```typescript
timeout: 10000  // 10 seconds
```

### Dummy Data Always Showing

Check environment variable:
```bash
echo $OPEN_DATA_USE_DUMMY
```

Should be `false` or not set for real API usage.

## Support

For issues or questions:
1. Check the implementation in `libs/clients/open-data`
2. Review GraphQL schema in `libs/api/domains/open-data`
3. Examine frontend component in `apps/web/screens/OpenData`

## License

Same as the main island.is project.
