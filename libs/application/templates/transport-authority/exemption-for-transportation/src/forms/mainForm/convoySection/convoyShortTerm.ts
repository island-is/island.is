import {
  buildAsyncVehicleTextField,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import { convoy } from '../../../lib/messages'
import { isExemptionTypeShortTerm } from '../../../utils'

export const ConvoyShortTermMultiField = buildMultiField({
  id: 'convoyShortTermMultiField',
  condition: (answers) => {
    return isExemptionTypeShortTerm(answers)
  },
  title: convoy.general.pageTitle,
  description: convoy.general.description,
  children: [
    // buildTextField({
    //   id: 'convoy.items[0].vehicle.permno',
    //   title: convoy.labels.vehiclePermno,
    //   backgroundColor: 'blue',
    //   width: 'half',
    //   required: true,
    //   maxLength: 5,
    // }),
    // buildTextField({
    //   id: 'convoy.items[0].vehicle.makeAndColor',
    //   title: convoy.labels.vehicleMakeAndColor,
    //   backgroundColor: 'white',
    //   width: 'half',
    //   readOnly: true,
    // }),
    // buildTextField({
    //   id: 'convoy.items[0].trailer.permno',
    //   title: convoy.labels.trailerPermno,
    //   backgroundColor: 'blue',
    //   width: 'half',
    //   maxLength: 5,
    // }),
    // buildTextField({
    //   id: 'convoy.items[0].trailer.makeAndColor',
    //   title: convoy.labels.trailerMakeAndColor,
    //   backgroundColor: 'white',
    //   width: 'half',
    //   readOnly: true,
    // }),
    buildAsyncVehicleTextField({
      id: 'convoy.items[0].vehicle',
      title: convoy.labels.vehiclePermno,
      width: 'full',
      required: true,
      loadValidation: async ({ apolloClient, permno }) => {
        console.log('GETTING DETAILS!', permno)

        //TODOx finish graphql
        // const { data } = await apolloClient.query<FriggSchoolsByMunicipality>({
        //   query: friggSchoolsByMunicipalityQuery,
        // })

        return { errorMessages: ['Ökutæki ekki í lagi fyrir umferð'] }
      },
      permnoLabel: convoy.labels.vehiclePermno,
      makeAndColorLabel: convoy.labels.vehicleMakeAndColor,
      errorTitle: convoy.error.alertTitle,
      fallbackErrorMessage: convoy.error.fallbackErrorMessage,
    }),
  ],
})
