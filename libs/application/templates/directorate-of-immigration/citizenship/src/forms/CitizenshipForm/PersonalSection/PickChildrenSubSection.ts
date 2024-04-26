import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  getValueViaPath,
  buildAlertMessageField,
} from '@island.is/application/core'
import { selectChildren } from '../../../lib/messages'
import * as kennitala from 'kennitala'
import { ApplicantChildCustodyInformation } from '@island.is/application/types'
import { Routes } from '../../../lib/constants'
import {
  MAX_AGE_CHILD_INFORMATION_BOX,
  MIN_AGE_CHILD_INFORMATION_BOX,
  MIN_AGE_CHILD_WARNING,
} from '../../../shared'

export const PickChildrenSubSection = buildSubSection({
  id: Routes.PICKCHILDREN,
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
      id: Routes.PICKCHILDREN,
      title: selectChildren.general.pageTitle,
      description: selectChildren.general.description,
      children: [
        buildAlertMessageField({
          id: 'attentionAgeChildren',
          title: selectChildren.warningAgeChildren.title,
          message: selectChildren.warningAgeChildren.information,
          alertType: 'warning',
          condition: (_, externalData) => {
            const childWithInfo = getValueViaPath(
              externalData,
              'childrenCustodyInformation.data',
              [],
            ) as ApplicantChildCustodyInformation[]

            const childrenInAgeRange = childWithInfo.filter((child) => {
              const childInfo = kennitala.info(child.nationalId)
              return childInfo.age >= MIN_AGE_CHILD_WARNING
            })

            return childrenInAgeRange ? childrenInAgeRange.length > 0 : false
          },
          links: [
            {
              title: selectChildren.warningAgeChildren.linkTitle,
              url: selectChildren.warningAgeChildren.linkUrl,
              isExternal: true,
            },
          ],
        }),
        buildCustomField({
          id: 'selectedChildren',
          title: selectChildren.general.pageTitle,
          component: 'SelectChildren',
        }),
        buildCustomField({
          id: 'generalMessage',
          title: 'Upplýsingar',
          component: 'ChildrenInformationBoxWithLink',
          condition: (_, externalData) => {
            const childWithInfo = getValueViaPath(
              externalData,
              'childrenCustodyInformation.data',
              [],
            ) as ApplicantChildCustodyInformation[]

            const childrenInAgeRange = childWithInfo.filter((child) => {
              const childInfo = kennitala.info(child.nationalId)
              return (
                childInfo.age >= MIN_AGE_CHILD_INFORMATION_BOX ||
                childInfo.age <= MAX_AGE_CHILD_INFORMATION_BOX
              )
            })

            const showSharedCustodyWarning = childWithInfo.filter((child) => {
              return !!child.otherParent
            })

            return (childrenInAgeRange && childrenInAgeRange.length > 0) ||
              showSharedCustodyWarning
              ? true
              : false
          },
        }),
      ],
    }),
  ],
})
