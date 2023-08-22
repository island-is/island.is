import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { IcelandicGovernmentInstitutionVacanciesList } from '@island.is/web/screens/IcelandicGovernmentInstitutionVacancies'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(
  withLocale('is')(IcelandicGovernmentInstitutionVacanciesList),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
