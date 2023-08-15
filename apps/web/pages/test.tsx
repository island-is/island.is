import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
import { withMainLayout } from '../layouts/main'
import { useQuery } from '@apollo/client'
import { GET_HOUSING_BENEFIT_CALCULATION_QUERY } from '../screens/queries/HousingBenefitCalculator'

const Screen = withApollo(
  withLocale('is')(
    withMainLayout(() => {
      const { data, error } = useQuery(GET_HOUSING_BENEFIT_CALCULATION_QUERY, {
        variables: {
          input: {
            totalAssets: 10,
            totalIncome: 10,
            housingCosts: 10,
            numberOfHouseholdMembers: 2,
          },
        },
      })

      return (
        <div>
          <div style={{ color: 'green' }}>{JSON.stringify(data)}</div>
          <div style={{ color: 'red' }}>{JSON.stringify(error)}</div>
        </div>
      )
    }),
  ),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
