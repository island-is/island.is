import {
  buildMultiField,
  buildSubSection,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { FormValue } from '@island.is/application/types'
import { Program } from '@island.is/clients/university-gateway-api'

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
                console.log(
                  'deliveryMethod.modeOfDelivery',
                  deliveryMethod.modeOfDelivery,
                )
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
      ],
    }),
  ],
})
