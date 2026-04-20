/**
 * One-time migration script: imports translations from Contentful into the
 * application_translation table.
 *
 * Usage:
 *   yarn ts-node libs/application/api/core/src/lib/translation/migration/contentful-migration.ts
 *
 * Environment variables:
 *   CONTENTFUL_MANAGEMENT_ACCESS_TOKEN - Contentful management API token
 *   CONTENTFUL_SPACE_ID - Contentful space ID
 *   CONTENTFUL_ENVIRONMENT - Contentful environment (default: 'master')
 *   DATABASE_URL - Postgres connection string
 */

import { Sequelize } from 'sequelize-typescript'
import { ApplicationConfigurations } from '@island.is/application/types'

const DEFAULT_LOCALE = 'is-IS'

interface ContentfulNamespaceEntry {
  fields: {
    namespace: Record<string, string>
    strings?: Record<string, Record<string, string>>
    defaults?: Record<string, Record<string, { defaultMessage?: string }>>
  }
}

async function fetchContentfulNamespace(
  spaceId: string,
  environment: string,
  accessToken: string,
  namespace: string,
): Promise<ContentfulNamespaceEntry[]> {
  const url = `https://api.contentful.com/spaces/${spaceId}/environments/${environment}/entries?content_type=namespace&fields.namespace=${namespace}&select=fields.namespace,fields.strings,fields.defaults`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    console.error(
      `Failed to fetch namespace ${namespace}: ${response.status}`,
    )
    return []
  }

  const data = await response.json()
  return data.items ?? []
}

async function main() {
  const accessToken = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master'
  const databaseUrl = process.env.DATABASE_URL

  if (!accessToken || !spaceId || !databaseUrl) {
    console.error(
      'Missing required env vars: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN, CONTENTFUL_SPACE_ID, DATABASE_URL',
    )
    process.exit(1)
  }

  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
  })

  await sequelize.authenticate()
  console.log('Connected to database')

  const allNamespaces = new Set<string>()
  for (const config of Object.values(ApplicationConfigurations)) {
    const namespaces = Array.isArray(config.translation)
      ? config.translation
      : [config.translation]
    for (const ns of namespaces) {
      allNamespaces.add(ns)
    }
  }

  console.log(`Found ${allNamespaces.size} application namespaces to migrate`)

  let totalCreated = 0
  let totalSkipped = 0
  let totalErrors = 0

  for (const namespace of allNamespaces) {
    console.log(`Processing namespace: ${namespace}`)

    const entries = await fetchContentfulNamespace(
      spaceId,
      environment,
      accessToken,
      namespace,
    )

    if (entries.length === 0) {
      console.log(`  No Contentful entries found for ${namespace}`)
      continue
    }

    for (const entry of entries) {
      const strings = entry.fields.strings ?? {}
      const defaults = entry.fields.defaults ?? {}

      const isStrings = strings[DEFAULT_LOCALE] ?? {}
      const enStrings = strings['en'] ?? {}
      const defaultDefs = defaults[DEFAULT_LOCALE] ?? {}

      const allKeys = new Set([
        ...Object.keys(isStrings),
        ...Object.keys(enStrings),
        ...Object.keys(defaultDefs),
      ])

      for (const key of allKeys) {
        const valueIs = isStrings[key] ?? defaultDefs[key]?.defaultMessage ?? ''
        const valueEn = enStrings[key] || null
        const defaultMessage = defaultDefs[key]?.defaultMessage ?? null

        if (!valueIs && !valueEn) {
          totalSkipped++
          continue
        }

        try {
          await sequelize.query(
            `INSERT INTO application_translation
              (id, namespace, message_key, value_is, value_en, default_message, is_reviewed, created, modified)
            VALUES
              (uuid_generate_v4(), :namespace, :messageKey, :valueIs, :valueEn, :defaultMessage, true, NOW(), NOW())
            ON CONFLICT (namespace, message_key) DO UPDATE SET
              value_is = EXCLUDED.value_is,
              value_en = EXCLUDED.value_en,
              default_message = EXCLUDED.default_message,
              modified = NOW()`,
            {
              replacements: {
                namespace,
                messageKey: key,
                valueIs: valueIs || '',
                valueEn,
                defaultMessage,
              },
            },
          )
          totalCreated++
        } catch (error) {
          console.error(`  Error inserting ${key}:`, error)
          totalErrors++
        }
      }
    }
  }

  console.log('\n=== Migration Summary ===')
  console.log(`Created/updated: ${totalCreated}`)
  console.log(`Skipped (empty): ${totalSkipped}`)
  console.log(`Errors: ${totalErrors}`)

  await sequelize.close()
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
