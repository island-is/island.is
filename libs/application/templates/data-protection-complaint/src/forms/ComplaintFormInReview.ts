import { buildForm } from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { application } from '../lib/messages'
import { confirmation } from '../lib/messages/confirmation'
import { SubmittedApplicationData } from '../shared'

export const ComplaintFormInReview: Form = buildForm({
  id: 'DataProtectionComplaintFormInReview',
  title: application.name,
  children: [
    buildFormConclusionSection({
      alertTitle: confirmation.labels.alertTitle,
      expandableHeader: confirmation.labels.expandableHeader,
      expandableDescription: confirmation.labels.description,
      conclusionLinkS3FileKey: (application) => {
        const submitData = application.externalData
          .sendApplication as SubmittedApplicationData

        return submitData.data?.applicationPdfKey ?? ''
      },
      conclusionLinkLabel: confirmation.labels.pdfLink,
    }),
  ],
})
