import { GridColumn, Input, GridRow } from '@island.is/island-ui/core'
import React from 'react'
import { Control, FieldError, Controller } from 'react-hook-form'

export type CategorySlug =
  | 'fjoelskyldumal'
  | 'skirteini'
  | 'andlat-og-danarbu'
  | 'thinglysingar-stadfestingar-og-skraningar'
  | 'gjoeld-og-innheimta'
  | 'loeggildingar'
  | 'vottord'
  | 'loegradamal'
  | 'oennur-thjonusta-syslumanna'
  | 'leyfi'
  | 'fullnustugerdir'

interface AddonFieldsProps {
  slug: CategorySlug
  control: Control
  errors: Record<string, FieldError>
}

interface BasicInputProps {
  control: Control
  errors: Record<string, FieldError>
  name: string
  label: string
}

function NestedInput() {
  const { register } = useFormContext() // retrieve all hook methods
  return <input {...register('test')} />
}
export const BasicInput = ({
  control,
  errors,
  name,
  label,
}: BasicInputProps) => {
  return (
    <Controller
      control={control}
      id={name}
      name={name}
      defaultValue=""
      render={({ onChange, value, name }) => (
        <Input
          name={name}
          label={label}
          value={value}
          hasError={!!errors?.[name]}
          errorMessage={errors?.[name]?.message}
          onChange={onChange}
        />
      )}
    />
  )
}

// export const AddonFields = ({ slug, control, errors }: AddonFieldsProps) => {
//   let fields = null

//   switch (slug) {
//     case 'fjoelskyldumal':
//       fields = (
//         <>
//           BasicInput
//           {nafnMalsadila}
//           {kennitalaMalsadila}
//           {malsnumer}
//         </>
//       )
//       break
//     default:
//       return null
//   }

//   return (
//     <GridRow marginBottom={5} marginTop={5}>
//       {fields}
//     </GridRow>
//   )
//   return null
// }

// export default AddonFields
