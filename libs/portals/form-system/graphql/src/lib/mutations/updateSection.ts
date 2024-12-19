import { gql } from '@apollo/client'
import { SectionFragment } from '../fragments/section'

export const UPDATE_SECTION = gql`
  mutation FormSystemUpdateSection($input: FormSystemUpdateSectionInput!) {
    formSystemUpdateSection(input: $input) {
      ...Section
    }
  }
  ${SectionFragment}
`
