# Contentful Maintenance

## Web Sitemap

Generates a sitemap.xml file in S3 (that gets forwarded to https://island.is/sitemap.xml) by fetching entries from the CMS

```bash
yarn nx run services-cms-importer:web-sitemap
```

## CMS Cleanup

Runs CMS cleanup tasks. Initial scaffold is intended for cleanup jobs like deleting duplicate assets in other Contentful environments.

```bash
yarn nx run services-cms-importer:cms-cleanup
```
