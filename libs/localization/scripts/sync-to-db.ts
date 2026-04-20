/**
 * Sync translation default messages from code to the database.
 * Replaces the Contentful-based extract-strings workflow for application templates.
 *
 * Usage:
 *   yarn ts-node libs/localization/scripts/sync-to-db.ts <glob-pattern>
 *
 * Example:
 *   yarn ts-node libs/localization/scripts/sync-to-db.ts "libs/application/templates/hms/rental-agreement/src/**/*.{ts,tsx}"
 *
 * Environment variables:
 *   DATABASE_URL - Postgres connection string
 */

import { readFileSync } from 'fs'
import spawn from 'cross-spawn'
import { Sequelize } from 'sequelize-typescript'
import { logger } from '@island.is/logging'

interface ExtractedMessage {
  id: string
  defaultMessage: string
  description?: string
}

interface NamespaceMessages {
  [namespace: string]: ExtractedMessage[]
}

async function main() {
  const sourceGlob = process.argv[2]
  if (!sourceGlob) {
    console.error(
      'Usage: yarn ts-node libs/localization/scripts/sync-to-db.ts <source-glob>',
    )
    process.exit(1)
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('Missing DATABASE_URL environment variable')
    process.exit(1)
  }

  console.log(`Extracting messages from: ${sourceGlob}`)

  const format = spawn.sync('yarn', [
    'formatjs',
    'extract',
    '--out-file',
    'libs/localization/sync-messages.json',
    '--format',
    'libs/localization/scripts/formatter.js',
    sourceGlob,
  ])

  if (format.stderr?.toString() !== '') {
    const stderrStr = format.stderr?.toString() ?? ''
    if (stderrStr.includes('error')) {
      logger.error(stderrStr)
      logger.error('Failed to extract messages')
      process.exit(1)
    }
  }

  let messages: NamespaceMessages
  try {
    const content = readFileSync(
      'libs/localization/sync-messages.json',
      'utf-8',
    )
    messages = JSON.parse(content)
  } catch {
    console.error('Failed to read extracted messages')
    process.exit(1)
  }

  const namespaces = Object.keys(messages)
  if (namespaces.length === 0) {
    console.log('No messages found to sync')
    process.exit(0)
  }

  console.log(`Found ${namespaces.length} namespace(s)`)

  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
  })

  await sequelize.authenticate()
  console.log('Connected to database')

  let totalCreated = 0
  let totalUpdated = 0
  let totalDeprecated = 0

  for (const [namespace, extractedMessages] of Object.entries(messages)) {
    console.log(
      `\nSyncing namespace "${namespace}" (${extractedMessages.length} messages)`,
    )

    const [existingRows] = await sequelize.query(
      'SELECT message_key, default_message FROM application_translation WHERE namespace = :namespace',
      { replacements: { namespace } },
    ) as [Array<{ message_key: string; default_message: string | null }>, unknown]

    const existingByKey = new Map(
      existingRows.map((r) => [r.message_key, r.default_message]),
    )
    const incomingKeys = new Set(extractedMessages.map((m) => m.id))

    for (const msg of extractedMessages) {
      const existing = existingByKey.get(msg.id)

      if (existing === undefined) {
        await sequelize.query(
          `INSERT INTO application_translation
            (id, namespace, message_key, value_is, default_message, is_reviewed, created, modified)
          VALUES
            (uuid_generate_v4(), :namespace, :messageKey, :valueIs, :defaultMessage, false, NOW(), NOW())
          ON CONFLICT (namespace, message_key) DO NOTHING`,
          {
            replacements: {
              namespace,
              messageKey: msg.id,
              valueIs: msg.defaultMessage,
              defaultMessage: msg.defaultMessage,
            },
          },
        )
        totalCreated++
        console.log(`  + Created: ${msg.id}`)
      } else if (existing !== msg.defaultMessage) {
        await sequelize.query(
          `UPDATE application_translation
          SET default_message = :defaultMessage, modified = NOW()
          WHERE namespace = :namespace AND message_key = :messageKey`,
          {
            replacements: {
              namespace,
              messageKey: msg.id,
              defaultMessage: msg.defaultMessage,
            },
          },
        )
        totalUpdated++
        console.log(`  ~ Updated default: ${msg.id}`)
      }
    }

    for (const [key] of existingByKey) {
      if (!incomingKeys.has(key)) {
        totalDeprecated++
        console.log(`  ! Deprecated (no longer in code): ${key}`)
      }
    }
  }

  console.log('\n=== Sync Summary ===')
  console.log(`Created: ${totalCreated}`)
  console.log(`Updated defaults: ${totalUpdated}`)
  console.log(`Deprecated: ${totalDeprecated}`)

  await sequelize.close()
}

main().catch((error) => {
  console.error('Sync failed:', error)
  process.exit(1)
})
