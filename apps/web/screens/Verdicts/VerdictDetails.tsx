import type { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Breadcrumbs,
  GridContainer,
  PdfViewer,
} from '@island.is/island-ui/core'
import type {
  GetVerdictByIdQuery,
  GetVerdictByIdQueryVariables,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { GET_VERDICT_BY_ID_QUERY } from '../queries/Verdicts'

interface VerdictDetailsProps {
  item: GetVerdictByIdQuery['webVerdictById']['item']
}

const VerdictDetails: Screen<VerdictDetailsProps> = ({ item }) => {
  return (
    <Box paddingBottom={5}>
      <GridContainer>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: '/' },
            { title: 'Dómar', href: '/domar' },
          ]}
        />
        {Boolean(item.pdfString) && (
          <Box display="flex" justifyContent="center">
            <PdfViewer
              file={`data:application/pdf;base64,${item.pdfString}`}
              showAllPages={true}
              scale={1.4}
            />
          </Box>
        )}
        {Boolean(item.richText) && (
          <Box>{webRichText([item.richText] as SliceType[])}</Box>
        )}
      </GridContainer>
    </Box>
  )
}

VerdictDetails.getProps = async ({ apolloClient, query }) => {
  const verdictResponse = await apolloClient.query<
    GetVerdictByIdQuery,
    GetVerdictByIdQueryVariables
  >({
    query: GET_VERDICT_BY_ID_QUERY,
    variables: {
      input: {
        id: query.id as string,
      },
    },
  })

  const item = verdictResponse?.data?.webVerdictById?.item

  if (!item || (!item?.pdfString && !item?.richText)) {
    throw new CustomNextError(
      404,
      `Verdict with id: ${query.id} could not be found`,
    )
  }

  return {
    item,
  }
}

export default withMainLayout(VerdictDetails)
