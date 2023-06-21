import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { selectChildren } from '../../../lib/messages'
import { ExternalData } from '../../../types'
import * as kennitala from 'kennitala'

export const PickChildrenSubSection = buildSubSection({
  id: 'pickChildren',
  title: selectChildren.general.subSectionTitle,
  condition: (_, externalData) => {
    const convertedData = (externalData as unknown) as ExternalData
    return convertedData.childrenCustodyInformation?.data
      ? convertedData.childrenCustodyInformation?.data?.length > 0
      : false
  },
  children: [
    buildMultiField({
      id: 'pickChildrenMultiField',
      title: selectChildren.general.pageTitle,
      description: selectChildren.general.description,
      children: [
        buildCustomField(
          {
            id: 'attentionAgeChildren',
            title: selectChildren.warningAgeChildren.title,
            component: 'AlertWithLink',
            condition: (_, externalData) => {
              const convertedData = (externalData as unknown) as ExternalData
              const childrenInAgeRange = convertedData.childrenCustodyInformation?.data.filter(
                (child) => {
                  const childInfo = kennitala.info(child.nationalId)
                  return childInfo.age >= 17
                },
              )
              return childrenInAgeRange ? childrenInAgeRange.length > 0 : false
            },
          },
          {
            title: selectChildren.warningAgeChildren.title,
            message: selectChildren.warningAgeChildren.information,
            linkTitle: selectChildren.warningAgeChildren.linkTitle,
            linkUrl: selectChildren.warningAgeChildren.linkUrl,
          },
        ),
        buildCustomField({
          id: 'selectedChildren',
          title: selectChildren.general.pageTitle,
          component: 'SelectChildren',
        }),
        buildCustomField(
          {
            id: 'generalMessage',
            title: 'Upplýsingar',
            component: 'InformationBoxWithLink',
            condition: (_, externalData) => {
              const convertedData = (externalData as unknown) as ExternalData
              const childrenInAgeRange = convertedData.childrenCustodyInformation?.data.filter(
                (child) => {
                  const childInfo = kennitala.info(child.nationalId)
                  return childInfo.age >= 11 || childInfo.age <= 18
                },
              )
              return childrenInAgeRange ? childrenInAgeRange.length > 0 : false
            },
          },
          {
            title: selectChildren.informationChildrenSection.title,
            message: selectChildren.informationChildrenSection.information,
            linkTitle:
              selectChildren.informationChildrenSection.linkTitle
                .defaultMessage,
            linkUrl: selectChildren.informationChildrenSection.linkUrl,
          },
        ),
      ],
    }),
  ],
})
