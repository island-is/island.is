import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { advert } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { useState } from 'react'
import { Button } from '@island.is/island-ui/core'
import { Advert } from '../fields/Advert'
import { Signatures } from '../fields/Signatures'

export const AdvertScreen = ({
  application,
  errors,
  field,
}: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  const [modalToggle, setModalToggle] = useState(false)

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
      <Advert field={field} application={application} errors={errors} />
      <Signatures field={field} application={application} errors={errors} />
    </FormScreen>
  )
}
