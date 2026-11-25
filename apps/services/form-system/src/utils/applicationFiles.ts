import { FieldTypesEnum } from '@island.is/form-system/shared'
import type { Logger } from '@island.is/logging'
import type { Application } from '../app/modules/applications/models/application.model'

export const getApplicationFiles = (
  application: Pick<Application, 'values'>,
  logger: Pick<Logger, 'warn' | 'debug'>,
): { key: string; valueId: string }[] => {
  const files: { key: string; valueId: string }[] = []
  for (const value of application.values ?? []) {
    if (value.fieldType !== FieldTypesEnum.FILE) continue

    let parsed: unknown = value.json
    if (typeof value.json === 'string') {
      try {
        parsed = JSON.parse(value.json)
      } catch (error) {
        logger.warn('Skipping file cleanup due to invalid value.json', {
          valueId: value.id,
          error,
        })
        continue
      }
    }

    const rawS3Keys =
      typeof parsed === 'object' && parsed !== null && 's3Key' in parsed
        ? parsed.s3Key
        : undefined
    const s3Keys: string[] = Array.isArray(rawS3Keys)
      ? rawS3Keys.filter(
          (key): key is string => typeof key === 'string' && key.length > 0,
        )
      : typeof rawS3Keys === 'string' && rawS3Keys.length > 0
      ? [rawS3Keys]
      : []

    logger.debug(`Deleting s3Keys for value ${value.id}:`, s3Keys)

    for (const key of s3Keys) {
      files.push({ key, valueId: value.id })
    }
  }
  return files
}
