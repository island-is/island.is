import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'

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

export const ApplicantList: FC<React.PropsWithChildren<ApplicantListProps>> = ({
  application,
}) => {
  const [updateApplicationExternalData, { loading }] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )
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
  const { locale } = useLocale()
  useEffect(() => {
    fetchPdfData()
  }, [])

  return (
    <Box marginY={2} width="full" flexGrow={1}>
      {!loading &&
        pdfData?.data?.map((applicant) => {
          return (
            <>
              <Box marginY={2}>
                <Button
                  key={applicant.nationalId}
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
            </>
          )
        })}
    </Box>
  )
}
