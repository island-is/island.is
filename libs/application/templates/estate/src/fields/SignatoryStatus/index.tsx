import { FC, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { FieldBaseProps } from '@island.is/application/types'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import {
  Box,
  LoadingDots,
  AlertMessage,
  Table as T,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { ApiActions } from '../../lib/constants'

interface Signatory {
  name: string
  nationalId: string
  signed: boolean
}

interface SignatoriesExternalData {
  getSignatories?: {
    data: {
      success: boolean
      signatories: Signatory[]
    }
    date: string
  }
}

export const SignatoryStatus: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, setSubmitButtonDisabled }) => {
  const { formatMessage, lang: locale } = useLocale()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [signatories, setSignatories] = useState<Signatory[]>(
    (application.externalData as SignatoriesExternalData)?.getSignatories?.data
      ?.signatories || [],
  )

  const [updateExternalData] = useMutation(UPDATE_APPLICATION_EXTERNAL_DATA)

  useEffect(() => {
    setSubmitButtonDisabled?.(true)

    const fetchSignatories = async () => {
      try {
        const { data } = await updateExternalData({
          variables: {
            input: {
              id: application.id,
              dataProviders: [
                {
                  actionId: ApiActions.getSignatories,
                  order: 0,
                },
              ],
            },
            locale,
          },
        })

        const externalData = data?.updateApplicationExternalData
          ?.externalData as SignatoriesExternalData | undefined
        const fetchedSignatories =
          externalData?.getSignatories?.data?.signatories || []
        setSignatories(fetchedSignatories)

        const allSigned =
          fetchedSignatories.length > 0 &&
          fetchedSignatories.every((s) => s.signed)
        setSubmitButtonDisabled?.(!allSigned)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchSignatories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" marginY={3}>
        <LoadingDots />
      </Box>
    )
  }

  if (error) {
    return (
      <Box marginY={3}>
        <AlertMessage
          type="error"
          title={formatMessage(m.signingTableTitle)}
          message={formatMessage(m.signingPendingDescription)}
        />
      </Box>
    )
  }

  return (
    <Box marginTop={3}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.inReviewNameLabel)}</T.HeadData>
            <T.HeadData>
              {formatMessage(m.inReviewNationalIdLabel)}
            </T.HeadData>
            <T.HeadData>{formatMessage(m.signingStatusLabel)}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {signatories.map((signatory, index) => (
            <T.Row key={index}>
              <T.Data>{signatory.name || ''}</T.Data>
              <T.Data>
                {formatNationalId(signatory.nationalId || '')}
              </T.Data>
              <T.Data>
                {signatory.signed
                  ? formatMessage(m.signingStatusSigned)
                  : formatMessage(m.signingStatusPending)}
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default SignatoryStatus
