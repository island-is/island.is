import { gql } from '@apollo/client'
import { SectionFragment } from '../fragments/section'

export const CREATE_SECTION = gql`
  mutation CreateFormSystemSection($input: FormSystemCreateSectionInput!) {
    createFormSystemSection(input: $input) {
      ...Section
    }
  }
  ${SectionFragment}
`
