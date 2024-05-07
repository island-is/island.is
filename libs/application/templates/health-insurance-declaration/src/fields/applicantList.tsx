import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'

type ApplicantListProps = {
  application: {
    id: string
    externalData: {
      pdfDataForApplicants: {
        data: {
          applicantName: string
          nationalId: string
          comment: string | undefined
          approved: boolean
        }[]
        date: Date
        status: 'success' | 'failiure'
      }
    }
  }
}

export const ApplicantList: FC<React.PropsWithChildren<ApplicantListProps>> = ({
  application,
}) => {
  const [updateApplicationExternalData, { loading }] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )
  const { locale, formatMessage } = useLocale()
  useEffect(() => {
    const fetchPdfData = async () => {
      await updateApplicationExternalData({
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
    }
    fetchPdfData()
  }, [])
  return (
    <Box marginY={2} width="full" flexGrow={1}>
      {!loading &&
        application.externalData?.pdfDataForApplicants.data.map((applicant) => {
          return (
            <>
              <Box marginY={2}>
                <Button
                  key={applicant.nationalId}
                  preTextIcon="download"
                  variant="ghost"
                  fluid
                  disabled={!applicant.approved}
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
