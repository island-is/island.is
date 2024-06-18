import { Box, Button, SkeletonLoader } from '@island.is/island-ui/core'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { signatureConfig } from '../components/htmlEditor/config/signatureConfig'
import { advertisementTemplate } from '../components/htmlEditor/templates/content'
import {
  regularSignatureTemplate,
  committeeSignatureTemplate,
} from '../components/htmlEditor/templates/signatures'
import { preview } from '../lib/messages'
import {
  OJOIFieldBaseProps,
  OfficialJournalOfIcelandGraphqlResponse,
} from '../lib/types'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { TYPE_QUERY } from '../graphql/queries'

export const Preview = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { answers } = props.application
  const { advert, signature } = answers

  const { data, loading } = useQuery(TYPE_QUERY, {
    variables: {
      params: {
        id: advert?.type,
      },
    },
  })

  const type = data?.officialJournalOfIcelandType?.type?.title

  if (loading) {
    return (
      <SkeletonLoader height={40} space={2} repeat={5} borderRadius="large" />
    )
  }

  return (
    <>
      <Box display="flex" columnGap={2}>
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
            category: type,
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
