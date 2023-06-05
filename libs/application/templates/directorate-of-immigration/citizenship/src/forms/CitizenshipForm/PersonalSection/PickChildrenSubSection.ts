import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
} from '@island.is/application/core'
import { personal, selectChildren } from '../../../lib/messages'
import { ExternalData } from '../../../types'
import * as kennitala from 'kennitala'

export const PickChildrenSubSection = buildSubSection({
  id: 'pickChildren',
  title: personal.labels.pickChildren.subSectionTitle,
  condition: (_, externalData) => {
    const convertedData = (externalData as unknown) as ExternalData
    return convertedData.childrenCustodyInformation?.data?.length > 0
  },
  children: [
    buildMultiField({
      id: 'pickChildrenMultiField',
      title: personal.labels.pickChildren.pageTitle.defaultMessage,
      description: personal.labels.pickChildren.description.defaultMessage,
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
              return childrenInAgeRange.length > 0
            },
          },
          {
            title: selectChildren.warningAgeChildren.title.defaultMessage,
            message:
              selectChildren.warningAgeChildren.information.defaultMessage,
            linkTitle:
              selectChildren.warningAgeChildren.linkTitle.defaultMessage,
            linkUrl: selectChildren.warningAgeChildren.linkUrl.defaultMessage,
          },
        ),
        buildCustomField({
          id: 'selectedChildren',
          title: personal.labels.pickChildren.pageTitle,
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
              return childrenInAgeRange.length > 0
            },
          },
          {
            title:
              selectChildren.informationChildrenSection.title.defaultMessage,
            message: selectChildren.informationChildrenSection.information,
            linkTitle:
              selectChildren.informationChildrenSection.linkTitle
                .defaultMessage,
            linkUrl:
              selectChildren.informationChildrenSection.linkUrl.defaultMessage,
          },
        ),
      ],
    }),
  ],
})
