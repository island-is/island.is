import { FormScreen } from '../components/form/FormScreen'
import { OJOIFieldBaseProps } from '../lib/types'
import { Submitted } from '../fields/Submitted'
import { submitted } from '../lib/messages/submitted'
import { useLocale } from '@island.is/localization'
import { useApplicationCase } from '../hooks/useApplicationCase'
import { Bullet, BulletList } from '@island.is/island-ui/core'

export const SubmittedScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage, formatDate } = useLocale()

  const { caseData } = useApplicationCase({
    applicationId: props.application.id,
  })

  return (
    <FormScreen
      title={formatMessage(submitted.general.title)}
      description={
        <BulletList>
          <Bullet>{formatMessage(submitted.bullets.first)}</Bullet>
          <Bullet>{formatMessage(submitted.bullets.second)}</Bullet>
          {caseData?.status ? (
            <Bullet>{`${formatMessage(
              submitted.bullets.expectedPublishDate,
            )} ${formatDate(caseData.expectedPublishDate)}`}</Bullet>
          ) : null}
        </BulletList>
      }
    >
      <Submitted {...props} />
    </FormScreen>
  )
}
