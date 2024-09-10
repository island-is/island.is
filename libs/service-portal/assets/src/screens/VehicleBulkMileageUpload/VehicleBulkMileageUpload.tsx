import {
  InputFileUpload,
  Box,
  UploadFile,
  fileToObject,
  AlertMessage,
  Stack,
  Button,
  Inline,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { FileError, FileRejection } from 'react-dropzone'
import {
  InfoLine,
  InfoLineStack,
  IntroHeader,
  LinkButton,
  Modal,
  SAMGONGUSTOFA_SLUG,
  m,
} from '@island.is/service-portal/core'
import { parseCsvToMileageRecord } from '../../utils/parseCsvToMileage'
import { Problem } from '@island.is/react-spa/shared'
import { AssetsPaths } from '../../lib/paths'
import { useVehicleBulkMileagePostMutation } from './VehicleBulkMileageUpload.generated'

const VehicleBulkMileageUpload = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

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
  }, [data?.vehicleBulkMileagePost?.requestId])

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
  return (
    <Box>
      <IntroHeader
        title={m.vehiclesBulkMileageUpload}
        intro={'Hér geturu hlaðið upp skjaldi til að magnskrá kílómetrastöður'}
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      >
        <Box marginTop={2}>
          <Inline space={2}>
            <LinkButton
              to={AssetsPaths.AssetsVehiclesBulkMileageJobOverview}
              text={'Skoða runuverkayfirlit'}
              variant="utility"
            />
            <LinkButton
              disabled={!requestGuid}
              to={AssetsPaths.AssetsVehiclesBulkMileageJobDetail.replace(
                ':id',
                //this is known since the button is disabled if there's no id
                requestGuid as string,
              )}
              text={'Skoða stöðu runuverks'}
              variant="utility"
            />
          </Inline>
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
        {data?.vehicleBulkMileagePost?.requestId &&
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
          header={'Senda inn runuverksskrá'}
          disabled={!!data?.vehicleBulkMileagePost?.errorMessage}
          buttonLabel="Hlaða upp skrá"
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
