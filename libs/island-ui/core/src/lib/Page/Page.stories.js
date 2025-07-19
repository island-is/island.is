import { Page } from './Page'
import { Text } from '../Text/Text'

export default {
  title: 'Components/Page',
  component: Page,
}

export const Default = {
  render: () => (
    <Page>
      <Text>Page component</Text>
    </Page>
  ),

  name: 'Default',
}
