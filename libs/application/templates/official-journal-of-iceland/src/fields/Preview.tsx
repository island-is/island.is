import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { signatureConfig } from '../components/htmlEditor/config/signatureConfig'
import { OJOIFieldBaseProps } from '../lib/types'
import { useLocale } from '@island.is/localization'
import { HTMLText } from '@island.is/regulations-tools/types'
import {
  getAdvertMarkup,
  getSignaturesMarkup,
  parseZodIssue,
} from '../lib/utils'
import { Routes, SignatureTypes } from '../lib/constants'
import { useApplication } from '../hooks/useUpdateApplication'
import { advert, error, preview, signatures } from '../lib/messages'
import { useType } from '../hooks/useType'
import {
  advertValidationSchema,
  previewValidationSchema,
  signatureValidationSchema,
} from '../lib/dataSchema'
import { ZodCustomIssue } from 'zod'

export const Preview = ({ application, goToScreen }: OJOIFieldBaseProps) => {
  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })

  const { formatMessage: f } = useLocale()

  const { type, loading } = useType({
    typeId: currentApplication.answers.advert?.typeId,
  })

  if (loading) {
    return (
      <SkeletonLoader height={40} space={2} repeat={5} borderRadius="large" />
    )
  }

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
      <Box
        hidden={
          advertValidationCheck.success && signatureValidationCheck.success
        }
      >
        <Stack space={2}>
          {!advertValidationCheck.success && (
            <AlertMessage
              type="warning"
              title={f(preview.errors.noContent)}
              message={
                <Stack space={2}>
                  <Text>{f(preview.errors.noContentMessage)}</Text>
                  <BulletList color="black">
                    {advertValidationCheck.error.issues.map((issue) => {
                      const parsedIssue = parseZodIssue(issue as ZodCustomIssue)
                      return (
                        <Bullet key={issue.path.join('.')}>
                          {f(parsedIssue.message)}
                        </Bullet>
                      )
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
                      x: <strong>Grunnupplýsinga</strong>,
                    })}
                  </Text>
                  <BulletList color="black">
                    {signatureValidationCheck.error.issues.map((issue) => {
                      const parsedIssue = parseZodIssue(issue as ZodCustomIssue)
                      return (
                        <Bullet key={issue.path.join('.')}>
                          {f(parsedIssue.message)}
                        </Bullet>
                      )
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
