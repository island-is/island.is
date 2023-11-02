import React from 'react'
import { FieldBaseProps /* Field */ } from '@island.is/application/core'

// Only needed when using additional props other than FieldBaseProps
// interface AdditionalProps {
//   someProp: string
// }

// interface FieldBasePropsWithAdditionalProps extends FieldBaseProps {
//   field: Field & {
//     props: AdditionalProps
//   }
// }

// Usage:
// buildCustomField(
// {
//   id: 'ResidenceChangeInformation',
//   title: '',
//   component: 'ResidenceChangeInformation',
// }),

// With custom props that will be accessible from props.field.props.${propName}
// buildCustomField(
// {
//   id: 'ResidenceChangeInformation',
//   title: '',
//   component: 'ResidenceChangeInformation',
// },
// {
//   someProp: 'Hello there string'
// }),

const ExampleReference = ({ application }: FieldBaseProps) => {
  return <div>{JSON.stringify(application)}</div>
}

export default ExampleReference
