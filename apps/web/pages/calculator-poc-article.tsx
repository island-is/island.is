import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import calculatorArticlePocScreen from '@island.is/web/screens/CalculatorPoc/CalculatorArticlePoc'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

// TEMPORARY — see apps/web/screens/CalculatorPoc/CalculatorArticlePoc.tsx.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(calculatorArticlePocScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
