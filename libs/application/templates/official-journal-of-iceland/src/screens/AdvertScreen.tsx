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
  const [modalVisible, setModalVisability] = useState(false)

  const generateTimestamp = () => new Date().toISOString()

  /**
   * This state here is for force rerendering of the HTML editor when a value is received from the modal
   */
  const [timestamp, setTimestamp] = useState(generateTimestamp())

  return (
    <FormScreen
      title={f(advert.general.title)}
      intro={f(advert.general.intro)}
      button={
        <Button
          variant="utility"
          iconType="outline"
          icon="copy"
          onClick={() => setModalVisability((prev) => !prev)}
        >
          {f(advert.buttons.copyOldAdvert)}
        </Button>
      }
    >
      <Advert {...props} timeStamp={timestamp} />
      <Signatures {...props} />
      <AdvertModal
        applicationId={props.application.id}
        visible={modalVisible}
        setVisible={setModalVisability}
        onConfirmChange={() => setTimestamp(generateTimestamp())}
      />
    </FormScreen>
  )
}
