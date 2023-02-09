import { buildForm } from '@island.is/application/core'
import { Form } from '@island.is/application/types'
import { formConclusionSection } from '@island.is/application/ui-forms'
import { application } from '../lib/messages'
import { confirmation } from '../lib/messages/confirmation'
import { SubmittedApplicationData } from '../shared'

export const ComplaintFormInReview: Form = buildForm({
  id: 'DataProtectionComplaintFormInReview',
  title: application.name,
  children: [
    formConclusionSection({
      alertTitle: confirmation.labels.alertTitle,
      expandableHeader: confirmation.labels.expandableHeader,
      expandableDescription: confirmation.labels.description,
      sFileKey: (application) => {
        const submitData = application.externalData
          .sendApplication as SubmittedApplicationData

        return submitData.data?.applicationPdfKey ?? ''
      },
      buttonText: confirmation.labels.pdfLink,
    }),
  ],
})
