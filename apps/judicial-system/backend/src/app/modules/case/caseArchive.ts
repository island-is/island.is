import {
  AppealCase,
  AppealDecision,
  Case,
  CaseFile,
  CaseString,
  Defendant,
  IndictmentCount,
} from '../repository'

// The properties that are moved to the archive when a case is archived and
// written back when it is restored. A property removed from one of these lists
// makes every archive that carries it unrestorable, which is the intended
// outcome: the archive no longer fits the tables.
export const caseEncryptionProperties: (keyof Case)[] = [
  'description',
  'demands',
  'requestedOtherRestrictions',
  'caseFacts',
  'legalArguments',
  'prosecutorOnlySessionRequest',
  'comments',
  'caseFilesComments',
  'courtAttendees',
  'prosecutorDemands',
  'courtDocuments',
  'sessionBookings',
  'courtCaseFacts',
  'introduction',
  'courtLegalArguments',
  'ruling',
  'conclusion',
  'endOfSessionBookings',
  'caseModifiedExplanation',
  'caseResentExplanation',
  'crimeScenes',
  'indictmentIntroduction',
  'indictmentDeniedExplanation',
]

export const appealCaseEncryptionProperties: (keyof AppealCase)[] = [
  'appealConclusion',
  'appealRulingModifiedHistory',
]

export const appealDecisionEncryptionProperties: (keyof AppealDecision)[] = [
  'announcement',
]

export const defendantEncryptionProperties: (keyof Defendant)[] = [
  'nationalId',
  'name',
  'address',
]

export const caseFileEncryptionProperties: (keyof CaseFile)[] = [
  'name',
  'key',
  'userGeneratedFilename',
]

export const indictmentCountEncryptionProperties: (keyof IndictmentCount)[] = [
  'vehicleRegistrationNumber',
  'incidentDescription',
  'legalArguments',
]

export const caseStringEncryptionProperties: (keyof CaseString)[] = ['value']

export const collectEncryptionProperties = (
  properties: string[],
  unknownSource: unknown,
): [{ [key: string]: string | null }, { [key: string]: unknown }] => {
  const source = unknownSource as { [key: string]: unknown }
  return properties.reduce<
    [{ [key: string]: string | null }, { [key: string]: unknown }]
  >(
    (data, property) => [
      {
        ...data[0],
        [property]: typeof source[property] === 'string' ? '' : null,
      },
      { ...data[1], [property]: source[property] },
    ],
    [{}, {}],
  )
}

type ArchivedProperties = { [key: string]: unknown }

// An archived row carries its row id, so that a restore can match it to its
// row without relying on the order of the rows
export const withArchivedRowId = (
  row: { id: string },
  archived: ArchivedProperties,
): ArchivedProperties => ({ id: row.id, ...archived })

interface RowRestore {
  id: string
  properties: ArchivedProperties
}

// What has to be written to bring an archived case back
export interface CaseRestore {
  caseProperties: ArchivedProperties
  appealCase?: RowRestore
  defendants: RowRestore[]
  caseFiles: RowRestore[]
  indictmentCounts: RowRestore[]
  caseStrings: RowRestore[]
  appealDecisions: RowRestore[]
}

// The archive cannot be laid back over the case as the tables are now
export class CaseArchiveMismatchError extends Error {}

const childKeys = [
  'appealCase',
  'defendants',
  'caseFiles',
  'indictmentCounts',
  'caseStrings',
  'appealDecisions',
]

const isObject = (value: unknown): value is ArchivedProperties =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const restorableProperties = (
  kind: string,
  allowedProperties: string[],
  archived: unknown,
  ignoredKeys: string[] = [],
): ArchivedProperties => {
  if (!isObject(archived)) {
    throw new CaseArchiveMismatchError(`The archived ${kind} is not an object`)
  }

  const properties: ArchivedProperties = {}

  for (const [key, value] of Object.entries(archived)) {
    if (ignoredKeys.includes(key)) {
      continue
    }

    if (!allowedProperties.includes(key)) {
      throw new CaseArchiveMismatchError(
        `The archived ${kind} property ${key} is no longer stored on the ${kind}`,
      )
    }

    properties[key] = value
  }

  return properties
}

type Row = { id: string; created: Date }

const comparableProperties = (properties: ArchivedProperties): string =>
  JSON.stringify(
    Object.keys(properties)
      .sort()
      .map((key) => [key, properties[key]]),
  )

// The key an archived row carries its row id under
const archivedIdKey = 'id'

const archivedId = (archived: unknown): string | undefined =>
  isObject(archived) && typeof archived[archivedIdKey] === 'string'
    ? archived[archivedIdKey]
    : undefined

// Archived children that carry their row id are matched by it. The rows must
// still be exactly the ones that were archived.
const restorableRowsById = <TRow extends Row>(
  kind: string,
  allowedProperties: string[],
  rows: TRow[],
  archived: unknown[],
  archivedIds: string[],
): RowRestore[] => {
  const rowIds = new Set(rows.map((row) => row.id))

  if (
    new Set(archivedIds).size !== archivedIds.length ||
    archivedIds.some((id) => !rowIds.has(id))
  ) {
    throw new CaseArchiveMismatchError(
      `The archived ${kind} list does not match the ${kind} rows of the case`,
    )
  }

  return archived.map((archivedRow, index) => ({
    id: archivedIds[index],
    properties: restorableProperties(kind, allowedProperties, archivedRow, [
      archivedIdKey,
    ]),
  }))
}

// Children archived before row ids were written carry none, so the nth
// archived child belongs to the nth row in the order the archive was written
// in. That only holds while the rows are the same ones, and while the order
// tells every one of them apart.
const restorableRows = <TRow extends Row>(
  kind: string,
  allowedProperties: string[],
  rows: TRow[] | undefined,
  archived: unknown,
  orderKey: (row: TRow) => string = (row) =>
    `${new Date(row.created).getTime()}`,
): RowRestore[] => {
  // An archive written before this kind of row was archived has nothing to
  // restore for it, and never cleared anything either
  if (archived === undefined) {
    return []
  }

  const currentRows = rows ?? []

  if (!Array.isArray(archived) || archived.length !== currentRows.length) {
    throw new CaseArchiveMismatchError(
      `The archived ${kind} list does not match the ${kind} rows of the case`,
    )
  }

  const archivedIds = archived.map(archivedId)

  if (archivedIds.every((id): id is string => id !== undefined)) {
    return restorableRowsById(
      kind,
      allowedProperties,
      currentRows,
      archived,
      archivedIds,
    )
  }

  if (archivedIds.some((id) => id !== undefined)) {
    throw new CaseArchiveMismatchError(
      `Only some of the archived ${kind} rows carry a row id`,
    )
  }

  const restores = currentRows.map((row, index) => ({
    id: row.id,
    properties: restorableProperties(kind, allowedProperties, archived[index]),
  }))

  // Rows the order does not tell apart may have been archived in either order.
  // That is harmless while they were archived with the same values.
  const archivedByOrderKey = new Map<string, string>()

  currentRows.forEach((row, index) => {
    const key = orderKey(row)
    const archivedValues = comparableProperties(restores[index].properties)
    const tiedValues = archivedByOrderKey.get(key)

    if (tiedValues !== undefined && tiedValues !== archivedValues) {
      throw new CaseArchiveMismatchError(
        `The ${kind} rows of the case cannot be told apart by their order`,
      )
    }

    archivedByOrderKey.set(key, archivedValues)
  })

  return restores
}

// Matches a decrypted archive against the case it was taken from - read with
// the archive graph, in the archive order - and returns what to write back.
// Throws CaseArchiveMismatchError, before anything is written, when the archive
// does not fit the case and its tables as they are now.
export const buildCaseRestore = (
  theCase: Case,
  archive: { [key: string]: unknown },
): CaseRestore => {
  const caseProperties = restorableProperties(
    'case',
    caseEncryptionProperties,
    archive,
    childKeys,
  )

  let appealCase: RowRestore | undefined
  if (archive.appealCase !== undefined && archive.appealCase !== null) {
    const archivedAppealCaseId = archivedId(archive.appealCase)

    if (
      !theCase.appealCase ||
      (archivedAppealCaseId !== undefined &&
        archivedAppealCaseId !== theCase.appealCase.id)
    ) {
      throw new CaseArchiveMismatchError(
        'The archived appeal case does not match an appeal case of the case',
      )
    }

    appealCase = {
      id: theCase.appealCase.id,
      properties: restorableProperties(
        'appeal case',
        appealCaseEncryptionProperties,
        archive.appealCase,
        [archivedIdKey],
      ),
    }
  }

  return {
    caseProperties,
    appealCase,
    defendants: restorableRows(
      'defendant',
      defendantEncryptionProperties,
      theCase.defendants,
      archive.defendants,
    ),
    caseFiles: restorableRows(
      'case file',
      caseFileEncryptionProperties,
      theCase.caseFiles,
      archive.caseFiles,
    ),
    indictmentCounts: restorableRows(
      'indictment count',
      indictmentCountEncryptionProperties,
      theCase.indictmentCounts,
      archive.indictmentCounts,
      (row) => `${row.displayOrder}:${new Date(row.created).getTime()}`,
    ),
    caseStrings: restorableRows(
      'case string',
      caseStringEncryptionProperties,
      theCase.caseStrings,
      archive.caseStrings,
    ),
    appealDecisions: restorableRows(
      'appeal decision',
      appealDecisionEncryptionProperties,
      theCase.appealDecisions,
      archive.appealDecisions,
    ),
  }
}
