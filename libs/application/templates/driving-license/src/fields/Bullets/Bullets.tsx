import { BulletList, Bullet } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import {  CustomField, FieldBaseProps, StaticText } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

const Bullets = ({ application, field }: PropTypes) => {
  const { formatMessage } = useLocale()
  const {textArray} = field.props as { textArray: StaticText[] }
  return (
    <BulletList>
      {textArray.map((bullet, index) => <Bullet key={index}>
        {formatText(
         bullet,
          application,
          formatMessage,
        )}
      </Bullet>)}
    
    </BulletList>
  )
}

export { Bullets }
