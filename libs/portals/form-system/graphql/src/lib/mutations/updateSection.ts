import { gql } from '@apollo/client'
import { SectionFragment } from '../fragments/section'

export const UPDATE_SECTION = gql`
  mutation UpdateFormSystemSection($input: FormSystemUpdateSectionInput!) {
    updateFormSystemSection(input: $input) {
      ...Section
    }
  }
  ${SectionFragment}
`
