import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import {
  ApplicantChildCustodyInformation,
  ExternalData,
} from '@island.is/application/types'
import { childrenForm } from '../../../lib/messages'
import { SummaryComment } from '../../../lib/types'

export const childrenSubSection = buildSubSection({
  condition: (_, externalData) => {
    const childWithInfo = getValueViaPath(
      externalData,
      'childrenCustodyInformation.data',
      [],
    ) as Array<ApplicantChildCustodyInformation>

    return Boolean(childWithInfo?.length)
  },
  id: Routes.CHILDRENSCHOOLINFO,
  title: m.childrenForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'asdf',
      title: 'Börn',
      description: childrenForm.general.description,
      children: [
        buildDescriptionField({
          id: 'childrenSubsectionDescription',
          title: '',
          description: childrenForm.page.content,
          marginBottom: 4,
        }),
        buildCustomField({
          id: Routes.CHILDRENSCHOOLINFO,
          title: m.childrenForm.general.pageTitle,
          component: 'ChildrenForm',
        }),
        buildDescriptionField({
          id: 'childrenCommentDescription',
          title: childrenForm.page.commentTitle,
          titleVariant: 'h3',
          description: childrenForm.page.commentText,
        }),
        buildTextField({
          id: SummaryComment.CHILDRENCOMMENT,
          title: '',
          variant: 'textarea',
          placeholder: childrenForm.inputs.commentLabel,
          rows: 8,
        }),
      ],
    }),
  ],
})
