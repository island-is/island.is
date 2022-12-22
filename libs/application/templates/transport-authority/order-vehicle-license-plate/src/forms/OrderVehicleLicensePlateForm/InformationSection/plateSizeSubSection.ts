import { Application } from '@island.is/api/schema'
import { VehiclesCurrentVehicle, PlateType } from '../../../types'
import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { getSelectedVehicle } from '../../../utils'
import { formatMessage } from '@formatjs/intl'
import { useLocale } from '@island.is/localization'

export const plateSizeSubSection = buildSubSection({
  id: 'plateSize',
  title: information.labels.plateSize.sectionTitle,
  children: [
    buildMultiField({
      id: 'plateSizeMultiField',
      title: information.labels.plateSize.title,
      description: information.general.description,
      children: [
        buildDescriptionField({
          id: 'plateSize.vehicleSubtitle',
          title: information.labels.plateSize.vehicleSubTitle,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'plateSize.vehiclePlate',
          title: information.labels.plateSize.vehiclePlate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle
            return vehicle?.permno
          },
        }),
        buildTextField({
          id: 'plateSize.vehicleType',
          title: information.labels.plateSize.vehicleType,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicle = getSelectedVehicle(
              application.externalData,
              application.answers,
            ) as VehiclesCurrentVehicle
            return vehicle?.make
          },
        }),
        buildDescriptionField({
          id: 'plateSize.frontPlateSize.subtitle',
          title: information.labels.plateSize.frontPlateSubtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          title: '',
          id: 'plateSize.frontPlateSize',
          options: (application) => {
            const { formatMessage } = useLocale()

            const plateTypeList = application.externalData.plateTypeList
              .data as PlateType[]

            const currentPlateType = getValueViaPath(
              application.answers,
              'pickVehicle.plateTypeFront',
              '',
            ) as string

            return plateTypeList
              .filter((x) => x.code === currentPlateType)
              ?.map((x) => ({
                value: x.code || '',
                label:
                  formatMessage(
                    information.labels.plateSize.plateSizeOptionTitle,
                    {
                      name: x.name,
                      height: x.plateHeight,
                      width: x.plateWidth,
                    },
                  ) || '',
              }))
          },
          width: 'half',
          largeButtons: true,
        }),
        buildDescriptionField({
          id: 'plateSize.rearPlateSize.subtitle',
          title: information.labels.plateSize.rearPlateSubtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          title: '',
          id: 'plateSize.rearPlateSize',
          options: (application) => {
            const { formatMessage } = useLocale()

            const plateTypeList = application.externalData.plateTypeList
              .data as PlateType[]

            const currentPlateType = getValueViaPath(
              application.answers,
              'pickVehicle.plateTypeRear',
              '',
            ) as string

            return plateTypeList
              .filter((x) => x.code === currentPlateType)
              ?.map((x) => ({
                value: x.code || '',
                label: formatMessage(
                  information.labels.plateSize.plateSizeOptionTitle,
                  {
                    name: x.name,
                    height: x.plateHeight,
                    width: x.plateWidth,
                  },
                ),
              }))
          },
          width: 'half',
          largeButtons: true,
        }),
      ],
    }),
  ],
})
