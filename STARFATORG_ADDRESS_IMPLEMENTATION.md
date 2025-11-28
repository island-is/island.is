# Starfatorg: Detailed Location Display Implementation

## Summary

Implemented display of detailed location information (address and department) for job postings on Starfatorg. This addresses the issue where institutions like Landspítali with multiple locations (e.g., Hringbraut, Fossvogur) were only showing "Höfuðborgarsvæðið".

## API Fields Used

The Fjársýslan API (`VacancyResponseDto`) provides these fields that were previously unused:

- **`address`** (string) - Maps to `VACANCY.HEIMILISFANG`
  - Contains the physical address of the organizational unit
- **`department`** (string) - Maps to `VACANCY.SKIPULAGSEINING`
  - Contains the department/organizational unit name

## Files Modified

### Files Changed

1. **`libs/api/domains/icelandic-government-institution-vacancies/src/lib/models/icelandicGovernmentInstitutionVacancy.model.ts`**

   - Add `address` and `department` fields to `IcelandicGovernmentInstitutionVacancyLocation`

2. **`libs/api/domains/icelandic-government-institution-vacancies/src/lib/utils.ts`**

   - Map `address` and `department` from API response (2 locations, lines ~92 and ~155)

3. **`apps/web/screens/queries/IcelandicGovernmentInstitutionVacancies.ts`**

   - Add `address` and `department` to GraphQL queries (both list and detail queries)

4. **`apps/web/screens/IcelandicGovernmentInstitutionVacancies/IcelandicGovernmentInstitutionVacancyDetails.tsx`**

   - Display `department` and `address` in the location section (line ~73-91)

5. **`apps/web/screens/IcelandicGovernmentInstitutionVacancies/IcelandicGovernmentInstitutionVacanciesList.tsx`**
   - Show address in job card location detail line (line ~296-312)
     postalCode: item.postCode ?? undefined,
     title,
     address: item.address ?? undefined, // NEW
     department: item.department ?? undefined, // NEW
     })

````

### 3. Job Detail Page

**File:** `apps/web/screens/IcelandicGovernmentInstitutionVacancies/IcelandicGovernmentInstitutionVacancyDetails.tsx`

Updated location display (line ~73-91) to show department and address under each location:

```typescript
{
  vacancy.locations.map((location, index) => (
    <Box key={index}>
      <Text variant="small">{location.title}</Text>
      {location.department && (
        <Text variant="small">{location.department}</Text>
      )}
      {location.address && <Text variant="small">{location.address}</Text>}
    </Box>
  ))
}
````

**Display format:**

```
Staðsetning
Höfuðborgarsvæðið
Gjörgæsludeild
Hringbraut 1, 101 Reykjavík
```

### 4. Job Listing Cards

**File:** `apps/web/screens/IcelandicGovernmentInstitutionVacancies/IcelandicGovernmentInstitutionVacanciesList.tsx`

Updated location detail line (line ~296-312) to concatenate location parts:

```typescript
text: vacancy.locations
  .filter((location) => location.title)
  .map((location) => {
    const parts = [location.title]
    if (location.department) parts.push(location.department)
    if (location.address) parts.push(location.address)
    return parts.join(' - ')
  })
  .join(', ')
```

**Display format:** `Höfuðborgarsvæðið - Gjörgæsludeild - Hringbraut 1, 101 Reykjavík`

## Benefits

1. ✅ **Multiple locations clearly distinguished** - LSH jobs at Hringbraut vs Fossvogur now visible
2. ✅ **Better for Alfred robots** - Can parse exact work location from job postings
3. ✅ **Better UX for job seekers** - Know exactly where they'll be working
4. ✅ **Backward compatible** - All fields optional, no breaking changes
5. ✅ **No new filter needed** - As requested, existing location filter still uses location titles

## Testing

### Local Testing

1. Start the API and web app:

   ```bash
   yarn dev-services api
   yarn dev web
   ```

2. Navigate to http://localhost:4200/starfatorg

3. Test cases:
   - **Check job listing cards** - Should show department/address if available
   - **Click into job details** - Should show full location info in sidebar
   - **Test with LSH jobs** - Look for jobs with multiple locations
   - **Test location filter** - Should still filter by location title (Höfuðborgarsvæðið)

### What to Verify

- Jobs WITHOUT address/department still display correctly (only show location title)
- Jobs WITH address/department show all info without breaking layout
- Location filter continues to work as before
- Responsive design works on mobile/tablet

## Known Limitations

1. **Data quality dependent** - Only works if Fjársýslan data includes address/department
2. **Can make cards longer** - Cards with long addresses may wrap or need truncation
3. **No address-based filtering** - Still filters by location title only (by design)

## Related Discussion

- **Asana task:** "Starfatorg: Birta nánari staðsetningu auglýsinga"
- **Slack context:** LSH with 20 locations needs better distinction than "Höfuðborgarsvæðið"
- **Decision:** Fanney og Kolla agreed NO new filter, just display the data

## API Documentation

Fjársýslan API fields (from OpenAPI spec):

```json
{
  "address": {
    "type": "string",
    "description": "Gets or sets the address. Maps to VACANCY.HEIMILISFANG.",
    "nullable": true
  },
  "department": {
    "type": "string",
    "description": "Gets or sets the department. Maps to VACANCY.SKIPULAGSEINING.",
    "nullable": true
  }
}
```
