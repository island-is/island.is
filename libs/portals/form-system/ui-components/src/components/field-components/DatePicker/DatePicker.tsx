import { DatePicker as Dp, Box } from '@island.is/island-ui/core'

interface Props {
  name: string
}

export const DatePicker = ({ name }: Props) => {

  return (
    <Box marginTop={2} width="half">
      <Dp
        label={
          name === ''
            ? 'Dagssetning'
            : name
        }
        placeholderText="Veldu dagsetningu"
      />
    </Box>
  )
}
