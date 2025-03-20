import { parseAsString } from 'next-usequerystate'

import { CustomPageUniqueIdentifier } from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'

const OJOIMissingRecordIdPage: CustomScreen<{}> = () => {
  return <div></div>
}

const idParser = parseAsString

OJOIMissingRecordIdPage.getProps = async ({ query }) => {
  const recordId = idParser.parseServerSide(query.recordId)
  const recordIdCapitalized = idParser.parseServerSide(query.RecordId)

  const idToUse = recordIdCapitalized || recordId

  if (!idToUse) {
    throw new CustomNextError(404, 'Advert not found')
  }

  const redirectUrl = '/stjornartidindi/nr/' + idToUse

  return {
    redirect: {
      permanent: true,
      destination: redirectUrl,
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OfficialJournalOfIceland,
    OJOIMissingRecordIdPage,
  ),
)
