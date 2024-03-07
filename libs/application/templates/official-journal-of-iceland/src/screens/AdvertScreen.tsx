import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { advert } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { useState } from 'react'
import { Button } from '@island.is/island-ui/core'
import { Advert } from '../fields/Advert'
import { Signatures } from '../fields/Signatures'
import { AdvertModal } from '../fields/AdvertModal'

export const AdvertScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  const [modalToggle, setModalToggle] = useState(false)
  const [selectedAdvertId, setSelectedAdvertId] = useState<string | null>(null)

  return (
    <FormScreen
      title={f(advert.general.title)}
      intro={f(advert.general.intro)}
      button={
        <Button
          variant="utility"
          iconType="outline"
          icon="copy"
          onClick={() => setModalToggle((prev) => !prev)}
        >
          {f(advert.buttons.copyOldAdvert)}
        </Button>
      }
    >
      <Advert {...props} selectedAdvertId={selectedAdvertId} />
      <Signatures {...props} />
      <AdvertModal
        setSelectedAdvertId={setSelectedAdvertId}
        visible={modalToggle}
        setVisibility={setModalToggle}
      />
    </FormScreen>
  )
}
