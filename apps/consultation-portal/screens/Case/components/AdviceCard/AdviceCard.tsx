import {
  FocusableBox,
  Icon,
  Inline,
  LinkV2,
  Stack,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { CardSkeleton } from '../../../../components/'
import { useEffect, useRef, useState } from 'react'
import * as styles from './AdviceCard.css'
import { getShortDate } from '../../../../utils/helpers/dateFunctions'
import env from '../../../../lib/environment'
import { REVIEW_CARD_SCROLL_HEIGHT } from '../../../../utils/consts/consts'
import { renderDocFileName } from '../../utils'
import localization from '../../Case.json'

export const AdviceCard = ({ advice }) => {
  const loc = localization['adviceCard']
  const [open, setOpen] = useState(true)
  const [scrollHeight, setScrollHeight] = useState(null)

  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      setScrollHeight(ref.current.scrollHeight)
      if (ref.current.scrollHeight > REVIEW_CARD_SCROLL_HEIGHT) {
        setOpen(false)
      }
    }
    ref.current && setScrollHeight(ref.current.scrollHeight)
  }, [])

  return (
    <CardSkeleton>
      <Stack space={1}>
        <Inline justifyContent="spaceBetween" flexWrap="nowrap" alignY="center">
          <Text variant="eyebrow" color="purple400">
            {getShortDate(advice.created)}
          </Text>
          {scrollHeight > REVIEW_CARD_SCROLL_HEIGHT && (
            <FocusableBox onClick={() => setOpen(!open)}>
              <Icon
                icon={open ? 'remove' : 'add'}
                type="outline"
                size="small"
                color="blue400"
              />
            </FocusableBox>
          )}
        </Inline>
        <Text variant="h3">
          {advice?.number} -{' '}
          {!advice?.isPrivateAdvice && advice?.participantName}
        </Text>
        <Text variant="default" truncate={!open} ref={ref}>
          {advice?.isPrivateAdvice ? loc.hiddenContent : advice.content}
        </Text>
        {!advice?.isPrivateAdvice &&
          advice?.adviceDocuments &&
          advice?.adviceDocuments.length > 0 &&
          advice?.adviceDocuments.map((doc, index) => {
            return (
              <Tooltip
                placement="right"
                as="span"
                text={doc.fileName}
                key={index}
                fullWidth
              >
                <span>
                  <LinkV2
                    href={`${env.backendDownloadUrl}${doc.id}`}
                    color="blue400"
                    underline="normal"
                    underlineVisibility="always"
                    newTab
                    key={index}
                  >
                    {renderDocFileName(doc.fileName)}
                    <Icon
                      size="small"
                      aria-hidden="true"
                      icon="document"
                      type="outline"
                      className={styles.iconStyle}
                    />
                  </LinkV2>
                </span>
              </Tooltip>
            )
          })}
      </Stack>
    </CardSkeleton>
  )
}

export default AdviceCard
