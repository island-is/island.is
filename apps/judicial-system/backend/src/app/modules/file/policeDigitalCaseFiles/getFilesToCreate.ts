import { PoliceDigitalCaseFile as PoliceSystemDigitalCaseFile } from '../../police/models/PoliceDigitalCaseFile.model'
import { PoliceDigitalCaseFile } from '../../repository'

export const getFilesToCreate = (
  policeSystemDigitalCaseFiles: PoliceSystemDigitalCaseFile[],
  currentPoliceDigitalCaseFiles: PoliceDigitalCaseFile[],
  policeCaseNumbers: string[],
): PoliceSystemDigitalCaseFile[] => {
  const relevantDigitalCaseFiles = policeSystemDigitalCaseFiles.filter((f) =>
    policeCaseNumbers.includes(f.policeCaseNumber),
  )
  const existingIds = new Set(
    currentPoliceDigitalCaseFiles.map((f) => f.policeDigitalFileId),
  )
  return relevantDigitalCaseFiles.filter((f) => !existingIds.has(f.id))
}
