import {
  DOWNLOAD_MAX_FILENAME_LENGTH,
  REVIEW_CARD_MAX_FILENAME_LENGTH,
} from '../../../utils/consts/consts'

interface Props {
  name: string
  isAdvice?: boolean
}

const renderDocFileName = ({ name, isAdvice = false }: Props) => {
  const len = isAdvice
    ? REVIEW_CARD_MAX_FILENAME_LENGTH
    : DOWNLOAD_MAX_FILENAME_LENGTH
  if (name.length < len) {
    return name
  } else {
    // finding the first 38 characters in filename to return a shorter name in case of REVEIEW_CARD_MAX_FILENAME_LENGTH
    const indexOfLastDot = name.lastIndexOf('.')
    const fileName = name.substring(0, indexOfLastDot)
    const extensionName = name.substring(indexOfLastDot)
    const shortFileName = fileName.substring(0, len - extensionName.length)
    const retFileName = `${shortFileName}..${extensionName}`
    return retFileName
  }
}

export default renderDocFileName
