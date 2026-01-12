import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const alertMessageSection = buildSection({
  id: 'allertMessageSection',
  title: 'Alert message',
  children: [
    buildMultiField({
      id: 'alertMessageMultiField',
      title: 'BuildAlertMessageField',
      children: [
        buildDescriptionField({
          id: 'alertMessagesDescription',
          description:
            'Alert messages are used to display important information to the user. Choose the alertType based on the information you want the user to focus on.',
          width: 'full',
        }),
        buildDescriptionField({
          id: 'alertMessageDescription2',
          description:
            'In many cases an alert message is shown based on a condition, like something that was fetched from a data provider or the way a user fills in the application.',
          width: 'full',
        }),
        buildAlertMessageField({
          id: 'alertMessageDefault',
          title: 'Default Alert message',
          message:
            "Rarely used, doesn't have a specific icon or grab attendion.",
          alertType: 'default',
          links: [
            {
              title: 'Alert messages',
              url: 'https://www.google.com',
              isExternal: true,
            },
            {
              title: 'can also take in',
              url: 'https://www.goog2le.com',
              isExternal: true,
            },
            {
              title: 'a list of links',
              url: 'https://www.google.com',
              isExternal: false,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'alertMessageWarning',
          title: 'Warning Alert message',
          message:
            'Something that the user should be aware of but not necessarily act on.',
          alertType: 'warning',
        }),
        buildAlertMessageField({
          id: 'alertMessageError',
          title: 'Error Alert message',
          message:
            'Something that the user should be aware of and act on, he should not be able to continue if this message showing.',
          alertType: 'error',
        }),
        buildAlertMessageField({
          id: 'alertMessageInfo',
          title: 'Info Alert message',
          message: 'Informational message that the user should be aware of.',
          alertType: 'info',
        }),
        buildAlertMessageField({
          id: 'alertMessageSuccess',
          title: 'Success Alert message',
          message:
            'Something that went successfully, like application submission',
          alertType: 'success',
        }),
        buildAlertMessageField({
          id: 'alertMessageDefault2',
          title: 'Half width Default',
          message: 'Alert message',
          alertType: 'default',
          width: 'half',
        }),
        buildAlertMessageField({
          id: 'alertMessageWarning2',
          title: 'Half width Warning',
          message: 'Alert message',
          alertType: 'warning',
          width: 'half',
        }),
        buildAlertMessageField({
          id: 'alertMessageError2',
          title: 'Half width Error',
          message: 'Alert message',
          alertType: 'error',
          width: 'half',
        }),
        buildAlertMessageField({
          id: 'alertMessageInfo2',
          title: 'Half width Info',
          message: 'Alert message',
          alertType: 'info',
          width: 'half',
        }),
        buildAlertMessageField({
          id: 'alertMessageSuccess2',
          title: 'Half width Success',
          message: 'Alert message',
          alertType: 'success',
          width: 'half',
        }),
      ],
    }),
  ],
})
