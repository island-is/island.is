import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import calculatorPocScreen from '@island.is/web/screens/CalculatorPoc/CalculatorPoc'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

// TEMPORARY — see apps/web/screens/CalculatorPoc/CalculatorPoc.tsx.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(calculatorPocScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
