import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const CertificateTypeFragment = gql`
  fragment CertificateType on FormSystemCertificationType {
    id
    name {
      ...LanguageFields
    }
    description {
      ...LanguageFields
    }
    isCommon
  }
  ${LanguageFields}
`
