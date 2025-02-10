import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { Preview } from '../fields/Preview'
import { OJOIFieldBaseProps } from '../lib/types'
import { preview } from '../lib/messages'

export const PreviewScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  return (
    <FormScreen
      title={f(preview.general.title)}
      intro={f(preview.general.intro, {
        br: (
          <>
            <br />
            <br />
          </>
        ),
      })}
      goToScreen={props.goToScreen}
    >
      <Preview {...props} />
    </FormScreen>
  )
}
