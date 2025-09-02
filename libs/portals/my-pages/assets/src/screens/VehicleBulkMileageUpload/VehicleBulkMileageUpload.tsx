import {
  Box,
  Text,
  fileToObjectDeprecated,
  AlertMessage,
  Stack,
  InputFileUpload,
  DropdownMenu,
} from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { AssetsPaths } from '../../lib/paths'
import {
  useVehicleBulkMileagePostMutation,
  useVehiclesTemplateDownloadUrlQuery,
} from './VehicleBulkMileageUpload.generated'
import { vehicleMessage } from '../../lib/messages'
import { parseFileToMileageRecord } from '../../utils/parseFileToMileage'
import {
  IntroWrapper,
  LinkButton,
  SAMGONGUSTOFA_SLUG,
  formSubmit,
  m,
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

  const {
    data: templateData,
    error: templateError,
    loading: templateLoading,
  } = useVehiclesTemplateDownloadUrlQuery()

  const [vehicleBulkMileagePostMutation, { data, loading, error }] =
    useVehicleBulkMileagePostMutation()

  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )

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
    const records = await parseFileToMileageRecord(file, type)

    if (!Array.isArray(records)) {
      if (records.code === 1) {
        setUploadErrorMessage(formatMessage(vehicleMessage.invalidPermNoColumn))
      } else if (records.code === 2) {
        setUploadErrorMessage(
          formatMessage(vehicleMessage.invalidMileageColumn),
        )
      } else {
        setUploadErrorMessage(formatMessage(vehicleMessage.uploadFailed))
      }
      return
    }

    if (!records.length) {
      setUploadErrorMessage(formatMessage(vehicleMessage.noDataInUploadedFile))
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
  }

  const handleOnInputFileUploadError = (files: FileRejection[]) => {
    if (files[0].errors[0].code === 'file-invalid-type') {
      setUploadErrorMessage(formatMessage(vehicleMessage.invalidFileType))
    } else {
      setUploadErrorMessage(files[0].errors[0].message)
    }
  }

  const handleOnInputFileUploadRemove = () => setUploadedFile(null)

  const handleOnInputFileUploadChange = (files: File[]) => {
    if (requestGuid) {
      setRequestGuid(null)
    }
    const file = fileToObjectDeprecated(files[0])

    if (file.status === 'done' && file.originalFileObj instanceof File) {
      //use value of file extension as key

      const type = file.type ? extensionToType[file.type] : undefined

      if (!type) {
        setUploadErrorMessage(formatMessage(vehicleMessage.wrongFileType))
        return
      }

      postMileage(file.originalFileObj, type)
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
                menuLabel={formatMessage(vehicleMessage.downloadTemplate)}
                items={FILE_TYPES.map((type) => ({
                  title: `.${type}`,
                  onClick: () =>
                    formSubmit(
                      `${templateData?.vehiclesMileageTemplateFileDownloadUrl}/${type}`,
                    ),
                }))}
                title={formatMessage(vehicleMessage.downloadTemplate)}
                loading={loading}
                disabled={!!templateLoading}
              />,
            ]
          : []
      }
    >
      <Stack space={2}>
        {error && <Problem error={error} noBorder={false} />}
        {data?.vehicleBulkMileagePost?.errorMessage && !loading && !error && (
          <AlertMessage
            type="warning"
            title={formatMessage(vehicleMessage.uploadFailed)}
            message={
              data?.vehicleBulkMileagePost?.errorCode === 429
                ? formatMessage(vehicleMessage.mileageUploadTooManyRequests)
                : data.vehicleBulkMileagePost.errorMessage
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
        {
          <InputFileUpload
            name={'vehicle-file-upload'}
            title={formatMessage(vehicleMessage.dragFileToUpload)}
            description={formatMessage(vehicleMessage.fileUploadAcceptedTypes)}
            buttonLabel={formatMessage(vehicleMessage.selectFileToUpload)}
            disabled={!!data?.vehicleBulkMileagePost?.errorMessage}
            files={uploadedFile ? [uploadedFile] : []}
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
