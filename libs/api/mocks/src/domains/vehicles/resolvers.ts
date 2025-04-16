import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    vehiclesListV2: () => {
      return { vehicleList: store.getVehicleList }
    },
    vehiclesDetail: (_, { input }) => {
      const match = store.vehicleDetails.find(
        (item) => item?.basicInfo?.permno === input.permno,
      )
      return match || null
    },
    vehicleMileageDetails: (_, { input }) => {
      const match = store.vehicleMileageDetails.find(
        (item) => item?.permno === input.permno,
      )
      return match || null
    },
  },
}
