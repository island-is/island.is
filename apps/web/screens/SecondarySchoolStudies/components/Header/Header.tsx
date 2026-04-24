import { useIntl } from 'react-intl'

import { DefaultHeader } from '@island.is/web/components'

import { m } from '../../messages/messages'

const BACKGROUND_COLOR = '#1A3869'

export const Header = () => {
  const { formatMessage } = useIntl()

  return (
    <DefaultHeader
      title={formatMessage(m.home.title)}
      titleColor="white"
      image="/assets/framhaldsskolanamHeaderImage.svg"
      imagePadding="0"
      background={BACKGROUND_COLOR}
      mobileBackground={BACKGROUND_COLOR}
      logo="/assets/skjaldarmerki.svg"
      logoAltText="Icelandic coat of arms"
      fullWidth={false}
      imageIsFullHeight
      imageObjectFit="cover"
    />
  )
}
