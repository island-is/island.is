import { AdviceFileRequest } from '../../types/interfaces'
import { fileToBase64 } from './fileToBase64'

export const resolveFileToObject = async (file: File) => {
  const base64String = await fileToBase64(file)
    .then((base64: string) => {
      return {
        fileName: file.name,
        base64Document: base64,
      }
    })
    .catch((e) => console.error(e))

  return base64String as AdviceFileRequest
}

export default resolveFileToObject
