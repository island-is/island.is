import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  DropdownMenu,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { OJOIFieldBaseProps } from '../lib/types'
import { useLocale } from '@island.is/localization'
import { base64ToBlob, parseZodIssue } from '../lib/utils'
import { Routes } from '../lib/constants'
import { useApplication } from '../hooks/useUpdateApplication'
import { advert, error, preview, signatures } from '../lib/messages'
import { previewValidationSchema, signatureValidator } from '../lib/dataSchema'
import { ZodCustomIssue } from 'zod'
import { usePdf } from '../hooks/usePdf'
import { useState } from 'react'
import { AdvertPreview } from '../components/advertPreview/AdvertPreview'
import { useSignatures } from '../hooks/useSignatures'

export const Preview = ({ application, goToScreen }: OJOIFieldBaseProps) => {
  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })

  const [hasInvalidPdf, setHasInvalidPdf] = useState(false)

  const { formatMessage: f } = useLocale()

  const { signatureHtml } = useSignatures({
    applicationId: application.id,
    variant:
      application?.answers?.misc?.signatureType === 'committee'
        ? 'committee'
        : 'regular',
  })

  const parsedHtml = Buffer.from(
    currentApplication.answers.advert?.html ?? '',
    'base64',
  ).toString('utf-8')

  const fullHtml = `${parsedHtml}${signatureHtml}`

  const {
    fetchPdf,
    error: pdfError,
    loading: pdfLoading,
  } = usePdf({
    applicationId: application.id,
    onComplete: (data) => {
      const blob = base64ToBlob(data.OJOIAGetPdf.pdf)

      if (!blob) {
        setHasInvalidPdf(true)
        return
      }

      const url = URL.createObjectURL(blob)

      let downloadName
      const type = currentApplication.answers.advert?.type?.title
      if (type) {
        downloadName = type.replace('.', '')
      }

      const title = currentApplication.answers.advert?.title
      if (title) {
        downloadName += ` ${title}`
      }

      if (!downloadName) {
        downloadName = `Innsending ${application.id}`
      }

      downloadName += '.pdf'

      try {
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = downloadName
        anchor.click()
        anchor.remove()
      } finally {
        URL.revokeObjectURL(url)
      }
    },
  })

  const advertValidationCheck = previewValidationSchema.safeParse(
    currentApplication.answers,
  )

  const signatureValidationCheck = signatureValidator(
    application.answers.misc?.signatureType ?? 'regular',
  ).safeParse(currentApplication.answers.signature)

  const hasError = !(
    advertValidationCheck.success &&
    signatureValidationCheck.success &&
    !pdfError &&
    !hasInvalidPdf
  )

  return (
    <Stack space={4}>
      <Box>
        <DropdownMenu
          disclosure={
            <Button
              iconType="outline"
              icon="download"
              variant="utility"
              loading={pdfLoading}
              disabled={pdfLoading}
            >
              {f(preview.buttons.fetchPdf)}
            </Button>
          }
          items={[
            {
              onClick: (e) => {
                e.preventDefault()
                fetchPdf()
              },
              title: f(preview.buttons.fetchPdf),
            },
            {
              onClick: (e) => {
                e.preventDefault()
                fetchPdf({
                  variables: {
                    input: { showDate: false, id: application.id },
                  },
                })
              },
              title: f(preview.buttons.fetchPdfNoDate),
            },
          ]}
          title={f(preview.buttons.fetchPdf)}
        />
      </Box>
      <Box hidden={!hasError}>
        <Stack space={2}>
          {pdfError && (
            <AlertMessage
              type="error"
              title={f(preview.errors.pdfError)}
              message={f(preview.errors.pdfErrorMessage)}
            />
          )}
          {hasInvalidPdf && (
            <AlertMessage
              type="error"
              title={f(preview.errors.invalidPdf)}
              message={f(preview.errors.invalidPdfMessage)}
            />
          )}
          {!advertValidationCheck.success && (
            <AlertMessage
              type="warning"
              title={f(preview.errors.noContent)}
              message={
                <Stack space={2}>
                  <Text>{f(preview.errors.noContentMessage)}</Text>
                  <BulletList color="black">
                    {advertValidationCheck.error.issues.map((issue, i) => {
                      const parsedIssue = parseZodIssue(issue as ZodCustomIssue)
                      return <Bullet key={i}>{f(parsedIssue.message)}</Bullet>
                    })}
                  </BulletList>
                  <Button
                    onClick={() => {
                      goToScreen && goToScreen(Routes.ADVERT)
                    }}
                    size="small"
                    variant="text"
                    preTextIcon="arrowBack"
                  >
                    Opna kafla {f(advert.general.section)}
                  </Button>
                </Stack>
              }
            />
          )}
          {!signatureValidationCheck.success && (
            <AlertMessage
              type="warning"
              title={f(error.missingFieldsTitle, {
                x: f(signatures.general.section, {
                  abbreviation: 'a',
                }),
              })}
              message={
                <Stack space={2}>
                  <Text>
                    {f(error.missingSignatureFieldsMessage, {
                      x: (
                        <strong>
                          {f(advert.general.sectionWithAbbreviation, {
                            x: 'a',
                          })}
                        </strong>
                      ),
                    })}
                  </Text>
                  <BulletList color="black">
                    {signatureValidationCheck.error.issues.map((issue, i) => {
                      const parsedIssue = parseZodIssue(issue as ZodCustomIssue)
                      return <Bullet key={i}>{f(parsedIssue.message)}</Bullet>
                    })}
                  </BulletList>
                  <Button
                    onClick={() => {
                      goToScreen && goToScreen(Routes.ADVERT)
                    }}
                    size="small"
                    variant="text"
                    preTextIcon="arrowBack"
                  >
                    Opna kafla {f(advert.general.section)}
                  </Button>
                </Stack>
              }
            />
          )}
        </Stack>
      </Box>
      <Box border="standard" borderRadius="large">
        <AdvertPreview
          advertSubject={currentApplication.answers.advert?.title}
          advertType={currentApplication.answers.advert?.type?.title}
          advertText={fullHtml}
        />
      </Box>
    </Stack>
  )
}
