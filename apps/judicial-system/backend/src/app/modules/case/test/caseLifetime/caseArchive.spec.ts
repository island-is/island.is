import { v4 as uuid } from 'uuid'

import { Case } from '../../../repository'
import {
  buildCaseRestore,
  CaseArchiveMismatchError,
  caseEncryptionProperties,
  collectEncryptionProperties,
} from '../../caseArchive'

describe('buildCaseRestore', () => {
  const defendantId1 = uuid()
  const defendantId2 = uuid()
  const caseFileId = uuid()
  const caseStringId = uuid()
  const appealCaseId = uuid()
  const appealDecisionId = uuid()

  // The case as it is while archived: the rows are there, their archived
  // properties cleared
  const archivedCase = (overrides: object = {}) =>
    ({
      id: uuid(),
      description: '',
      demands: '',
      appealCase: { id: appealCaseId, appealConclusion: '' },
      defendants: [
        { id: defendantId1, created: new Date('2026-01-01T10:00:00.000Z') },
        { id: defendantId2, created: new Date('2026-01-01T10:00:01.000Z') },
      ],
      caseFiles: [
        { id: caseFileId, created: new Date('2026-01-02T10:00:00.000Z') },
      ],
      indictmentCounts: [],
      caseStrings: [
        { id: caseStringId, created: new Date('2026-01-03T10:00:00.000Z') },
      ],
      appealDecisions: [
        { id: appealDecisionId, created: new Date('2026-01-04T10:00:00.000Z') },
      ],
      ...overrides,
    } as unknown as Case)

  const archive = (overrides: object = {}) => ({
    description: 'original_description',
    demands: 'original_demands',
    courtDocuments: [{ name: 'original_court_document' }],
    crimeScenes: null,
    appealCase: {
      appealConclusion: 'original_appeal_conclusion',
      appealRulingModifiedHistory: null,
    },
    defendants: [
      { nationalId: '0000000001', name: 'original_name1', address: null },
      { nationalId: '0000000002', name: 'original_name2', address: 'a' },
    ],
    caseFiles: [
      { name: 'original_file', key: 'original_key', userGeneratedFilename: '' },
    ],
    indictmentCounts: [],
    caseStrings: [{ value: 'original_value' }],
    appealDecisions: [{ announcement: 'original_announcement' }],
    ...overrides,
  })

  it('should lay every archived property back on the row it was taken from', () => {
    expect(buildCaseRestore(archivedCase(), archive())).toEqual({
      caseProperties: {
        description: 'original_description',
        demands: 'original_demands',
        courtDocuments: [{ name: 'original_court_document' }],
        crimeScenes: null,
      },
      appealCase: {
        id: appealCaseId,
        properties: {
          appealConclusion: 'original_appeal_conclusion',
          appealRulingModifiedHistory: null,
        },
      },
      defendants: [
        {
          id: defendantId1,
          properties: {
            nationalId: '0000000001',
            name: 'original_name1',
            address: null,
          },
        },
        {
          id: defendantId2,
          properties: {
            nationalId: '0000000002',
            name: 'original_name2',
            address: 'a',
          },
        },
      ],
      caseFiles: [
        {
          id: caseFileId,
          properties: {
            name: 'original_file',
            key: 'original_key',
            userGeneratedFilename: '',
          },
        },
      ],
      indictmentCounts: [],
      caseStrings: [
        { id: caseStringId, properties: { value: 'original_value' } },
      ],
      appealDecisions: [
        {
          id: appealDecisionId,
          properties: { announcement: 'original_announcement' },
        },
      ],
    })
  })

  it('should restore what the archive path collects', () => {
    const original = { description: 'd', courtDocuments: [{ name: 'c' }] }
    const [, caseArchive] = collectEncryptionProperties(
      caseEncryptionProperties,
      original,
    )

    // What is stored is the JSON, so properties that were never set are gone
    const stored = JSON.parse(
      JSON.stringify({ ...caseArchive, defendants: [] }),
    )

    expect(
      buildCaseRestore(archivedCase({ defendants: [] }), stored).caseProperties,
    ).toEqual(original)
  })

  it('should skip a kind of row the archive was written without', () => {
    const { appealCase, caseStrings, appealDecisions, ...oldArchive } =
      archive()

    const result = buildCaseRestore(archivedCase(), oldArchive)

    expect(result.appealCase).toBeUndefined()
    expect(result.caseStrings).toEqual([])
    expect(result.appealDecisions).toEqual([])
    expect(result.defendants).toHaveLength(2)
  })

  it.each([
    [
      'a case property that is no longer archived',
      archivedCase(),
      archive({ lawsBroken: 'original_laws_broken' }),
    ],
    [
      'a defendant property that is no longer archived',
      archivedCase(),
      archive({
        defendants: [
          { name: 'original_name1', phoneNumber: '5555555' },
          { name: 'original_name2' },
        ],
      }),
    ],
    [
      'an appeal case property that is no longer archived',
      archivedCase(),
      archive({ appealCase: { appealRuling: 'original_appeal_ruling' } }),
    ],
    [
      'fewer rows than were archived',
      archivedCase({ defendants: [{ id: defendantId1, created: new Date() }] }),
      archive(),
    ],
    [
      'more rows than were archived',
      archivedCase(),
      archive({ caseFiles: [] }),
    ],
    [
      'an archived appeal case without an appeal case',
      archivedCase({ appealCase: undefined }),
      archive(),
    ],
    [
      'an archived list that is not a list',
      archivedCase(),
      archive({ caseStrings: { value: 'original_value' } }),
    ],
    [
      'an archived row that is not an object',
      archivedCase(),
      archive({ caseStrings: ['original_value'] }),
    ],
    [
      'rows created at the same time and archived with different values',
      archivedCase({
        defendants: [
          { id: defendantId1, created: new Date('2026-01-01T10:00:00.000Z') },
          { id: defendantId2, created: new Date('2026-01-01T10:00:00.000Z') },
        ],
      }),
      archive(),
    ],
  ])('should reject %s', (_, theCase, theArchive) => {
    expect(() => buildCaseRestore(theCase, theArchive)).toThrow(
      CaseArchiveMismatchError,
    )
  })

  it('should restore rows created at the same time when they were archived with the same values', () => {
    const created = new Date('2026-01-04T10:00:00.000Z')
    const appealDecisionId2 = uuid()

    const result = buildCaseRestore(
      archivedCase({
        appealDecisions: [
          { id: appealDecisionId, created },
          { id: appealDecisionId2, created },
        ],
      }),
      archive({
        appealDecisions: [{ announcement: null }, { announcement: null }],
      }),
    )

    expect(result.appealDecisions).toEqual([
      { id: appealDecisionId, properties: { announcement: null } },
      { id: appealDecisionId2, properties: { announcement: null } },
    ])
  })

  describe('an archive that carries row ids', () => {
    const created = new Date('2026-01-01T10:00:00.000Z')
    const tiedCase = (overrides: object = {}) =>
      archivedCase({
        defendants: [
          { id: defendantId1, created },
          { id: defendantId2, created },
        ],
        ...overrides,
      })

    it('should match rows by id, whatever their order and creation times', () => {
      const result = buildCaseRestore(
        tiedCase(),
        archive({
          appealCase: {
            id: appealCaseId,
            appealConclusion: 'original_appeal_conclusion',
          },
          defendants: [
            { id: defendantId2, name: 'original_name2' },
            { id: defendantId1, name: 'original_name1' },
          ],
        }),
      )

      expect(result.appealCase).toEqual({
        id: appealCaseId,
        properties: { appealConclusion: 'original_appeal_conclusion' },
      })
      expect(result.defendants).toEqual([
        { id: defendantId2, properties: { name: 'original_name2' } },
        { id: defendantId1, properties: { name: 'original_name1' } },
      ])
    })

    it.each([
      [
        'an archived row id that is not a row of the case',
        archive({
          defendants: [
            { id: defendantId1, name: 'original_name1' },
            { id: uuid(), name: 'original_name2' },
          ],
        }),
      ],
      [
        'an archived row id that is repeated',
        archive({
          defendants: [
            { id: defendantId1, name: 'original_name1' },
            { id: defendantId1, name: 'original_name2' },
          ],
        }),
      ],
      [
        'a list where only some rows carry an id',
        archive({
          defendants: [
            { id: defendantId1, name: 'original_name1' },
            { name: 'original_name2' },
          ],
        }),
      ],
      [
        'an archived appeal case id that is not the appeal case of the case',
        archive({ appealCase: { id: uuid(), appealConclusion: '' } }),
      ],
    ])('should reject %s', (_, theArchive) => {
      expect(() => buildCaseRestore(archivedCase(), theArchive)).toThrow(
        CaseArchiveMismatchError,
      )
    })
  })

  it('should tell indictment counts created at the same time apart by their display order', () => {
    const created = new Date('2026-01-05T10:00:00.000Z')
    const countId1 = uuid()
    const countId2 = uuid()

    const result = buildCaseRestore(
      archivedCase({
        indictmentCounts: [
          { id: countId1, displayOrder: 0, created },
          { id: countId2, displayOrder: 1, created },
        ],
      }),
      archive({
        indictmentCounts: [
          { incidentDescription: 'first' },
          { incidentDescription: 'second' },
        ],
      }),
    )

    expect(result.indictmentCounts).toEqual([
      { id: countId1, properties: { incidentDescription: 'first' } },
      { id: countId2, properties: { incidentDescription: 'second' } },
    ])
  })
})
