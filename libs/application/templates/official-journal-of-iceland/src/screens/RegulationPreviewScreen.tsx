import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ZodCustomIssue } from 'zod'
import { FormScreen } from '../components/form/FormScreen'
import { AdvertPreview } from '../components/advertPreview/AdvertPreview'
import { useApplication } from '../hooks/useUpdateApplication'
import { useRegulationDraft } from '../hooks/useRegulationDraft'
import { useSignatures } from '../hooks/useSignatures'
import {
  regulationContentValidationSchema,
  signatureValidator,
} from '../lib/dataSchema'
import { Routes } from '../lib/constants'
import { regulation, error } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { parseZodIssue } from '../lib/utils'

export const RegulationPreviewScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application } = props

  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })

  const { saveDraft, draftId } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  const handleNavigate = async (screenId?: string) => {
    if (draftId) {
      await saveDraft()
    }
    props.goToScreen?.(screenId ?? '')
  }

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

  const contentValidation = regulationContentValidationSchema.safeParse(
    currentApplication.answers,
  )

  const signatureValidation = signatureValidator(
    application.answers.misc?.signatureType ?? 'regular',
  ).safeParse(currentApplication.answers.signature)

  const hasError = !contentValidation.success || !signatureValidation.success

  return (
    <FormScreen
      goToScreen={handleNavigate}
      title={f(regulation.preview.general.title)}
      intro={f(regulation.preview.general.intro)}
    >
      <Stack space={4}>
        <Box hidden={!hasError}>
          <Stack space={2}>
            {!contentValidation.success && (
              <AlertMessage
                type="warning"
                title={f(regulation.preview.errors.noContent)}
                message={
                  <Stack space={2}>
                    <Text>
                      {f(regulation.preview.errors.noContentMessage)}
                    </Text>
                    <BulletList color="black">
                      {contentValidation.error.issues.map((issue, i) => {
                        const parsedIssue = parseZodIssue(
                          issue as ZodCustomIssue,
                        )
                        return <Bullet key={i}>{f(parsedIssue.message)}</Bullet>
                      })}
                    </BulletList>
                    <Button
                      onClick={() =>
                        handleNavigate(Routes.REGULATION_CONTENT)
                      }
                      size="small"
                      variant="text"
                      preTextIcon="arrowBack"
                    >
                      {`Opna kafla ${f(regulation.content.general.section)}`}
                    </Button>
                  </Stack>
                }
              />
            )}
            {!signatureValidation.success && (
              <AlertMessage
                type="warning"
                title={f(error.missingFieldsTitle, { x: 'Undirritun' })}
                message={
                  <Stack space={2}>
                    <BulletList color="black">
                      {signatureValidation.error.issues.map((issue, i) => {
                        const parsedIssue = parseZodIssue(
                          issue as ZodCustomIssue,
                        )
                        return <Bullet key={i}>{f(parsedIssue.message)}</Bullet>
                      })}
                    </BulletList>
                    <Button
                      onClick={() =>
                        handleNavigate(Routes.REGULATION_CONTENT)
                      }
                      size="small"
                      variant="text"
                      preTextIcon="arrowBack"
                    >
                      {`Opna kafla ${f(regulation.content.general.section)}`}
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
    </FormScreen>
  )
}

export default RegulationPreviewScreen
