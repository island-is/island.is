import {
  FC,
  ForwardedRef,
  forwardRef,
  PointerEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import {
  animate,
  motion,
  MotionValue,
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
import {
  Case,
  IndictmentCount as TIndictmentCount,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isIndictmentCountComplete } from '@island.is/judicial-system-web/src/utils/validate'

import { strings } from './Indictment.strings'
import * as styles from './IndictmentCountAccordionItem.css'

interface Props {
  indictmentCount: TIndictmentCount
  index: number
  workingCase: Case
  onReorder: () => void
  children: ReactNode
  onDelete?: (id: string) => Promise<void>
}

interface IndictmentCountLabelProps {
  index: number
  policeCaseNumber?: string | null
  formattedDate?: string
  isComplete: boolean
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

const IndictmentCountLabel = forwardRef(
  (props: IndictmentCountLabelProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { index, policeCaseNumber, formattedDate, isComplete } = props
    const { formatMessage } = useIntl()

    const labelParts = [
      policeCaseNumber ?? formatMessage(strings.policeCaseNumberNotSelected),
      formattedDate,
    ].filter(Boolean)

    return (
      <Box ref={ref} display="flex" alignItems="flexEnd" columnGap={1}>
        <Text variant="h4" as="span">
          <motion.span layout>{index + 1}.</motion.span>{' '}
          {labelParts.join(' ')}
        </Text>
        {!isComplete && (
          <Tooltip
            placement="top"
            as="span"
            text={formatMessage(strings.incompleteIndictmentCountTooltip)}
          >
            <span>
              <Icon icon="warning" type="filled" color="yellow600" />
            </span>
          </Tooltip>
        )}
      </Box>
    )
  },
)

export const IndictmentCountAccordionItem: FC<Props> = ({
  indictmentCount,
  index,
  workingCase,
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

  const isComplete = isIndictmentCountComplete(indictmentCount, workingCase)

  const handlePointerDown = (evt: PointerEvent) => {
    evt.preventDefault()
    setIsDragging(true)
    controls.start(evt)
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
        <Box
          className={styles.dragHandle}
          data-testid="indictmentCountDragHandle"
          onPointerDown={handlePointerDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <Icon icon="menu" color="blue400" />
        </Box>
        <Box className={styles.accordionWrapper}>
          <AccordionItem
            id={`indictmentCountAccordionItem-${indictmentCount.id}`}
            label={
              <IndictmentCountLabel
                index={index}
                policeCaseNumber={indictmentCount.policeCaseNumber}
                formattedDate={formattedDate}
                isComplete={isComplete}
              />
            }
          >
            {children}
          </AccordionItem>
        </Box>
      </Box>
    </Reorder.Item>
  )
}
