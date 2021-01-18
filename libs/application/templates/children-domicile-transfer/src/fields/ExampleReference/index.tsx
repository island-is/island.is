import React from 'react'
import { FieldBaseProps /* Field */ } from '@island.is/application/core'

// Only needed if using additional props other than FieldBaseProps
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
//   id: 'domicileChangeInformation',
//   title: '',
//   component: 'DomicileChangeInformation',
// }),

// With custom props that will be accessible from props.field.props.${propName}
// buildCustomField(
// {
//   id: 'domicileChangeInformation',
//   title: '',
//   component: 'DomicileChangeInformation',
// },
// {
//   someProp: 'Hello there string'
// }),

const ExampleReference = ({ application }: FieldBaseProps) => {
  return <div>{JSON.stringify(application)}</div>
}

export default ExampleReference
