import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import { Application, SubSection } from '@island.is/application/types'
import {
  getConvoyItem,
  getConvoyItems,
  getConvoyShortName,
  getFreightItem,
  checkIfExemptionTypeLongTerm,
  MAX_CNT_CONVOY,
  MAX_CNT_FREIGHT,
  getFreightPairingErrorMessage,
  formatNumberWithMeters,
  formatNumberWithTons,
  checkHasSelectedConvoyInFreightPairing,
} from '../../../utils'
import { ExemptionFor } from '../../../shared'
import { FreightCommonHiddenInputs } from './freightCommonHiddenInputs'

const FreightPairingSubSection = (freightIndex: number) =>
  buildSubSection({
    id: `freightLongTermPairingSubSection.${freightIndex}`,
    condition: (answers) =>
      checkIfExemptionTypeLongTerm(answers) &&
      !!getFreightItem(answers, freightIndex),
    title: (application) => {
      const freightItem = getFreightItem(application.answers, freightIndex)
      return {
        ...freight.pairing.subSectionTitle,
        values: {
          freightNumber: freightIndex + 1,
          freightName: freightItem?.name,
          length: formatNumberWithMeters(freightItem?.length),
          weight: formatNumberWithTons(freightItem?.weight),
        },
      }
    },
    children: [
      buildMultiField({
        id: `freightLongTermPairingMultiField.${freightIndex}`,
        title: (application) => {
          const freightItem = getFreightItem(application.answers, freightIndex)
          return {
            ...freight.pairing.pageTitle,
            values: {
              freightNumber: freightIndex + 1,
              freightName: freightItem?.name,
              length: formatNumberWithMeters(freightItem?.length),
              weight: formatNumberWithTons(freightItem?.weight),
            },
          }
        },
        description: freight.pairing.description,
        children: [
          ...FreightCommonHiddenInputs(`freightPairing.${freightIndex}`),
          buildHiddenInput({
            id: `freightPairing.${freightIndex}.freightId`,
            defaultValue: (application: Application) =>
              getFreightItem(application.answers, freightIndex)?.freightId,
          }),

          buildDescriptionField({
            id: `freightLongTermPairingDescription.${freightIndex}.subtitle`,
            title: freight.labels.pairingConvoyListSubtitle,
            titleVariant: 'h5',
          }),
          buildSelectField({
            id: `freightPairing.${freightIndex}.convoyIdList`,
            title: freight.labels.pairingConvoyList,
            width: 'full',
            required: true,
            isMulti: true,
            options: (application) => {
              const convoyItems = getConvoyItems(application.answers)
              return convoyItems.map((item, convoyIndex) => ({
                label: {
                  ...freight.labels.pairingConvoyOption,
                  values: {
                    convoyNumber: convoyIndex + 1,
                    vehicleAndTrailerPermno: getConvoyShortName(item),
                  },
                },
                value: item.convoyId,
              }))
            },
          }),
          ...Array(MAX_CNT_CONVOY)
            .fill(null)
            .flatMap((_, convoyIndex) => {
              return [
                buildDescriptionField({
                  id: `freightLongTermPairingDescription.${freightIndex}.${convoyIndex}.subtitle`,
                  condition: (answers) =>
                    checkHasSelectedConvoyInFreightPairing(
                      answers,
                      freightIndex,
                      convoyIndex,
                    ),
                  title: (application) => {
                    const convoyItem = getConvoyItem(
                      application.answers,
                      convoyIndex,
                    )
                    if (!convoyItem) return ''
                    return {
                      ...freight.labels.pairingFreightWithConvoySubtitle,
                      values: {
                        convoyNumber: convoyIndex + 1,
                        vehicleAndTrailerPermno: getConvoyShortName(convoyItem),
                      },
                    }
                  },
                  titleVariant: 'h3',
                }),
                buildHiddenInput({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.convoyId`,
                  condition: (answers) =>
                    checkHasSelectedConvoyInFreightPairing(
                      answers,
                      freightIndex,
                      convoyIndex,
                    ),
                  defaultValue: (application: Application) =>
                    getConvoyItem(application.answers, convoyIndex)?.convoyId,
                }),
                buildTextField({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.height`,
                  condition: (answers) =>
                    checkHasSelectedConvoyInFreightPairing(
                      answers,
                      freightIndex,
                      convoyIndex,
                    ),
                  title: freight.labels.heightWithConvoy,
                  backgroundColor: 'blue',
                  width: 'half',
                  required: true,
                  variant: 'number',
                  suffix: freight.labels.metersSuffix,
                }),
                buildTextField({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.width`,
                  condition: (answers) =>
                    checkHasSelectedConvoyInFreightPairing(
                      answers,
                      freightIndex,
                      convoyIndex,
                    ),
                  title: freight.labels.widthWithConvoy,
                  backgroundColor: 'blue',
                  width: 'half',
                  required: true,
                  variant: 'number',
                  suffix: freight.labels.metersSuffix,
                }),
                buildTextField({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.totalLength`,
                  condition: (answers) =>
                    checkHasSelectedConvoyInFreightPairing(
                      answers,
                      freightIndex,
                      convoyIndex,
                    ),
                  title: freight.labels.totalLengthWithConvoy,
                  backgroundColor: 'blue',
                  width: 'full',
                  required: true,
                  variant: 'number',
                  suffix: freight.labels.metersSuffix,
                }),
                buildAlertMessageField({
                  id: `freightPairing.alertValidation.${freightIndex}`,
                  title: freight.create.errorAlertMessageTitle,
                  message: (application) =>
                    getFreightPairingErrorMessage(
                      application.externalData,
                      application.answers,
                      freightIndex,
                    ) || '',
                  condition: (answers, externalData) =>
                    !!getFreightPairingErrorMessage(
                      externalData,
                      answers,
                      freightIndex,
                    ),
                  doesNotRequireAnswer: true,
                  alertType: 'error',
                  shouldBlockInSetBeforeSubmitCallback: true,
                }),
                buildDescriptionField({
                  id: `freightLongTermPairingDescription.${freightIndex}.${convoyIndex}.exemptionFor`,
                  condition: (answers) =>
                    checkHasSelectedConvoyInFreightPairing(
                      answers,
                      freightIndex,
                      convoyIndex,
                    ),
                  title: freight.labels.exemptionFor,
                  titleVariant: 'h5',
                }),
                buildCheckboxField({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.exemptionFor`,
                  condition: (answers) =>
                    checkHasSelectedConvoyInFreightPairing(
                      answers,
                      freightIndex,
                      convoyIndex,
                    ),
                  large: true,
                  backgroundColor: 'blue',
                  width: 'half',
                  options: [
                    {
                      value: ExemptionFor.WIDTH,
                      label: freight.exemptionFor.widthOptionTitle,
                    },
                    {
                      value: ExemptionFor.HEIGHT,
                      label: freight.exemptionFor.heightOptionTitle,
                    },
                    {
                      value: ExemptionFor.LENGTH,
                      label: freight.exemptionFor.lengthOptionTitle,
                    },
                    {
                      value: ExemptionFor.WEIGHT,
                      label: freight.exemptionFor.weightOptionTitle,
                    },
                  ],
                }),
              ]
            }),
        ],
      }),
    ],
  })

export const FreightLongTermPairingSubSections: SubSection[] = Array(
  MAX_CNT_FREIGHT,
)
  .fill(null)
  .map((_, freightIndex) => FreightPairingSubSection(freightIndex))
