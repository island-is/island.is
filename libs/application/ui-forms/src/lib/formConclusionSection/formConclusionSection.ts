import {
  buildAlertMessageField,
  buildDescriptionField,
  buildExpandableDescriptionField,
  buildLinkField,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
  coreMessages,
} from '@island.is/application/core'
import {
  Condition,
  FormText,
  FormTextWithLocale,
  ImageField,
  StaticText,
} from '@island.is/application/types'
import { conclusion } from './messages'

type Props = Partial<{
  alertTitle: FormText
  alertMessage: FormTextWithLocale
  alertType: 'success' | 'warning' | 'error' | 'info'
  multiFieldTitle: StaticText
  secondButtonLink: StaticText
  secondButtonLabel: StaticText
  secondButtonMessage: StaticText
  accordion?: boolean
  expandableHeader: FormText
  expandableIntro: FormText
  expandableDescription: FormTextWithLocale
  conclusionLinkS3FileKey: FormText
  conclusionLink: string
  conclusionLinkLabel: StaticText
  sectionTitle: StaticText
  tabTitle: StaticText
  bottomButtonLink: string
  bottomButtonLabel: StaticText
  bottomButtonMessage: FormText
  descriptionFieldTitle: StaticText
  descriptionFieldDescription: FormTextWithLocale
  condition?: Condition
  infoAlertTitle?: FormText
  infoAlertMessage?: FormTextWithLocale
  image?: ImageField
}>

/**
 * Creates a form conclusion section for applications
 * so the developer doesn't have to write the same code over and over again.
 *
 * @param  alertTitle  Title of the green alert message.
 * @param  alertMessage The message inside the green alert box.
 * @param  alertType The type of alert, can be success, warning, error, info. * JUST ADDED *
 * @param  multiFieldTitle Title of the conclusion section. * JUST ADDED *
 * @param  accordion If false, there will be no accordion.
 * @param  expandableHeader Header of the expandable description section.
 * @param  expandableIntro Intro text of the expandable description section.
 * @param  expandableDescription Markdown code for the expandable description section, most applications use bulletpoints.
 * @param  conclusionLinkS3FileKey The key of file in s3 for the link on top.
 * @param  conclusionLink Link that user can click on top.
 * @param  conclusionLinkLabel The text of the button that links to a url on top.
 * @param  sectionTitle The title for the section
 * @param  tabTitle The title for the tab
 * @param  bottomButtonLink The link for the bottom button
 * @param  bottomButtonLabel The label for the bottom button
 * @param  bottomButtonMessage The message for the bottom button
 * @param  descriptionFieldTitle The title for an optional description field
 * @param  descriptionFieldDescription The description for an optional description field
 * @param  infoAlertTitle The title for an optional info alert
 * @param  infoAlertMessage The message for an optional info alert
 */
export const buildFormConclusionSection = ({
  alertTitle = conclusion.alertMessageField.title,
  alertMessage = conclusion.alertMessageField.message,
  alertType = 'success',
  multiFieldTitle = conclusion.information.formTitle,
  accordion = true,
  expandableHeader = conclusion.expandableDescriptionField.title,
  expandableIntro = conclusion.expandableDescriptionField.introText,
  expandableDescription = conclusion.expandableDescriptionField.description,
  conclusionLinkS3FileKey = '',
  conclusionLink = '',
  conclusionLinkLabel = undefined,
  sectionTitle = conclusion.information.sectionTitle,
  tabTitle = conclusion.information.sectionTitle,
  bottomButtonLink = '/minarsidur/umsoknir',
  bottomButtonLabel = coreMessages.openServicePortalButtonTitle,
  bottomButtonMessage = coreMessages.openServicePortalMessageText,
  descriptionFieldTitle = undefined,
  descriptionFieldDescription = undefined,
  condition,
  infoAlertTitle = undefined,
  infoAlertMessage = undefined,
  image,
}: Props) => {
  const expandableDescriptionField = accordion
    ? [
        buildExpandableDescriptionField({
          id: 'uiForms.conclusionExpandableDescription',
          title: expandableHeader,
          introText: expandableIntro,
          description: expandableDescription,
          startExpanded: true,
        }),
      ]
    : []

  return buildSection({
    id: 'uiForms.conclusionSection',
    title: sectionTitle,
    tabTitle: tabTitle,
    condition,
    children: [
      buildMultiField({
        id: 'uiForms.conclusionMultifield',
        title: multiFieldTitle,
        children: [
          buildLinkField({
            id: 'uiForms.conclusionLink',
            title: conclusionLinkLabel || '',
            s3key: conclusionLinkS3FileKey,
            link: conclusionLink,
            condition: () => {
              return !!conclusionLinkLabel
            },
          }),
          buildAlertMessageField({
            id: 'uiForms.conclusionAlert',
            title: alertTitle,
            alertType: alertType,
            message: alertMessage,
          }),
          ...(infoAlertTitle || infoAlertMessage
            ? [
                buildAlertMessageField({
                  id: 'uiForms.conclusionInfoAlert',
                  title: infoAlertTitle,
                  message: infoAlertMessage,
                  alertType: 'info',
                }),
              ]
            : []),
          ...(descriptionFieldTitle || descriptionFieldDescription
            ? [
                buildDescriptionField({
                  id: 'uiForms.conclusionDescription',
                  title: descriptionFieldTitle,
                  titleVariant: 'h3',
                  description: descriptionFieldDescription,
                  marginBottom: 4,
                }),
              ]
            : []),
          ...expandableDescriptionField,
          ...(image ? [image] : []),
          buildMessageWithLinkButtonField({
            id: 'uiForms.conclusionBottomLink',
            url: bottomButtonLink,
            buttonTitle: bottomButtonLabel,
            message: bottomButtonMessage,
            marginBottom: [4, 4, 12],
          }),
        ],
      }),
    ],
  })
}
