import {
  Bullet,
  BulletList,
  Button,
  GridColumn,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages as m } from '../lib/messages'

export const generateIntroComponent = () => <IntroComponent />

const IntroComponent = () => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="default" paddingTop={2}>
        {formatMessage(m.introLink, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          link: (str: any) => (
            <a
              href="https://island.is/loftbru/notendaskilmalar-vegagerdarinnar-fyrir-loftbru"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="text">{str}</Button>
            </a>
          ),
        })}
      </Text>
      <GridColumn span={['12/12', '12/12', '7/8']} order={3} paddingTop={4}>
        <BulletList>
          <Bullet>{formatMessage(m.discountTextFirst)}</Bullet>
          <Bullet>{formatMessage(m.discountTextSecond)}</Bullet>
        </BulletList>
      </GridColumn>
    </>
  )
}
