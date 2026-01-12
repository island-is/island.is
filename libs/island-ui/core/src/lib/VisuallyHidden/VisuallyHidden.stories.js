import { VisuallyHidden } from './VisuallyHidden'
import { Button } from '../Button/Button'

const Template = (args) => (
  <Button icon="settings" circle>
    <VisuallyHidden {...args} />
  </Button>
)

export default {
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
}

export const Default = {
  render: Template.bind({}),
  name: 'Default',

  args: {
    children: 'Stillingar',
  },
}
