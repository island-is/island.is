import { Tag } from '@island.is/island-ui/core'
interface Props {
  translated: boolean
}

export const TranslationTag = ({ translated }: Props) => {
  return translated ? (
    <Tag variant="mint">Þýdd </Tag>
  ) : (
    <Tag variant="red">Óþýdd</Tag>
  )
}
