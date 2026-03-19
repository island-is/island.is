# Finance V3 Feature Flag — Design Spec

**Date:** 2026-03-19
**Branch:** feat/finance-v3
**Status:** Approved

## Problem

The v3 finance client (cursor-based pagination) is ready but we need easy rollback on production. Both old (v2) and new (v3) implementations must live concurrently, switchable via a feature flag.

## Approach

Wrapper pattern: each screen is split into a V2 and V3 variant. The original screen file becomes a thin wrapper that reads a ConfigCat flag and renders one or the other.

## Feature Flag

**Name:** `isServicePortalFinanceTransactionsV3Enabled`
**Location:** `libs/feature-flags/src/lib/features.ts` (under `isServicePortal*` section)
**Default:** `false` (v2)

## File Changes

### `FinanceTransactions`

| File | Action |
|------|--------|
| `FinanceTransactions.tsx` | Rewrite as wrapper |
| `FinanceTransactionsV3.tsx` | New file — current v3 implementation (moved from `FinanceTransactions.tsx`) |
| `FinanceTransactionsV2.tsx` | New file — restored v2 implementation (from git history) |

### `FinanceTransactionsVehicleMileage`

| File | Action |
|------|--------|
| `FinanceTransactionsVehicleMileage.tsx` | Rewrite as wrapper |
| `FinanceTransactionsVehicleMileageV3.tsx` | New file — current v3 implementation |
| `FinanceTransactionsVehicleMileageV2.tsx` | New file — restored v2 implementation |

## Wrapper Pattern

Both wrappers follow the same shape:

```tsx
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useEffect, useState } from 'react'
import FinanceTransactionsV2 from './FinanceTransactionsV2'
import FinanceTransactionsV3 from './FinanceTransactionsV3'

const FinanceTransactions = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    featureFlagClient
      .getValue(Features.isServicePortalFinanceTransactionsV3Enabled, false)
      .then(setEnabled)
  }, [featureFlagClient])

  if (enabled === null)
    return (
      <Box padding={3}>
        <SkeletonLoader space={1} height={40} repeat={5} />
      </Box>
    )

  return enabled ? <FinanceTransactionsV3 /> : <FinanceTransactionsV2 />
}

export default FinanceTransactions
```

## GraphQL

The old `GetCustomerRecords` query (calling the non-paged `getCustomerRecords` resolver) was removed from both `.graphql` files during this branch. It must be restored before implementing V2 variants, and codegen re-run to regenerate `useGetCustomerRecordsLazyQuery`.

- V2 uses `useGetCustomerRecordsLazyQuery` (restored via codegen)
- V3 uses `useGetCustomerRecordsPagedLazyQuery` (cursor-based, already in generated files)

## Rollback

Flip `isServicePortalFinanceTransactionsV3Enabled` to `false` in the ConfigCat dashboard. No deploy needed.

## Cleanup (when v3 is stable)

1. Delete `FinanceTransactionsV2.tsx` and `FinanceTransactionsVehicleMileageV2.tsx`
2. Inline the V3 content back into the main screen files (or just rename)
3. Remove the feature flag from `features.ts` and ConfigCat
