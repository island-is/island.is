import { Input } from '@island.is/island-ui/core'

type Props = {
  name: string
  label: string
  defaultValue?: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}

export const SignatureMember = ({
  name,
  label,
  defaultValue,
  onChange,
}: Props) => {
  return (
    <Input
      name={name}
      label={label}
      size="sm"
      backgroundColor="blue"
      defaultValue={defaultValue}
      onChange={onChange}
    />
  )
}
