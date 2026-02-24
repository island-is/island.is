import styled from 'styled-components'
import { Checkbox } from '@/ui'
import { View } from 'react-native'

interface FilteringCheckboxProps {
  label: string
  checked: boolean
  onPress: () => void
}

const Container = styled(View)`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

export const FilteringCheckbox = ({
  label,
  checked,
  onPress,
}: FilteringCheckboxProps) => {
  return (
    <Container>
      <Checkbox
        label={label}
        checked={checked}
        onPress={onPress}
        isFullWidth
        borderBottom
      />
    </Container>
  )
}
