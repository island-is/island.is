import { GET_PRESIGNED_URL_MUTATION } from '../graphql/queries'
import { useMutation } from '@apollo/client'
import { EditorFileUploader } from '@dmr.is/regulations-tools/EditorFrame'

/**
 *
 * @param applicationId id of the application
 * @param attachmentType type of the attachment used for constructing the presigned URL key
 */
type UseFileUploadProps = {
  applicationId: string
}

type GetPresignedUrlResponse = {
  url: string
  cdn?: string
  key?: string
}

export const useApplicationAssetUploader = ({
  applicationId,
}: UseFileUploadProps) => {
  const [getPresignedUrlMutation] = useMutation<{
    officialJournalOfIcelandApplicationGetPresignedUrl: GetPresignedUrlResponse
  }>(GET_PRESIGNED_URL_MUTATION)

  const getPresignedUrl = async (name: string, type: string) => {
    const { data } = await getPresignedUrlMutation({
      variables: {
        input: {
          attachmentType: 'assets',
          applicationId: applicationId,
          fileName: name,
          fileType: type,
        },
      },
    })

    return data?.officialJournalOfIcelandApplicationGetPresignedUrl
  }

  const useFileUploader = () => {
    const fileUploader =
      (): EditorFileUploader => async (blobInfo, success, failure) => {
        const file = blobInfo.blob() as File

        const fileExtension = file.name.split('.').pop()
        const fileName = file.name.split('.').slice(0, -1).join('.')

        if (!fileExtension) {
          failure(`Skráargerð ekki í boði`)
          return
        }

        try {
          const presignedRes = await getPresignedUrl(fileName, fileExtension)

          if (!presignedRes?.url) {
            failure(
              `Ekki tókst að vista skjal í gagnageymslu: slóð ekki í svari`,
            )
            return
          }

          const didUpload = await fetch(presignedRes.url, {
            headers: {
              'Content-Type': file.type,
              'Content-Length': file.size.toString(),
            },
            method: 'PUT',
            body: file,
          })

          if (!didUpload.ok) {
            failure(`Ekki tókst að hlaða upp skjali í gagnageymslu S3`)
            return
          }

          const urlRes = `${presignedRes.cdn}/${presignedRes.key}`

          success(urlRes)
        } catch (error) {
          failure(
            'Vandamál við að hlaða upp myndum. Vinsamlegast reynið aftur síðar.',
          )
        }
      }
    return fileUploader
  }

  return { useFileUploader }
}
