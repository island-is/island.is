import SecondarySchoolStudyDetails from '@island.is/web/screens/SecondarySchoolStudies/SecondarySchoolStudyDetails'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

import withApollo from '../../../../graphql/withApollo'
import { withLocale } from '../../../../i18n'

const Screen = withApollo(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  withLocale('en')(SecondarySchoolStudyDetails),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
