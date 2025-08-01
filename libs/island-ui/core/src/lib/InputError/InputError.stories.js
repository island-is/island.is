import { InputError } from './InputError'

export default {
  title: 'Form/InputError',
  component: InputError,
}

export const Default = {
  render: () => <InputError errorMessage="Error with this input" />,
  name: 'Default',
}
