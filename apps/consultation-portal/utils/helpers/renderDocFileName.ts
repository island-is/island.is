import { REVIEW_CARD_MAX_FILENAME_LENGTH } from '../consts/consts'

export const renderDocFileName = (docFileName: string) => {
  if (docFileName.length < REVIEW_CARD_MAX_FILENAME_LENGTH) {
    return docFileName
  } else {
    // finding the first 38 characters in filename to return a shorter name
    const indexOfLastDot = docFileName.lastIndexOf('.')
    const fileName = docFileName.substring(0, indexOfLastDot)
    const extensionName = docFileName.substring(indexOfLastDot)
    const shortFileName = fileName.substring(
      0,
      REVIEW_CARD_MAX_FILENAME_LENGTH - extensionName.length,
    )
    const retFileName = `${shortFileName}..${extensionName}`
    return retFileName
  }
}
