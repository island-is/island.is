import {
  FocusableBox,
  Icon,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { CardSkeleton } from '../../../../components/'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { getShortDate } from '../../../../utils/helpers/dateFunctions'
import { REVIEW_CARD_SCROLL_HEIGHT } from '../../../../utils/consts/consts'
import localization from '../../Case.json'
import { AdviceResult } from '../../../../types/interfaces'
import DocFileName from '../DocFileName/DocFileName'

interface Props {
  advice: AdviceResult
}

interface LocProps {
  loc: typeof localization['adviceCard']
}

interface RenderAdviceProps extends Props, LocProps {
  isOpen?: boolean
}

interface LinkProps extends LocProps {
  children: ReactNode
}

const Link = ({ loc, children }: LinkProps) => {
  return (
    <LinkV2
      href={loc['hiddenContentHref']}
      color="blue400"
      underline="normal"
      underlineVisibility="always"
    >
      {children}
    </LinkV2>
  )
}

const RenderAdvice = ({ advice, loc, isOpen = false }: RenderAdviceProps) => {
  if (advice?.isPrivate) {
    return loc['privateContent']
  }
  if (advice?.isHidden) {
    const retComp = []
    retComp.push(loc['hiddenContent'])
    retComp.push(' ')
    retComp.push(
      <Link key={advice.id} loc={loc}>
        {loc['hiddenContentLink']}
      </Link>,
    )
    retComp.push('.')
    return retComp
  }

  const content = advice?.content
  const splitContent = content?.split('\n')
  
  return isOpen ? (
    <Stack space={1}>
      {splitContent?.map((text) => (
        <Text>{text}</Text>
      ))}
    </Stack>
  ) : (
    content
  )
}

export const AdviceCard = ({ advice }: Props) => {
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
            <FocusableBox component="button" onClick={() => setOpen(!open)}>
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
          {!advice?.isPrivate && !advice?.isHidden && advice?.participantName}
        </Text>
        <Text variant="default" truncate={!open} ref={ref}>
          {RenderAdvice({ advice: advice, loc: loc, isOpen: open })}
        </Text>
        {!advice?.isPrivate &&
          !advice?.isHidden &&
          advice?.adviceDocuments &&
          advice?.adviceDocuments.length > 0 &&
          advice?.adviceDocuments.map((doc) => {
            return <DocFileName doc={doc} key={doc.id} isAdvice />
          })}
      </Stack>
    </CardSkeleton>
  )
}

export default AdviceCard
