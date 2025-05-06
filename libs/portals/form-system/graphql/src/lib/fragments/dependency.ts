import { gql } from '@apollo/client'

export const DependencyFragment = gql`
  fragment Dependency on FormSystemDependency {
    parentProp
    childProps
    isSelected
  }
`
