import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  getValueViaPath,
} from '@island.is/application/core'
import { selectChildren } from '../../../lib/messages'
import * as kennitala from 'kennitala'
import { ApplicantChildCustodyInformation } from '@island.is/application/types'

export const PickChildrenSubSection = buildSubSection({
  id: 'pickChildren',
  title: selectChildren.general.subSectionTitle,
  condition: (_, externalData) => {
    const childWithInfo = getValueViaPath(
      externalData,
      'childrenCustodyInformation.data',
      [],
    ) as ApplicantChildCustodyInformation[]

    return childWithInfo ? childWithInfo.length > 0 : false
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
              const childWithInfo = getValueViaPath(
                externalData,
                'childrenCustodyInformation.data',
                [],
              ) as ApplicantChildCustodyInformation[]

              const childrenInAgeRange = childWithInfo.filter((child) => {
                const childInfo = kennitala.info(child.nationalId)
                return childInfo.age >= 17
              })

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
              //TODO separate condition for each point in message (A: ef eitt barn er með sameiginleg forsjá, B: ef eitt barn yfir 12 ára)
              const childWithInfo = getValueViaPath(
                externalData,
                'childrenCustodyInformation.data',
                [],
              ) as ApplicantChildCustodyInformation[]

              const childrenInAgeRange = childWithInfo.filter((child) => {
                const childInfo = kennitala.info(child.nationalId)
                return childInfo.age >= 11 || childInfo.age <= 18
              })

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
