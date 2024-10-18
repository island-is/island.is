import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { signatureConfig } from '../components/htmlEditor/config/signatureConfig'
import { OJOIFieldBaseProps } from '../lib/types'
import { useLocale } from '@island.is/localization'
import { HTMLText } from '@island.is/regulations-tools/types'
import { getAdvertMarkup, getSignaturesMarkup } from '../lib/utils'
import { SignatureTypes } from '../lib/constants'
import { useApplication } from '../hooks/useUpdateApplication'
import { advert, error, preview } from '../lib/messages'
import { useType } from '../hooks/useType'

export const Preview = ({ application }: OJOIFieldBaseProps) => {
  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })

  const { formatMessage: f } = useLocale()

  const {
    type,
    loading,
    error: typeError,
  } = useType({
    typeId: currentApplication.answers.advert?.typeId,
  })

  if (loading) {
    return (
      <SkeletonLoader height={40} space={2} repeat={5} borderRadius="large" />
    )
  }

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
      <Stack space={2}>
        {typeError && (
          <AlertMessage
            type="error"
            message={f(error.fetchFailedMessage)}
            title={f(error.fetchFailedTitle)}
          />
        )}
        {!hasMarkup && (
          <AlertMessage
            type="warning"
            title={f(preview.errors.noContent)}
            message={
              <Stack space={1}>
                <Text>{f(error.missingHtmlMessage)}</Text>
                <BulletList space={1} color="black">
                  <Bullet>{f(advert.inputs.department.label)}</Bullet>
                  <Bullet>{f(advert.inputs.type.label)}</Bullet>
                  <Bullet>{f(advert.inputs.title.label)}</Bullet>
                  <Bullet>{f(advert.inputs.editor.label)}</Bullet>
                </BulletList>
              </Stack>
            }
          />
        )}
      </Stack>
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
