import React, { useState } from 'react'
import {
  Box,
  LoadingDots,
  Checkbox,
  InputFileUpload,
  fileToObject,
  UploadFile,
  AlertBanner,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { BulkEndorse } from '../../graphql/mutations'
import { read, utils } from 'xlsx'
import { useMutation } from '@apollo/client'
import FileUploadDisclaimer from '../FileUploadDisclaimer'
import { Application } from '@island.is/application/core'
import { format as formatKennitala } from 'kennitala'

interface BulkUploadProps {
  application: Application
  onSuccess: () => void
}

const BulkUpload = ({ application, onSuccess }: BulkUploadProps) => {
  const { formatMessage } = useLocale()
  const [usePapers, setUsePapers] = useState(false)
  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkUploadDone, setBulkUploadDone] = useState(false)
  const [bulkUploadFailed, setBulkUploadFailed] = useState(false)
  const [createBulkEndorsements, { data = {} }] = useMutation(BulkEndorse)
  const failedNatonalIds = data?.endorsementSystemBulkEndorseList?.failed
    .map((x: any) => formatKennitala(x?.nationalId))
    .join(', ')
  const succeededNatonalIds = data?.endorsementSystemBulkEndorseList?.succeeded

  const onChange = (newFiles: File[]) => {
    const newUploadFiles = newFiles.map((f) => fileToObject(f))
    setBulkUploadFailed(false)
    newUploadFiles.forEach((f: UploadFile) => {
      uploadFile(f)
    })
  }

  const onBulkUpload = async (nationalIds: string[]) => {
    setBulkUploadDone(false)
    setBulkUploadFailed(false)
    setBulkUploading(true)
    const response = await createBulkEndorsements({
      variables: {
        input: {
          listId: (application.externalData?.createEndorsementList.data as any)
            .id,
          nationalIds,
        },
      },
    }).catch(() => {
      setBulkUploadFailed(true)
    })

    if (response) {
      setBulkUploadDone(true)
      onSuccess()
    }
    setBulkUploading(false)
  }

  const uploadFile = (file: UploadFile) => {
    const formData = new FormData()
    formData.append('file', file.originalFileObj || '', file.name)

    const fileReader: FileReader = new FileReader()
    fileReader.onload = () => {
      try {
        const workbook = read(fileReader.result, { type: 'binary' })
        let data: any[] = []
        for (const sheet in workbook.Sheets) {
          const workSheet = workbook.Sheets[sheet]
          /** Converts a worksheet object to an array of JSON objects */
          const jsonSheet = utils.sheet_to_json(workSheet, { header: ['kt'] })
          data = data.concat(
            jsonSheet.map((x: any) => x.kt.toString().replace(/[^0-9]/g, '')),
          )
        }
        onBulkUpload(data)
      } catch (e) {
        setBulkUploadFailed(true)
      }
    }
    if (file.originalFileObj) {
      fileReader.readAsBinaryString(file.originalFileObj)
    }
  }

  return (
    <Box>
      <Box marginY={3}>
        <Checkbox
          label={formatMessage(m.fileUpload.includePapers)}
          checked={usePapers}
          onChange={() => {
            setUsePapers(!usePapers)
          }}
        />
      </Box>
      <FileUploadDisclaimer />
      {usePapers && !bulkUploading && (
        <>
          {bulkUploadDone && (
            <Box marginY={5}>
              {succeededNatonalIds?.length > 0 && (
                <AlertBanner
                  title={formatMessage(m.fileUpload.uploadSuccess)}
                  variant="success"
                />
              )}
            </Box>
          )}

          <Box marginY={5}>
            <InputFileUpload
              fileList={[]}
              header={formatMessage(m.fileUpload.fileUploadHeader)}
              description={formatMessage(m.fileUpload.uploadDescription)}
              buttonLabel={formatMessage(m.fileUpload.uploadButtonLabel)}
              accept=".xlsx"
              onChange={onChange}
              onRemove={(_) => _}
              errorMessage={
                bulkUploadFailed
                  ? formatMessage(m.fileUpload.uploadFail)
                  : undefined
              }
            />
          </Box>

          {failedNatonalIds?.length > 0 && (
            <Box marginY={5}>
              <AlertBanner
                title={formatMessage(m.fileUpload.attention)}
                description={
                  formatMessage(m.fileUpload.uploadWarningText) +
                  failedNatonalIds
                }
                variant="warning"
              >
                {failedNatonalIds}
              </AlertBanner>
            </Box>
          )}
        </>
      )}

      {bulkUploading && (
        <Box
          marginY={5}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <LoadingDots />
        </Box>
      )}
    </Box>
  )
}

export default BulkUpload
