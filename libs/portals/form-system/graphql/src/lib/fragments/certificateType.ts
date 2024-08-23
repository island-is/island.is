import { gql } from '@apollo/client'
import { LanguageFields } from './languageFields'

export const CertificateTypeFragment = gql`
  fragment CertificateType on FormCertificateType {
    id
    name {
      ...LanguageFields
    }
    description {
      ...LanguageFields
    }
    type
  }
  ${LanguageFields}
`
