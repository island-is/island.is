import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { MessageDescriptor } from 'react-intl'
import { survivorsBenefitsFormMessage } from './messages'

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  additionalDocuments:
    socialInsuranceAdministrationMessage.confirm.additionalDocumentsAttachment,
  expectingChild:
    survivorsBenefitsFormMessage.confirm.expectingChildAttachment,
  deathCertificate:
    survivorsBenefitsFormMessage.confirm.deathCertificateAttachment,
}

export const DeathBenefits = 'deathbenefits'
