import { CustomPageUniqueIdentifier } from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { withCustomPageWrapper } from '../CustomPage/CustomPageWrapper'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SecondarySchoolStudiesDetailsProps {}

const SecondarySchoolStudiesDetails: Screen<
  SecondarySchoolStudiesDetailsProps
> = () => {
  return null
}
SecondarySchoolStudiesDetails.getProps = async ({ apolloClient, locale }) => {
  return {}
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.SecondarySchoolStudies,
    SecondarySchoolStudiesDetails,
  ),
  {
    footerVersion: 'organization',
  },
)
