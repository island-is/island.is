import {
  Box,
  Text,
  AlertMessage,
  Stack,
  InputFileUpload,
  DropdownMenu,
  UploadFile,
  FileUploadStatus,
  LoadingDots,
} from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { AssetsPaths } from '../../lib/paths'
import {
  useVehiclesTemplateDownloadUrlQuery,
  useCreateVehicleBulkUploadUrlMutation,
  useVehicleBulkMileagePostFileMutation,
} from './VehicleBulkMileageUpload.generated'
import { vehicleMessage } from '../../lib/messages'
import {
  IntroWrapper,
  LinkButton,
  SAMGONGUSTOFA_SLUG,
  formSubmit,
  m,
  useFileUpload,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { FILE_TYPES } from '../../utils/constants'

const extensionToType = {
  [fileExtensionWhitelist['.csv']]: 'csv',
  [fileExtensionWhitelist['.xlsx']]: 'xlsx',
} as const

const VehicleBulkMileageUpload = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const { uploadFile, activeFile, setActiveFile } = useFileUpload()
  const [createVehicleBulkUploadUrl, { loading: loadingURL, error: errorURL }] =
    useCreateVehicleBulkUploadUrlMutation()
  const [postBulkMileageFileMutation, { data, loading, error }] =
    useVehicleBulkMileagePostFileMutation()

  const {
    data: templateData,
    error: templateError,
    loading: templateLoading,
  } = useVehiclesTemplateDownloadUrlQuery()

  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )

  const [requestGuid, setRequestGuid] = useState<string | null>()

  useEffect(() => {
    const id = data?.vehicleBulkMileagePostFile?.requestId
    if (id && id !== requestGuid) {
      setRequestGuid(id)
    }
    if (uploadErrorMessage) {
      setUploadErrorMessage(null)
    }
  }, [data?.vehicleBulkMileagePostFile?.requestId])

  const handleOnInputFileUploadError = (files: FileRejection[]) => {
    if (files[0].errors[0].code === 'file-invalid-type') {
      setUploadErrorMessage(formatMessage(vehicleMessage.invalidFileType))
    } else {
      setUploadErrorMessage(files[0].errors[0].message)
    }
  }

  const handleOnInputFileUploadRemove = () => setActiveFile(undefined)

  const handleOnInputFileUploadChange = async (files: File[]) => {
    if (requestGuid) {
      setRequestGuid(null)
    }
    const file = files[0]

    // Convert File to UploadFile
    const uploadFileObject: UploadFile = {
      name: file.name,
      type: file.type,
      size: file.size,
      originalFileObj: file,
      status: FileUploadStatus.done,
      percent: 0,
    }

    const type = file.type ? extensionToType[file.type] : undefined

    if (!type) {
      setUploadErrorMessage(formatMessage(vehicleMessage.wrongFileType))
      return
    }

    try {
      const response = await createVehicleBulkUploadUrl({
        variables: {
          filename: file.name,
        },
      })
      if (response && response.data && response.data.createUploadUrl) {
        await uploadFile(uploadFileObject, response.data.createUploadUrl)

        await postBulkMileageFileMutation({
          variables: {
            input: {
              fileUrl: response.data.createUploadUrl.fields.key,
              originCode: 'ISLAND.IS',
            },
          },
        })
      }
    } catch (err) {
      setUploadErrorMessage(formatMessage(vehicleMessage.uploadFailed))
    }
  }

  return (
    <IntroWrapper
      title={m.vehiclesBulkMileageUpload}
      intro={m.vehiclesBulkMileageUploadDescription}
      serviceProviderSlug={SAMGONGUSTOFA_SLUG}
      serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      buttonGroup={
        templateData?.vehiclesMileageTemplateFileDownloadUrl
          ? [
              <DropdownMenu
                icon="ellipsisHorizontal"
                key="download-template"
                menuLabel={formatMessage(vehicleMessage.downloadTemplate)}
                items={FILE_TYPES.map((type) => ({
                  title: `.${type}`,
                  onClick: () =>
                    formSubmit(
                      `${templateData?.vehiclesMileageTemplateFileDownloadUrl}/${type}`,
                    ),
                }))}
                title={formatMessage(vehicleMessage.downloadTemplate)}
                loading={templateLoading}
                disabled={!!templateLoading}
              />,
              loading || loadingURL ? (
                <Box
                  key="loading-indicator"
                  display="flex"
                  alignItems="center"
                  height="full"
                >
                  <LoadingDots single />
                </Box>
              ) : null,
            ]
          : []
      }
    >
      <Stack space={2}>
        {(error ?? errorURL) && (
          <Problem error={error ?? errorURL} noBorder={false} />
        )}
        {data?.vehicleBulkMileagePostFile?.errorMessage &&
          !loading &&
          !loadingURL &&
          !error &&
          !errorURL && (
            <AlertMessage
              type="warning"
              title={formatMessage(vehicleMessage.uploadFailed)}
              message={
                data?.vehicleBulkMileagePostFile?.errorCode === 429
                  ? formatMessage(vehicleMessage.mileageUploadTooManyRequests)
                  : data.vehicleBulkMileagePostFile.errorMessage
              }
            />
          )}
        {templateError && (
          <AlertMessage
            type="warning"
            title={formatMessage(vehicleMessage.downloadFailed)}
          />
        )}
        {requestGuid &&
          !data?.vehicleBulkMileagePostFile?.errorMessage &&
          !loading &&
          !loadingURL &&
          !error &&
          !errorURL && (
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
                        data?.vehicleBulkMileagePostFile?.requestId ?? '',
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
        {
          <InputFileUpload
            name={'vehicle-file-upload'}
            title={formatMessage(vehicleMessage.dragFileToUpload)}
            description={formatMessage(vehicleMessage.fileUploadAcceptedTypes)}
            buttonLabel={formatMessage(vehicleMessage.selectFileToUpload)}
            disabled={loadingURL || loading}
            files={activeFile ? [activeFile] : []}
            accept={['.csv', '.xlsx']}
            multiple={false}
            onRemove={handleOnInputFileUploadRemove}
            onChange={handleOnInputFileUploadChange}
            onUploadRejection={handleOnInputFileUploadError}
          />
        }
      </Stack>
    </IntroWrapper>
  )
}

export default VehicleBulkMileageUpload
