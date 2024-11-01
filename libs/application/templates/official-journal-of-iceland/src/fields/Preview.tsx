import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { signatureConfig } from '../components/htmlEditor/config/signatureConfig'
import { OJOIFieldBaseProps } from '../lib/types'
import { useLocale } from '@island.is/localization'
import { HTMLText } from '@island.is/regulations-tools/types'
import {
  base64ToBlob,
  getAdvertMarkup,
  getSignaturesMarkup,
  parseZodIssue,
} from '../lib/utils'
import { Routes, SignatureTypes } from '../lib/constants'
import { useApplication } from '../hooks/useUpdateApplication'
import { advert, error, preview, signatures } from '../lib/messages'
import { useType } from '../hooks/useType'
import {
  previewValidationSchema,
  signatureValidationSchema,
} from '../lib/dataSchema'
import { ZodCustomIssue } from 'zod'
import { usePdf } from '../hooks/usePdf'

export const Preview = ({ application, goToScreen }: OJOIFieldBaseProps) => {
  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })

  const { formatMessage: f } = useLocale()

  const { type } = useType({
    typeId: currentApplication.answers.advert?.typeId,
  })

  const {
    fetchPdf,
    error: pdfError,
    loading: pdfLoading,
  } = usePdf({
    applicationId: application.id,
    onComplete: (data) => {
      const blob = base64ToBlob(data.OJOIAGetPdf.pdf)
      const url = URL.createObjectURL(blob)

      let downloadName
      const type = currentApplication.answers.advert?.typeName
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

      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = downloadName
      anchor.click()
      anchor.remove()
    },
  })

  const advertValidationCheck = previewValidationSchema.safeParse(
    currentApplication.answers,
  )

  const signatureValidationCheck = signatureValidationSchema.safeParse({
    signatures: currentApplication.answers.signatures,
    misc: currentApplication.answers.misc,
  })

  const signatureMarkup = getSignaturesMarkup({
    signatures: currentApplication.answers.signatures,
    type: currentApplication.answers.misc?.signatureType as SignatureTypes,
  })

  const advertMarkup = getAdvertMarkup({
    type: type?.title,
    title: currentApplication.answers.advert?.title,
    html: currentApplication.answers.advert?.html,
  })

  const hasMarkup =
    !!currentApplication.answers.advert?.html ||
    type?.title ||
    currentApplication.answers.advert?.title

  const combinedHtml = hasMarkup
    ? (`${advertMarkup}<br />${signatureMarkup}` as HTMLText)
    : (`${signatureMarkup}` as HTMLText)

  return (
    <Stack space={4}>
      <Box>
        <Button
          loading={pdfLoading}
          icon="download"
          iconType="outline"
          variant="utility"
          onClick={() => fetchPdf()}
        >
          {f(preview.buttons.fetchPdf)}
        </Button>
      </Box>
      <Box
        hidden={
          advertValidationCheck.success &&
          signatureValidationCheck.success &&
          !error
        }
      >
        <Stack space={2}>
          {pdfError && (
            <AlertMessage
              type="error"
              title={f(preview.errors.pdfError)}
              message={f(preview.errors.pdfErrorMessage)}
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
        <HTMLEditor
          name="preview.document"
          config={signatureConfig}
          readOnly={true}
          hideWarnings={true}
          value={combinedHtml}
        />
      </Box>
    </Stack>
  )
}
