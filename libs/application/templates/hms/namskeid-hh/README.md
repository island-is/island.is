# Námskeið HH Application Template

This is an application template for "Námskeið HH" (HMS Course) built for the Island.is application system.

## Structure

The template follows the standard Island.is application template structure:

- **Template Definition**: `src/lib/NamskeidHhTemplate.ts` - Main template configuration with state machine
- **Data Schema**: `src/lib/dataSchema.ts` - Zod validation schemas for form data
- **Forms**: 
  - `src/forms/prerequisitesForm/` - Prerequisites and data fetching
  - `src/forms/mainForm/` - Main application form with sections
  - `src/forms/completedForm/` - Completion screen
- **Messages**: `src/lib/messages/` - Translation messages
- **Utils**: `src/utils/` - Helper functions and utilities
- **Data Providers**: `src/dataProviders/` - External data API configurations

## Application Flow

1. **Prerequisites** - User confirms data retrieval and privacy policy
2. **Draft** - User fills in personal information and contact details
3. **Payment** - Payment processing
4. **Completed** - Confirmation screen

## Template API Module

The backend service is located at:
- [Template API Module](https://github.com/island-is/island.is/blob/main/libs/application/template-api-modules/src/lib/modules/templates/hms/namskeid-hh/namskeid-hh.service.ts)

## Feature Flag

This application is behind the feature flag: `Features.NamskeidHhEnabled`

## Related Files

- Application Type: `ApplicationTypes.NAMSKEID_HH`
- Slug: `namskeid-hh`
- Translation namespace: `nhh.application`

