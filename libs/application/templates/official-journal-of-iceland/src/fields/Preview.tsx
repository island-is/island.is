import { Box, Button } from '@island.is/island-ui/core'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { signatureConfig } from '../components/htmlEditor/config/signatureConfig'
import { advertisementTemplate } from '../components/htmlEditor/templates/content'
import {
  regularSignatureTemplate,
  committeeSignatureTemplate,
} from '../components/htmlEditor/templates/signatures'
import { preview } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { mapIdToType } from '../lib/utils'
import { useLocale } from '@island.is/localization'

export const Preview = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { answers } = props.application
  const { advert, signature } = answers
  return (
    <>
      <Box marginBottom={3} display="flex" columnGap={2}>
        <Button
          onClick={() => console.log('api logic not implemented')}
          variant="utility"
          icon="download"
          iconType="outline"
        >
          {f(preview.buttons.fetchPdf)}
        </Button>
        <Button
          onClick={() => console.log('api logic not implemented')}
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
            category: mapIdToType(advert?.type),
            content: advert?.document,
            title: advert?.title,
            signature:
              signature?.type === 'regular'
                ? regularSignatureTemplate({
                    signatureGroups: signature?.regular,
                    additionalSignature: signature?.additional,
                  })
                : committeeSignatureTemplate({
                    signature: signature?.committee,
                    additionalSignature: signature?.additional,
                  }),
            readonly: true,
          })}
        />
      </Box>
    </>
  )
}
