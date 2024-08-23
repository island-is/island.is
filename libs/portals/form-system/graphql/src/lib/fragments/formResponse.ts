import { gql } from '@apollo/client'
import { FormFragment } from './form'
import { FieldTypeFragment } from './fieldType'
import { CertificateTypeFragment } from './certificateType'
import { ListTypeFragment } from './listType'

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
    listTypes {
      ...ListType
    }
    forms {
      ...Form
    }
  }
  ${FormFragment}
  ${FieldTypeFragment}
  ${CertificateTypeFragment}
  ${ListTypeFragment}

`
