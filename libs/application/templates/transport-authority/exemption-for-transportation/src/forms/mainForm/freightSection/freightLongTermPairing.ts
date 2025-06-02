import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import { Application, SubSection } from '@island.is/application/types'
import {
  getConvoyItem,
  getConvoyItems,
  getConvoyShortName,
  getExemptionRules,
  getFreightItem,
  getFreightPairingItems,
  isConvoySelected,
  isExemptionTypeLongTerm,
  MAX_CNT_CONVOY,
  MAX_CNT_FREIGHT,
} from '../../../utils'
import { ExemptionFor } from '../../../shared'
import { FreightCommonHiddenInputs } from './freightCommonHiddenInputs'

const FreightPairingSubSection = (freightIndex: number) =>
  buildSubSection({
    id: `freightLongTermPairingSubSection.${freightIndex}`,
    condition: (answers) => {
      return (
        isExemptionTypeLongTerm(answers) &&
        !!getFreightItem(answers, freightIndex)
      )
    },
    title: (application) => {
      const freightItem = getFreightItem(application.answers, freightIndex)
      return {
        ...freight.pairing.subSectionTitle,
        values: {
          freightNumber: freightIndex + 1,
          freightName: freightItem?.name,
          length: freightItem?.length,
          weight: freightItem?.weight,
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
              length: freightItem?.length,
              weight: freightItem?.weight,
            },
          }
        },
        description: freight.pairing.description,
        children: [
          ...FreightCommonHiddenInputs(`freightPairing.${freightIndex}`),
          buildDescriptionField({
            id: `freightLongTermPairingDescription.${freightIndex}.subtitle`,
            title: freight.labels.pairingConvoyListSubtitle,
            titleVariant: 'h5',
          }),
          buildHiddenInput({
            id: `freightPairing.${freightIndex}.freightId`,
            defaultValue: (application: Application) => {
              const freightItem = getFreightItem(
                application.answers,
                freightIndex,
              )
              return freightItem?.freightId
            },
          }),
          buildSelectField({
            id: `freightPairing.${freightIndex}.convoyIdList`,
            title: freight.labels.pairingConvoyList,
            width: 'full',
            required: true,
            isMulti: true,
            options: (application) => {
              const convoyItems = getConvoyItems(application.answers)
              return convoyItems.map((item, freightIndex) => ({
                label: {
                  ...freight.labels.pairingConvoyOption,
                  values: {
                    convoyNumber: freightIndex + 1,
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
                  condition: (answers) => {
                    const convoyItem = getConvoyItem(answers, convoyIndex)
                    return (
                      !!convoyItem &&
                      isConvoySelected(
                        answers,
                        freightIndex,
                        convoyItem.convoyId,
                      )
                    )
                  },
                  title: (application) => {
                    const convoyItem = getConvoyItem(
                      application.answers,
                      convoyIndex,
                    )
                    if (!convoyItem) return ''
                    return {
                      ...freight.labels.pairingFreightWithConvoySubtitle,
                      values: {
                        convoyNumber: freightIndex + 1,
                        vehicleAndTrailerPermno: getConvoyShortName(convoyItem),
                      },
                    }
                  },
                  titleVariant: 'h3',
                }),
                buildHiddenInput({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.convoyId`,
                  condition: (answers) => {
                    const convoyItem = getConvoyItem(answers, convoyIndex)
                    return (
                      !!convoyItem &&
                      isConvoySelected(
                        answers,
                        freightIndex,
                        convoyItem.convoyId,
                      )
                    )
                  },
                  defaultValue: (application: Application) => {
                    const convoyItem = getConvoyItem(
                      application.answers,
                      convoyIndex,
                    )
                    return convoyItem?.convoyId
                  },
                }),
                buildTextField({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.height`,
                  condition: (answers) => {
                    const convoyItem = getConvoyItem(answers, convoyIndex)
                    return (
                      !!convoyItem &&
                      isConvoySelected(
                        answers,
                        freightIndex,
                        convoyItem.convoyId,
                      )
                    )
                  },
                  title: freight.labels.heightWithConvoy,
                  backgroundColor: 'blue',
                  width: 'half',
                  variant: 'number',
                  required: true,
                  suffix: freight.labels.metersSuffix,
                }),
                buildTextField({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.width`,
                  condition: (answers) => {
                    const convoyItem = getConvoyItem(answers, convoyIndex)
                    return (
                      !!convoyItem &&
                      isConvoySelected(
                        answers,
                        freightIndex,
                        convoyItem.convoyId,
                      )
                    )
                  },
                  title: freight.labels.widthWithConvoy,
                  backgroundColor: 'blue',
                  width: 'half',
                  variant: 'number',
                  required: true,
                  suffix: freight.labels.metersSuffix,
                }),
                buildTextField({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.totalLength`,
                  condition: (answers) => {
                    const convoyItem = getConvoyItem(answers, convoyIndex)
                    return (
                      !!convoyItem &&
                      isConvoySelected(
                        answers,
                        freightIndex,
                        convoyItem.convoyId,
                      )
                    )
                  },
                  title: freight.labels.totalLengthWithConvoy,
                  backgroundColor: 'blue',
                  width: 'full',
                  variant: 'number',
                  required: true,
                  suffix: freight.labels.metersSuffix,
                }),
                buildAlertMessageField({
                  id: 'freightPairing.alertValidation',
                  title: freight.create.errorAlertMessageTitle,
                  message: (application) => {
                    // Empty list error
                    const convoyIdList = getValueViaPath<string[]>(
                      application.answers,
                      `freightPairing.${freightIndex}.convoyIdList`,
                    )
                    const showEmptyListError = !convoyIdList?.length

                    // Police escort error
                    const freightPairingItems = getFreightPairingItems(
                      application.answers,
                      freightIndex,
                    )
                    const rules = getExemptionRules(application.externalData)
                    const maxHeight = rules?.policeEscort.maxHeight
                    const maxWidth = rules?.policeEscort.maxWidth
                    const invalidConvoyIndex = freightPairingItems
                      ? freightPairingItems.findIndex(
                          (x) =>
                            (x?.height &&
                              maxHeight &&
                              Number(x.height) > maxHeight) ||
                            (x?.width &&
                              maxWidth &&
                              Number(x.width) > maxWidth),
                        )
                      : -1
                    const convoyItem =
                      invalidConvoyIndex !== -1
                        ? getConvoyItem(application.answers, invalidConvoyIndex)
                        : undefined
                    const showPoliceEscortError = !!convoyItem

                    if (showEmptyListError)
                      return freight.pairing.errorEmptyListAlertMessage
                    else if (showPoliceEscortError) {
                      return {
                        ...freight.pairing.errorPoliceEscortAlertMessage,
                        values: {
                          maxHeight,
                          maxWidth,
                          convoyNumber: invalidConvoyIndex + 1,
                          vehicleAndTrailerPermno:
                            getConvoyShortName(convoyItem),
                        },
                      }
                    }
                  },
                  doesNotRequireAnswer: true,
                  alertType: 'error',
                  condition: (answers, externalData) => {
                    // Empty list error
                    const convoyIdList = getValueViaPath<string[]>(
                      answers,
                      `freightPairing.${freightIndex}.convoyIdList`,
                    )
                    const showEmptyListError = !convoyIdList?.length

                    // Police escort error
                    const freightPairingItems = getFreightPairingItems(
                      answers,
                      freightIndex,
                    )
                    const rules = getExemptionRules(externalData)
                    const maxHeight = rules?.policeEscort.maxHeight
                    const maxWidth = rules?.policeEscort.maxWidth
                    const invalidConvoyIndex = freightPairingItems
                      ? freightPairingItems.findIndex(
                          (x) =>
                            (x?.height &&
                              maxHeight &&
                              Number(x.height) > maxHeight) ||
                            (x?.width &&
                              maxWidth &&
                              Number(x.width) > maxWidth),
                        )
                      : -1
                    const convoyItem =
                      invalidConvoyIndex !== -1
                        ? getConvoyItem(answers, invalidConvoyIndex)
                        : undefined
                    const showPoliceEscortError = !!convoyItem

                    return showEmptyListError || showPoliceEscortError
                  },
                  shouldBlockInSetBeforeSubmitCallback: true,
                }),
                buildDescriptionField({
                  id: `freightLongTermPairingDescription.${freightIndex}.${convoyIndex}.exemptionFor`,
                  condition: (answers) => {
                    const convoyItem = getConvoyItem(answers, convoyIndex)
                    return (
                      !!convoyItem &&
                      isConvoySelected(
                        answers,
                        freightIndex,
                        convoyItem.convoyId,
                      )
                    )
                  },
                  title: freight.labels.exemptionFor,
                  titleVariant: 'h5',
                }),
                buildCheckboxField({
                  id: `freightPairing.${freightIndex}.items.${convoyIndex}.exemptionFor`,
                  condition: (answers) => {
                    const convoyItem = getConvoyItem(answers, convoyIndex)
                    return (
                      !!convoyItem &&
                      isConvoySelected(
                        answers,
                        freightIndex,
                        convoyItem.convoyId,
                      )
                    )
                  },
                  large: true,
                  backgroundColor: 'blue',
                  split: '1/2',
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
