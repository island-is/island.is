# Lyfjastofnun News Import

Disabled pending testing. This job has no Nx target or CLI route. The
implementation remains in this directory for future validation.

The implementation reads WordPress posts, skips existing slugs, and creates
Contentful news entries as drafts by default.

## Required images

Every news post must have an explicitly assigned image from the Contentful asset
collection in the configured environment. Prepare the assets before running the
import, either manually or with an agent, then supply explicit assignments mapping each post slug to its image asset ID:

```json
{
  "example-post-slug": "contentful-image-asset-id"
}
```

Assignments are required for new posts selected by the slug, date window and limit;
already imported posts are ignored. The job validates that each assigned asset
exists and has a processed image file. When using `--publish`, assigned images
must already be published. A missing assignment or invalid asset fails the job
before any news entries are created. The importer does not upload images, choose
fallbacks, or publish existing assets.
