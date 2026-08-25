import type { FC, MouseEvent, PointerEvent, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { MotionValue } from 'motion/react'
import {
  animate,
  motion,
  Reorder,
  useDragControls,
  useMotionValue,
} from 'motion/react'

import {
  AccordionItem,
  Box,
  Icon,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import type {
  Case,
  IndictmentCount as TIndictmentCount,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { getIndictmentCountWarningMessage } from '@island.is/judicial-system-web/src/utils/validate'

import * as styles from './IndictmentCountAccordionItem.css'

interface Props {
  indictmentCount: TIndictmentCount
  index: number
  workingCase: Case
  expanded: boolean
  onToggle: (expanded: boolean) => void
  onReorder: () => void
  children: ReactNode
  onDelete?: (id: string) => Promise<void>
}

interface IndictmentCountLabelProps {
  index: number
  policeCaseNumber?: string | null
  formattedDate?: string
  warningMessage?: string
}

const useRaisedShadow = (value: MotionValue<number>) => {
  const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)'
  const boxShadow = useMotionValue(inactiveShadow)

  useEffect(() => {
    let isActive = false
    value.on('change', (latest) => {
      const wasActive = isActive
      if (latest !== 0) {
        isActive = true
        if (isActive !== wasActive) {
          animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)')
        }
      } else {
        isActive = false
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow)
        }
      }
    })
  }, [value, boxShadow])

  return boxShadow
}

const IndictmentCountLabel = ({
  index,
  policeCaseNumber,
  formattedDate,
  warningMessage,
}: IndictmentCountLabelProps) => {
  const policeCaseNumberLabel = policeCaseNumber ?? 'Ekki valið'

  return (
    <Box
      className={styles.label}
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
    >
      <Box className={styles.labelStart}>
        <Text variant="h4" as="span">
          <motion.span layout>{index + 1}.</motion.span> {policeCaseNumberLabel}
        </Text>
        {warningMessage && (
          <Box
            className={styles.warningIcon}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <Tooltip placement="top" as="span" text={warningMessage}>
              <span>
                <Icon icon="warning" type="filled" color="yellow600" />
              </span>
            </Tooltip>
          </Box>
        )}
      </Box>
      {formattedDate && (
        <Text variant="h4" as="span" className={styles.labelDate}>
          {formattedDate}
        </Text>
      )}
    </Box>
  )
}

export const IndictmentCountAccordionItem: FC<Props> = ({
  indictmentCount,
  index,
  workingCase,
  expanded,
  onToggle,
  onReorder,
  children,
}) => {
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const controls = useDragControls()
  const [isDragging, setIsDragging] = useState(false)

  const formattedDate = useMemo(() => {
    const policeCaseNumber = indictmentCount.policeCaseNumber

    if (!policeCaseNumber) {
      return undefined
    }

    return formatDate(
      workingCase.crimeScenes?.[policeCaseNumber]?.date,
      'd.M.yyyy',
    )
  }, [indictmentCount.policeCaseNumber, workingCase.crimeScenes])

  const warningMessage = getIndictmentCountWarningMessage(
    indictmentCount,
    workingCase,
  )

  const handlePointerDown = (evt: PointerEvent) => {
    evt.preventDefault()
    setIsDragging(true)
    controls.start(evt)
  }

  const handleDragHandleClick = (evt: MouseEvent) => {
    // Prevent the accordion item from being toggled
    evt.preventDefault()
    evt.stopPropagation()
  }

  const handlePointerUp = () => {
    if (isDragging) {
      onReorder()
    }
    setIsDragging(false)
  }

  return (
    <Reorder.Item
      value={indictmentCount}
      id={indictmentCount.id}
      style={{
        y,
        boxShadow,
      }}
      className={styles.reorderItem}
      dragListener={false}
      dragControls={controls}
      onPointerUp={handlePointerUp}
      drag
    >
      <Box className={styles.itemWrapper}>
        <AccordionItem
          id={`indictmentCountAccordionItem-${indictmentCount.id}`}
          expanded={expanded}
          onToggle={onToggle}
          label={
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box
                className={styles.dragHandle}
                data-testid="indictmentCountDragHandle"
                onPointerDown={handlePointerDown}
                onClick={handleDragHandleClick}
              >
                <Icon icon="menu" color="blue400" />
              </Box>
              <IndictmentCountLabel
                index={index}
                policeCaseNumber={indictmentCount.policeCaseNumber}
                formattedDate={formattedDate}
                warningMessage={warningMessage}
              />
            </Box>
          }
        >
          {children}
        </AccordionItem>
      </Box>
    </Reorder.Item>
  )
}
