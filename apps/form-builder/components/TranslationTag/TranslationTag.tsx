import { Tag } from '@island.is/island-ui/core'
interface Props {
  translated: boolean
}

export default function TranslationTag({ translated }: Props) {
  if (translated) {
    return <Tag variant="mint">Þýdd </Tag>
  } else {
    return <Tag variant="red">Óþýdd</Tag>
  }
}
