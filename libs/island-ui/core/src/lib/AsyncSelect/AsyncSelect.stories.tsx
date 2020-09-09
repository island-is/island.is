import React from 'react'
import { AsyncSelect } from './AsyncSelect'
import { Box } from '../Box'
import { ContentBlock } from '../ContentBlock'

export default {
  title: 'Core/AsyncSelect',
  component: AsyncSelect,
}

export const Default = () => (
  <ContentBlock>
    <Box padding={['gutter', 2, 3, 4]}>
      <AsyncSelect
        name="async_select_1"
        label="Tegund fyrirtækis"
        placeholder="Veldu tegund"
        options={[
          {
            label: 'Valmöguleiki 1',
            value: '0',
          },
          {
            label: 'Valmöguleiki 2',
            value: '1',
          },
          {
            label: 'Valmöguleiki 3',
            value: '2',
          },
          {
            label: 'Valmöguleiki 4',
            value: '3',
          },
        ]}
        noOptionsMessage="Enginn valmöguleiki"
        loadOptions={() => undefined}
      />
    </Box>
  </ContentBlock>
)
