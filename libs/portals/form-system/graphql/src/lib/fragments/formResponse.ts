import { gql } from '@apollo/client'
import { FormFragment } from './form'
import { FieldTypeFragment } from './fieldType'
import { CertificateTypeFragment } from './certificateType'
import { ListTypeFragment } from './listType'
import { FormApplicantFragment } from './formApplicant'

export const FormResponseFragment = gql`
  fragment FormResponse on FormSystemFormResponse {
    form {
      ...Form
    }
    fieldTypes {
      ...FieldType
    }
    certificationTypes {
      ...CertificateType
    }
    applicantTypes {
      ...FormApplicant
    }
    listTypes {
      ...ListType
    }
    forms {
      ...Form
    }
    submitUrls {
      id
      url
      isTest
      type
      method
    }
    validationUrls {
      id
      url
      isTest
      type
      method
    }
    organizations {
      value
      label
      isSelected
    }
  }
  ${FormApplicantFragment}
  ${FormFragment}
  ${FieldTypeFragment}
  ${CertificateTypeFragment}
  ${ListTypeFragment}
`
