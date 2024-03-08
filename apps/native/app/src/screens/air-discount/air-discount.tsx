import { Text, View } from "react-native"
import { NavigationFunctionComponent } from "react-native-navigation"
import { AirDiscountSchemeDiscount, useAirDiscountFlightLegsQueryQuery, useAirDiscountQueryQuery, useListAssetsQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'


const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'airDiscount.screenTitle' }),
      },
    },
  }))

export const AirDiscountScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

const {data, loading, error } = useAirDiscountQueryQuery({
  fetchPolicy: 'cache-first',
})

const {data: flightLegData, loading: flightLegLoading, error: flightLegError} = useAirDiscountFlightLegsQueryQuery({
  fetchPolicy: 'cache-first',
})

const airDiscounts: AirDiscountSchemeDiscount[] | undefined =
data?.airDiscountSchemeDiscounts

const flightLegs = flightLegData?.airDiscountSchemeUserAndRelationsFlights

const connectionCodes: AirDiscountSchemeDiscount[] | undefined =
    airDiscounts?.filter((x) => x.connectionDiscountCodes.length > 0)

console.log(airDiscounts, 'airDiscounts')
console.log(flightLegs, 
  'flightLegs')
console.log(connectionCodes, 'connectionCodes')
  return (
    <View>
      <Text>Discount</Text>

      {airDiscounts?.map((discount) => (
        <Text key={discount?.discountCode}>{discount?.discountCode}</Text>
      ))}
    </View>
  )
}

AirDiscountScreen.options = getNavigationOptions