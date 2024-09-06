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
import { PDF_QUERY, PDF_URL_QUERY, TYPE_QUERY } from '../graphql/queries'

export const Preview = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { answers, id } = props.application
  const { advert, signature } = answers

  const { data, loading } = useQuery(TYPE_QUERY, {
    variables: {
      params: {
        id: advert?.type,
      },
    },
  })

  const type = data?.officialJournalOfIcelandType?.type?.title

  const { data: pdfUrlData } = useQuery(PDF_URL_QUERY, {
    variables: {
      id: id,
    },
  })

  const { data: pdfData } = useQuery(PDF_QUERY, {
    variables: {
      id: id,
    },
  })

  if (loading) {
    return (
      <SkeletonLoader height={40} space={2} repeat={5} borderRadius="large" />
    )
  }

  const onCopyPreviewLink = () => {
    if (!pdfData) {
      return
    }

    const url = pdfData.officialJournalOfIcelandApplicationGetPdfUrl.url

    navigator.clipboard.writeText(url)
  }

  const onOpenPdfPreview = () => {
    if (!pdfData) {
      return
    }

    window.open(
      `data:application/pdf,${pdfData.officialJournalOfIcelandApplicationGetPdf.pdf}`,
      '_blank',
    )
  }

  return (
    <>
      <Box display="flex" columnGap={2}>
        {!!pdfUrlData && (
          <Button
            onClick={onOpenPdfPreview}
            variant="utility"
            icon="download"
            iconType="outline"
          >
            {f(preview.buttons.fetchPdf)}
          </Button>
        )}
        {!!pdfData && (
          <Button
            onClick={onCopyPreviewLink}
            variant="utility"
            icon="link"
            iconType="outline"
          >
            {f(preview.buttons.copyPreviewLink)}
          </Button>
        )}
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
