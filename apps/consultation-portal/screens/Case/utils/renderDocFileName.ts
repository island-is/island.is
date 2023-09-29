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
    const shortFileName = name.substring(0, len)
    const retFileName = `${shortFileName}...`
    return retFileName
  }
}

export default renderDocFileName
