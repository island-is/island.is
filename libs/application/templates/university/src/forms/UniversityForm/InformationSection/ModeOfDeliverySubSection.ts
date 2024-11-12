import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
  getValueViaPath,
  buildSelectField,
  buildCustomField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { FormValue } from '@island.is/application/types'
import { Program } from '@island.is/clients/university-gateway-api'
import { FieldType, ModeOfDelivery } from '@island.is/university-gateway'

export const ModeOfDeliverySubSection = buildSubSection({
  id: Routes.MODEOFDELIVERYINFORMATION,
  title: information.labels.modeOfDeliverySection.sectionTitle,
  condition: (answers: FormValue, externalData) => {
    const programAnswer = getValueViaPath(
      answers,
      `${Routes.PROGRAMINFORMATION}.program`,
    ) as string | undefined

    const programList = getValueViaPath(
      externalData,
      'programs.data',
    ) as Array<Program>

    if (!programAnswer) {
      return false
    }

    const programItem = programList.find(
      (program) => program.id === programAnswer,
    )
    return !!programItem && programItem.modeOfDelivery.length > 1
  },
  children: [
    buildMultiField({
      id: `${Routes.MODEOFDELIVERYINFORMATION}MultiField`,
      title: information.labels.modeOfDeliverySection.title,
      description: information.labels.modeOfDeliverySection.subTitle,

      children: [
        buildRadioField({
          id: `${Routes.MODEOFDELIVERYINFORMATION}.chosenMode`,
          title: '',
          condition: (answers: FormValue, externalData) => {
            const programAnswer = getValueViaPath(
              answers,
              `${Routes.PROGRAMINFORMATION}.program`,
            ) as string | undefined

            const programList = getValueViaPath(
              externalData,
              'programs.data',
            ) as Array<Program>

            if (!programAnswer) {
              return false
            }

            const modeOfDeliveryObject = programList.filter(
              (program) => program.id === programAnswer,
            )[0].modeOfDelivery
            return modeOfDeliveryObject && modeOfDeliveryObject.length > 0
          },
          options: (application, field) => {
            const programAnswer = getValueViaPath(
              application.answers,
              `${Routes.PROGRAMINFORMATION}.program`,
            ) as string | undefined
            const programList = getValueViaPath(
              application.externalData,
              'programs.data',
            ) as Array<Program>

            if (!programAnswer) {
              return []
            }

            return programList
              .filter((program) => program.id === programAnswer)[0]
              .modeOfDelivery.map((deliveryMethod) => {
                let extraParam
                switch (deliveryMethod.modeOfDelivery) {
                  case 'ON_SITE':
                    extraParam =
                      information.labels.modeOfDeliverySection.ON_SITE_EXTRA

                    break
                  case 'ONLINE':
                    extraParam =
                      information.labels.modeOfDeliverySection.ONLINE_EXTRA

                    break
                  case 'MIXED':
                    extraParam =
                      information.labels.modeOfDeliverySection.MIXED_EXTRA

                    break
                  case 'REMOTE':
                    extraParam =
                      information.labels.modeOfDeliverySection.REMOTE_EXTRA

                    break
                  default:
                    extraParam = ''
                    break
                }
                return {
                  label:
                    information.labels.modeOfDeliverySection[
                      deliveryMethod.modeOfDelivery
                    ],

                  value: deliveryMethod.modeOfDelivery,
                  subLabel: extraParam,
                }
              })
          },
        }),
        buildCustomField({
          id: `${Routes.MODEOFDELIVERYINFORMATION}.chosenModeHiddenValidation`,
          title: '',
          component: 'HiddenValidation',
        }),
        buildSelectField({
          id: `${Routes.MODEOFDELIVERYINFORMATION}.location`,
          title: '',
          condition: (answers: FormValue, externalData) => {
            const programAnswer = getValueViaPath(
              answers,
              `${Routes.PROGRAMINFORMATION}.program`,
            ) as string | undefined

            const modeOfDeliveryAnswer = getValueViaPath(
              answers,
              `${Routes.MODEOFDELIVERYINFORMATION}.chosenMode`,
            ) as string | undefined

            const programList = getValueViaPath(
              externalData,
              'programs.data',
            ) as Array<Program>

            if (
              !modeOfDeliveryAnswer ||
              modeOfDeliveryAnswer !== ModeOfDelivery.REMOTE
            ) {
              return false
            }

            const extraApplicationFields = programList.filter(
              (program) => program.id === programAnswer,
            )[0].extraApplicationFields
            const hasMustPickExamVenue =
              extraApplicationFields.filter(
                (x) =>
                  (x.fieldType as unknown as FieldType) ===
                  FieldType.TESTING_SITE,
              ).length > 0
            return hasMustPickExamVenue
          },
          options: (application, field) => {
            const programAnswer = getValueViaPath(
              application.answers,
              `${Routes.PROGRAMINFORMATION}.program`,
            ) as string | undefined
            const programList = getValueViaPath(
              application.externalData,
              'programs.data',
            ) as Array<Program>

            if (!programAnswer) {
              return []
            }

            const extraApplicationFields = programList.filter(
              (program) => program.id === programAnswer,
            )[0].extraApplicationFields

            const optionsString = extraApplicationFields.filter(
              (field) =>
                (field.fieldType as unknown as FieldType) ===
                FieldType.TESTING_SITE,
            )[0].options

            const options =
              optionsString && (JSON.parse(optionsString) as Array<any>)

            return options && options.length > 0
              ? options.map((location) => {
                  return {
                    label: location.heiti,
                    value: location.id,
                  }
                })
              : []
          },
        }),
      ],
    }),
  ],
})
