import {
  InputFileUpload,
  Box,
  Text,
  fileToObject,
  AlertMessage,
  Stack,
} from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import {
  IntroHeader,
  LinkButton,
  SAMGONGUSTOFA_SLUG,
  m,
} from '@island.is/service-portal/core'
import { Problem } from '@island.is/react-spa/shared'
import { AssetsPaths } from '../../lib/paths'
import { useVehicleBulkMileagePostMutation } from './VehicleBulkMileageUpload.generated'
import VehicleBulkMileageFileDownloader from '../VehicleBulkMileage/VehicleBulkMileageFileDownloader'
import { vehicleMessage } from '../../lib/messages'
import { parseFileToMileageRecord } from '../../utils/parseFileToMileage'

const VehicleBulkMileageUpload = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const [vehicleBulkMileagePostMutation, { data, loading, error }] =
    useVehicleBulkMileagePostMutation()

  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )
  const [downloadError, setDownloadError] = useState<string | null>()

  const [requestGuid, setRequestGuid] = useState<string | null>()

  useEffect(() => {
    const id = data?.vehicleBulkMileagePost?.requestId
    if (id && id !== requestGuid) {
      setRequestGuid(id)
    }
    if (uploadErrorMessage) {
      setUploadErrorMessage(null)
    }
  }, [data?.vehicleBulkMileagePost?.requestId])

  const postMileage = async (file: File, type: 'xlsx' | 'csv') => {
    try {
      const records = await parseFileToMileageRecord(file, type)
      if (!records.length) {
        setUploadErrorMessage(formatMessage(vehicleMessage.uploadFailed))
        return
      }
      if (typeof records === 'string') {
        setUploadErrorMessage(records)
        return
      }
      vehicleBulkMileagePostMutation({
        variables: {
          input: {
            mileageData: records.map((r) => ({
              mileageNumber: r.mileage,
              vehicleId: r.vehicleId,
            })),
            originCode: 'ISLAND.IS',
          },
        },
      })
    } catch (error) {
      setUploadErrorMessage(
        `${formatMessage(vehicleMessage.errorWhileProcessing) + error.message}
        `,
      )
    }
  }

  const handleOnInputFileUploadError = (files: FileRejection[]) =>
    setUploadErrorMessage(files[0].errors[0].message)

  const handleOnInputFileUploadRemove = () => setUploadedFile(null)

  const handleOnInputFileUploadChange = (files: File[]) => {
    if (requestGuid) {
      setRequestGuid(null)
    }
    const file = fileToObject(files[0])
    if (file.status === 'done' && file.originalFileObj instanceof File) {
      const type =
        file.type === fileExtensionWhitelist['.csv']
          ? 'csv'
          : file.type === fileExtensionWhitelist['.xlsx']
          ? 'xlsx'
          : undefined

      if (!type) {
        setUploadErrorMessage(formatMessage(vehicleMessage.wrongFileType))
        return
      }

      postMileage(file.originalFileObj, type)
    }
  }

  const handleFileDownloadError = (error: string) => {
    setDownloadError(error)
  }

  return (
    <Box>
      <IntroHeader
        title={m.vehiclesBulkMileageUpload}
        intro={m.vehiclesBulkMileageUploadDescription}
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      >
        <Box marginTop={2}>
          <VehicleBulkMileageFileDownloader onError={handleFileDownloadError} />
        </Box>
      </IntroHeader>

      <Stack space={2}>
        {error && <Problem error={error} noBorder={false} />}
        {data?.vehicleBulkMileagePost?.errorMessage && !loading && !error && (
          <AlertMessage
            type="warning"
            title={formatMessage(vehicleMessage.uploadFailed)}
            message={data.vehicleBulkMileagePost.errorMessage}
          />
        )}
        {downloadError && (
          <AlertMessage
            type="warning"
            title={formatMessage(vehicleMessage.downloadFailed)}
            message={downloadError}
          />
        )}
        {data?.vehicleBulkMileagePost?.errorMessage && !loading && !error && (
          <AlertMessage
            type="warning"
            title={formatMessage(vehicleMessage.uploadFailed)}
            message={data.vehicleBulkMileagePost.errorMessage}
          />
        )}
        {requestGuid &&
          !data?.vehicleBulkMileagePost?.errorMessage &&
          !loading &&
          !error && (
            <AlertMessage
              type="success"
              title={formatMessage(vehicleMessage.uploadSuccess)}
              message={
                <Box>
                  <Text variant="small">
                    {formatMessage(vehicleMessage.bulkMileageUploadStatus)}
                  </Text>
                  <Box marginTop="smallGutter">
                    <LinkButton
                      to={AssetsPaths.AssetsVehiclesBulkMileageJobDetail.replace(
                        ':id',
                        data?.vehicleBulkMileagePost?.requestId ?? '',
                      )}
                      text={formatMessage(vehicleMessage.openJob)}
                      variant="text"
                      icon="arrowForward"
                    />
                  </Box>
                </Box>
              }
            />
          )}
        <InputFileUpload
          fileList={uploadedFile ? [uploadedFile] : []}
          showFileSize
          header={formatMessage(vehicleMessage.dragFileToUpload)}
          description={formatMessage(vehicleMessage.fileUploadAcceptedTypes)}
          disabled={!!data?.vehicleBulkMileagePost?.errorMessage}
          buttonLabel={formatMessage(vehicleMessage.selectFileToUpload)}
          accept={['.csv', '.xlsx']}
          multiple={false}
          onRemove={handleOnInputFileUploadRemove}
          onChange={handleOnInputFileUploadChange}
          onUploadRejection={handleOnInputFileUploadError}
          errorMessage={uploadErrorMessage ?? undefined}
        />
      </Stack>
    </Box>
  )
}

export default VehicleBulkMileageUpload
