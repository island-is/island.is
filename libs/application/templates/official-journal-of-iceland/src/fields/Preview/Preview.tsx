import { Box, Button } from '@island.is/island-ui/core'
import { FormIntro } from '../../components/form/FormIntro'
import { useFormatMessage } from '../../hooks'
import { preview } from '../../lib/messages'
import { OJOIFieldBaseProps } from '../../lib/types'
import { HTMLEditor } from '../../components/htmlEditor/HTMLEditor'
import { advertisementTemplate } from '../../components/htmlEditor/templates/content'
import { signatureConfig } from '../../components/htmlEditor/config/signatureConfig'
import {
  committeeSignatureTemplate,
  regularSignatureTemplate,
} from '../../components/htmlEditor/templates/signatures'
import { mapIdToType } from '../../lib/utils'

export const Preview = ({ application }: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)

  const copyPreviewUrl = () => {
    console.log('replace me with logic')
  }

  const fetchPdf = () => {
    console.log('replace me with logic')
  }

  const { answers } = application

  const { documentContents, title, type: advertType } = answers.advert
  const { type: signatureType } = answers.signature

  return (
    <Box>
      <FormIntro
        title={f(preview.general.formTitle)}
        intro={f(preview.general.formIntro, {
          br: (
            <>
              <br />
              <br />
            </>
          ),
        })}
      />
      <Box marginBottom={3} display="flex" columnGap={2}>
        <Button
          onClick={fetchPdf}
          variant="utility"
          icon="download"
          iconType="outline"
        >
          {f(preview.buttons.fetchPdf)}
        </Button>
        <Button
          onClick={copyPreviewUrl}
          variant="utility"
          icon="link"
          iconType="outline"
        >
          {f(preview.buttons.copyPreviewLink)}
        </Button>
      </Box>
      <Box border="standard" borderRadius="large">
        <HTMLEditor
          name="preview.document"
          config={signatureConfig}
          readOnly={true}
          hideWarnings={true}
          value={advertisementTemplate({
            category: mapIdToType(advertType),
            content: documentContents,
            title: title,
            signature:
              signatureType === 'regular'
                ? regularSignatureTemplate({
                    signatureGroups: answers.signature.regular,
                    additionalSignature: answers.signature.additionalSignature,
                  })
                : committeeSignatureTemplate({
                    signature: answers.signature.committee,
                    additionalSignature: answers.signature.additionalSignature,
                  }),
            readonly: true,
          })}
        />
      </Box>
    </Box>
  )
}

export default Preview
