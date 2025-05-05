import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as m from '../lib/messages'

type ApplicantListProps = {
  application: {
    id: string
  }
}

type PdfData = {
  fileName: string
  contentType: string
  data: string
}

type PdfDataForApplicantsExternalData = {
  data: {
    applicantName: string
    nationalId: string
    comment: string | undefined
    approved: boolean
    pdfData: PdfData
  }[]
  date: Date
  status: 'success' | 'failiure'
}

export const ApplicantList = ({ application }: ApplicantListProps) => {
  const [updateApplicationExternalData, { loading }] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )
  const { locale, formatMessage } = useLocale()
  const onClickDownload = async (pdfData: PdfData) => {
    const blob = new Blob([Buffer.from(pdfData.data, 'base64')])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = pdfData.fileName
    link.click()
  }
  const fetchPdfData = async () => {
    const res = await updateApplicationExternalData({
      variables: {
        input: {
          id: application.id,
          dataProviders: [
            {
              actionId: 'HealthInsuranceDeclaration.getPdfDataForApplicants',
              order: 0,
            },
          ],
        },
        locale,
      },
    })
    setPdfData(
      res?.data?.updateApplicationExternalData?.externalData
        ?.pdfDataForApplicants,
    )
  }
  const [pdfData, setPdfData] = useState<PdfDataForApplicantsExternalData>()
  useEffect(() => {
    fetchPdfData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <Box marginY={3} width="full" flexGrow={1}>
        <Box display="flex" justifyContent="center">
          <LoadingDots />
        </Box>
      </Box>
    )
  }

  return (
    <Box marginY={3} width="full" flexGrow={1}>
      {pdfData?.status === 'success' ? (
        pdfData?.data?.map((applicant) => {
          return (
            <Box key={applicant.nationalId}>
              <Box marginY={2}>
                <Button
                  aria-label={m.conclution.downloadButtonAriaLabel}
                  preTextIconType="outline"
                  preTextIcon="download"
                  variant="ghost"
                  fluid
                  disabled={!applicant.approved}
                  onClick={() => onClickDownload(applicant.pdfData)}
                >
                  {applicant.applicantName}
                </Button>
              </Box>
              {!applicant.approved && (
                <AlertMessage
                  type="error"
                  message={applicant.comment && applicant.comment}
                />
              )}
            </Box>
          )
        })
      ) : (
        <Box flexGrow={1}>
          <AlertMessage
            type="error"
            message={formatMessage(m.errors.submitted.externalError)}
          />
        </Box>
      )}
    </Box>
  )
}
