import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { HTMLEditor } from '../components/htmlEditor/HTMLEditor'
import { signatureConfig } from '../components/htmlEditor/config/signatureConfig'
import { advertisementTemplate } from '../components/htmlEditor/templates/content'
import { preview } from '../lib/messages'
import {
  OJOIFieldBaseProps,
  OfficialJournalOfIcelandGraphqlResponse,
} from '../lib/types'
import { useLocale } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { PDF_QUERY, PDF_URL_QUERY, TYPE_QUERY } from '../graphql/queries'
import { HTMLText } from '@island.is/regulations-tools/types'
import { getAdvertMarkup, getSignatureMarkup } from '../lib/utils'
import { SignatureType, SignatureTypes } from '../lib/constants'
import { useApplication } from '../hooks/useUpdateApplication'
import { error } from '../lib/messages'

type Entity = {
  id: string
  title: string
  slug: string
}

type TypeResponse = {
  officialJournalOfIcelandType: {
    type: Entity
  }
}

export const Preview = ({ application }: OJOIFieldBaseProps) => {
  const { application: currentApplication } = useApplication({
    applicationId: application.id,
  })

  const { formatMessage: f } = useLocale()

  const {
    data: typeData,
    loading: typeLoading,
    error: typeError,
  } = useQuery<TypeResponse>(TYPE_QUERY, {
    variables: {
      params: {
        id: currentApplication.answers.advert?.typeId,
      },
    },
  })

  if (!currentApplication.answers.advert?.typeId) {
    return (
      <AlertMessage
        type="warning"
        message={f(error.missingType)}
        title={f(error.missingType)}
      />
    )
  }

  if (typeLoading) {
    return (
      <SkeletonLoader height={40} space={2} repeat={5} borderRadius="large" />
    )
  }

  if (typeError) {
    return (
      <AlertMessage
        type="error"
        message={f(error.fetchFailedMessage)}
        title={f(error.fetchFailedTitle)}
      />
    )
  }

  /**
   * TOOD: Fetch S3 URL for PDF if the user requests it
   */

  const signatureMarkup = getSignatureMarkup({
    signatures: currentApplication.answers.signatures,
    type: currentApplication.answers.misc?.signatureType as SignatureTypes,
  })

  const advertMarkup = getAdvertMarkup({
    type: typeData?.officialJournalOfIcelandType.type.title,
    title: currentApplication.answers.advert?.title,
    html: currentApplication.answers.advert?.html,
  })

  const combinedHtml = `${advertMarkup}<br />${signatureMarkup}` as HTMLText

  return (
    <Box border="standard" borderRadius="large">
      <HTMLEditor
        name="preview.document"
        config={signatureConfig}
        readOnly={true}
        hideWarnings={true}
        value={combinedHtml}
      />
    </Box>
  )
}
