import { coreMessages, FormBuilder } from '@island.is/application/core'
import { conclusionMessages } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'

export const completedForm = new FormBuilder('completedForm', '', {
  mode: FormModes.COMPLETED,
})
  .addSection(
    'uiForms.conclusionSection',
    conclusionMessages.information.sectionTitle,
    (section) => {
      section.addPage(
        'uiForms.conclusionMultifield',
        conclusionMessages.information.formTitle,
        (page) => {
          page
            .addLinkField('uiForms.conclusionLink', '', {
              showWhen: {
                field: 'uiForms.conclusionLink',
                equals: 'false',
              },
            })
            .addAlertMessageField('uiForms.conclusionAlert', {
              title: 'Congratulations',
              alertType: 'success',
              message:
                'You have now looked at all the inputs that the application system offers',
            })
            .addExpandableDescriptionField(
              'uiForms.conclusionExpandableDescription',
              conclusionMessages.expandableDescriptionField.title,
              {
                introText:
                  conclusionMessages.expandableDescriptionField.introText,
                description:
                  conclusionMessages.expandableDescriptionField.description,
                startExpanded: true,
              },
            )
            .addMessageWithLinkButtonField('uiForms.conclusionBottomLink', {
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
              marginBottom: [4, 4, 12],
            })
        },
      )
    },
    {
      tabTitle: conclusionMessages.information.sectionTitle,
    },
  )
  .build()
