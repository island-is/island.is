import { FormSystemInput } from "@island.is/api/schema"
import { Box } from "@island.is/island-ui/core"
import MessageWithLink from "./components/MessageWithLink"

interface Props {
  data: FormSystemInput
}

const Preview = ({ data }: Props) => {
  return (
    <Box
      padding={2}
      background='blue100'
    >
      {data.type === 'Textalýsing' && (
        <MessageWithLink data={data} />
      )}
    </Box>
  )
}

export default Preview
