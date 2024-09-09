import {
  InputFileUpload,
  Box,
  UploadFile,
  fileToObject,
  AlertMessage,
  Stack,
  Button,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  useGetRequestsLazyQuery,
  useGetRequestsQuery,
  useVehicleBulkMileagePostMutation,
} from './VehicleBulkMileageUpload.generated'
import { useEffect, useState } from 'react'
import { FileError, FileRejection } from 'react-dropzone'
import {
  IntroHeader,
  Modal,
  SAMGONGUSTOFA_SLUG,
  m,
} from '@island.is/service-portal/core'
import { parseCsvToMileageRecord } from '../../utils/parseCsvToMileage'
import { Problem } from '@island.is/react-spa/shared'

const VehicleBulkMileageUpload = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const [vehicleBulkMileagePostMutation, { data, loading, error }] =
    useVehicleBulkMileagePostMutation()

  const [
    getRequestsQuery,
    { data: requestsData, loading: requestsLoading, error: requestsError },
  ] = useGetRequestsLazyQuery()

  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )

  const [requestGuid, setRequestGuid] = useState<string | null>()

  console.log(requestsData)

  useEffect(() => {
    const id = data?.vehicleBulkMileagePost?.vehicleId
    if (id && id !== requestGuid) {
      setRequestGuid(id)
    }
  }, [data?.vehicleBulkMileagePost?.vehicleId])

  useEffect(() => {
    if (uploadedFile) {
      postMileage(uploadedFile)
    }
  }, [uploadedFile])

  const postMileage = async (file: File) => {
    const records = await parseCsvToMileageRecord(file)
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

  const handleOnInputFileUploadError = (files: FileRejection[]) =>
    setUploadErrorMessage(files[0].errors[0].message)

  const handleOnInputFileUploadRemove = () => setUploadedFile(null)

  const handleOnInputFileUploadChange = (files: File[]) => {
    const file = fileToObject(files[0])
    if (file.status === 'done' && file.originalFileObj instanceof File) {
      setUploadedFile(file.originalFileObj)
    }
  }

  const handleOnModalClick = () => {
    console.log(requestGuid)
    if (requestGuid) {
      getRequestsQuery()
    }
  }

  return (
    <Box>
      <IntroHeader
        title={m.vehiclesBulkMileageUpload}
        intro={'Hér geturu hlaðið upp skjaldi til að magnskrá kílómetrastöður'}
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      >
        <Box marginTop={2}>
          <Modal
            id={'mileage-status-modal'}
            initialVisibility={false}
            title={'Staða á kílómetrastöðudjobbi'}
            disclosure={
              <Button
                colorScheme="default"
                icon="download"
                iconType="outline"
                onClick={() => handleOnModalClick()}
                disabled={!requestGuid}
                size="default"
                variant="utility"
              >
                <p>skoða stöðu á jobbi</p>
              </Button>
            }
          />
        </Box>
      </IntroHeader>

      <Stack space={2}>
        {error && <Problem error={error} />}
        {data?.vehicleBulkMileagePost?.errorMessage && !loading && !error && (
          <AlertMessage
            type="warning"
            title="Upphleðsla mistókst"
            message={data.vehicleBulkMileagePost.errorMessage}
          />
        )}
        {data?.vehicleBulkMileagePost?.vehicleId &&
          !data?.vehicleBulkMileagePost?.errorMessage &&
          !loading &&
          !error && (
            <AlertMessage
              type="success"
              title="Upphleðsla tókst"
              message={'Skoða má stöðu upphleðslu á magnskráningarsíðu'}
            />
          )}
        <InputFileUpload
          fileList={uploadedFile ? [uploadedFile] : []}
          showFileSize
          header={'bing bong'}
          disabled={!!data?.vehicleBulkMileagePost?.errorMessage}
          description="bngong"
          buttonLabel="gjeriaogj"
          accept={'.csv'}
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
