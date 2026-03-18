import { PoliceDigitalCaseFile as PoliceSystemDigitalCaseFile } from '../../../police/models/PoliceDigitalCaseFile.model'
import { PoliceDigitalCaseFile } from '../../../repository/models/policeDigitalCaseFile.model'
import { getFilesToCreate } from '../../policeDigitalCaseFiles/getFilesToCreate'

const makePoliceSystemDigitalCaseFile = (
  id: string,
  policeCaseNumber: string,
): PoliceSystemDigitalCaseFile => ({
  id,
  name: `file-${id}.pdf`,
  policeCaseNumber,
  policeExternalVendorId: `vendor-${id}`,
})

const makeCurrentPoliceDigitalCaseFile = (
  policeDigitalFileId: string,
): PoliceDigitalCaseFile =>
  ({ policeDigitalFileId } as unknown as PoliceDigitalCaseFile)

describe('getFilesToCreate', () => {
  const policeCaseNumbers = ['007-2024-1234', '007-2024-5678']

  describe('when all police system files are new', () => {
    it('returns all relevant files', () => {
      const policeSystemDigitalCaseFiles = [
        makePoliceSystemDigitalCaseFile('1', '007-2024-1234'),
        makePoliceSystemDigitalCaseFile('2', '007-2024-5678'),
      ]

      const result = getFilesToCreate(
        policeSystemDigitalCaseFiles,
        [],
        policeCaseNumbers,
      )

      expect(result).toEqual(policeSystemDigitalCaseFiles)
    })
  })

  describe('when some police system files already exist in the database', () => {
    it('returns only the ones not yet stored', () => {
      const policeSystemDigitalCaseFiles = [
        makePoliceSystemDigitalCaseFile('1', '007-2024-1234'),
        makePoliceSystemDigitalCaseFile('2', '007-2024-1234'),
        makePoliceSystemDigitalCaseFile('3', '007-2024-5678'),
      ]
      const currentPoliceDigitalCaseFiles = [
        makeCurrentPoliceDigitalCaseFile('1'),
      ]

      const result = getFilesToCreate(
        policeSystemDigitalCaseFiles,
        currentPoliceDigitalCaseFiles,
        policeCaseNumbers,
      )

      expect(result).toHaveLength(2)
      expect(result.map((f) => f.id)).toEqual(['2', '3'])
    })
  })

  describe('when all police system files already exist in the database', () => {
    it('returns an empty array', () => {
      const policeSystemDigitalCaseFiles = [
        makePoliceSystemDigitalCaseFile('1', '007-2024-1234'),
      ]
      const currentPoliceDigitalCaseFiles = [
        makeCurrentPoliceDigitalCaseFile('1'),
      ]

      const result = getFilesToCreate(
        policeSystemDigitalCaseFiles,
        currentPoliceDigitalCaseFiles,
        policeCaseNumbers,
      )

      expect(result).toEqual([])
    })
  })

  describe('when police system contains files for irrelevant police case numbers', () => {
    it('excludes files whose policeCaseNumber is not in the provided list', () => {
      const policeSystemDigitalCaseFiles = [
        makePoliceSystemDigitalCaseFile('1', '007-2024-1234'),
        makePoliceSystemDigitalCaseFile('2', '007-2024-9999'), // not in policeCaseNumbers
      ]

      const result = getFilesToCreate(
        policeSystemDigitalCaseFiles,
        [],
        policeCaseNumbers,
      )

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })
  })

  describe('when the police system returns no files', () => {
    it('returns an empty array', () => {
      const result = getFilesToCreate([], [], policeCaseNumbers)

      expect(result).toEqual([])
    })
  })
})
