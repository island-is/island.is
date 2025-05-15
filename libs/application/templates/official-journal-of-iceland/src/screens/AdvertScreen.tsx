import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { advert } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { useState } from 'react'
import { Button } from '@island.is/island-ui/core'
import { Advert } from '../fields/Advert'
import { SignaturesField } from '../fields/Signatures'
import { AdvertModal } from '../fields/AdvertModal'
export const AdvertScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const [modalVisible, setModalVisability] = useState(false)

  return (
    <FormScreen
      goToScreen={props.goToScreen}
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
      <Advert {...props} />
      <SignaturesField {...props} />
      <AdvertModal
        applicationId={props.application.id}
        visible={modalVisible}
        setVisible={setModalVisability}
        onConfirmChange={() => {
          setTimeout(() => {
            props.refetch && props.refetch()
          }, 300)
        }}
      />
    </FormScreen>
  )
}
