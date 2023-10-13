import {
  ApplicantChildCustodyInformation,
  FieldBaseProps,
} from '@island.is/application/types'
import { AlertMessage, GridContainer, LinkV2 } from '@island.is/island-ui/core'
import { FC } from 'react'
import * as styles from './ChildrenInformationBoxWithLink.css'
import DescriptionText from '../../components/DescriptionText'
import { useLocale } from '@island.is/localization'
import { selectChildren } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import kennitala from 'kennitala'

export const ChildrenInformationBoxWithLink: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const linkTitle = formatMessage(
    selectChildren.informationChildrenSection.linkTitle,
  )
  const linkUrl = formatMessage(
    selectChildren.informationChildrenSection.linkUrl,
  )
  const title = formatMessage(selectChildren.informationChildrenSection.title)

  const childWithInfo = getValueViaPath(
    application.externalData,
    'childrenCustodyInformation.data',
    [],
  ) as ApplicantChildCustodyInformation[]

  const childrenInAgeRange = childWithInfo.filter((child) => {
    const childInfo = kennitala.info(child.nationalId)
    return childInfo.age >= 11 || childInfo.age <= 18
  })

  const showAgeRangeWarning = childrenInAgeRange
    ? childrenInAgeRange.length > 0
    : false

  const showSharedCustodyWarning = childWithInfo.filter((child) => {
    return !!child.otherParent
  })

  const messageComponent = (
    <GridContainer>
      {showSharedCustodyWarning.length > 0 && (
        <DescriptionText
          text={
            selectChildren.informationChildrenSection.informationSharedCustody
          }
          textProps={{ variant: 'small' }}
        />
      )}

      {showAgeRangeWarning && (
        <DescriptionText
          text={selectChildren.informationChildrenSection.informationChildAge}
          textProps={{ variant: 'small' }}
        />
      )}

      <LinkV2
        href={linkUrl}
        color="blue400"
        underline="normal"
        underlineVisibility="always"
        className={styles.link}
      >
        {linkTitle}
      </LinkV2>
    </GridContainer>
  )

  return <AlertMessage type="info" title={title} message={messageComponent} />
}
