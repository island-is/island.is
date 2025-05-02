import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const CertificateTypeFragment = gql`
  fragment CertificateType on FormSystemFormCertificationType {
    id
    name {
      ...LanguageFields
    }
    description {
      ...LanguageFields
    }
    isCommon
    certificationTypeId
    organizationCertificationId
  }
  ${LanguageFields}
`
