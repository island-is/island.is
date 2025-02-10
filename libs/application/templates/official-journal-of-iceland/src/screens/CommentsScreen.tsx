import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { OJOIFieldBaseProps } from '../lib/types'
import { Comments } from '../fields/Comments'
import { comments } from '../lib/messages/comments'

export const CommentsScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  return (
    <FormScreen
      title={f(comments.general.title)}
      intro={f(comments.general.intro)}
      goToScreen={props.goToScreen}
    >
      <Comments {...props} />
    </FormScreen>
  )
}
