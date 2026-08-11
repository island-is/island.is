import {
  ChangeEvent,
  FC,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useId,
} from 'react'
import ReactDOM from 'react-dom'
import FocusLock from 'react-focus-lock'
import cn from 'classnames'
import { motion } from 'motion/react'

import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  Icon,
  IconMapIcon,
  Text,
} from '@island.is/island-ui/core'
import { useKeyboardCombo } from '@island.is/judicial-system-web/src/utils/hooks/useKeyboardCombo/useKeyboardCombo'

import * as styles from './Modal.css'

export interface ModalButton {
  text: string
  onClick: () => void
  icon?: IconMapIcon
  isLoading?: boolean
  isDisabled?: boolean
  colorScheme?: 'default' | 'destructive'
  variant?: 'primary' | 'ghost'
  dataTestId?: string
}

interface FooterCheckbox {
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

interface ModalProps {
  title: string
  text?: string | ReactNode
  buttons?: ModalButton[]
  footerCheckbox?: FooterCheckbox
  onClose?: () => void
  errorMessage?: string
  children?: ReactNode
  loading?: boolean
  position?: 'center' | 'top' | 'bottom'
  footerJustifyContent?: BoxProps['justifyContent']
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  text,
  buttons,
  footerCheckbox,
  onClose,
  errorMessage,
  children,
  loading,
  footerJustifyContent = 'spaceBetween',
}: ModalProps) => {
  const modalVariants = {
    open: {
      translateY: 0,
      opacity: 1,
    },
    closed: {
      translateY: 50,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  const footerCheckboxId = useId()
  const titleId = useId()
  const lastButtonIndex = buttons ? buttons.length - 1 : -1

  useKeyboardCombo('Escape', () => {
    if (onClose && !loading) {
      onClose()
    }
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <FocusLock autoFocus={false}>
      <motion.div
        key="modal"
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="modal"
        layout
        transition={{
          layout: {
            duration: 0.3,
            ease: 'easeInOut',
          },
        }}
      >
        <motion.div
          className={styles.modalContainer}
          initial="closed"
          animate="open"
          exit="closed"
          layout="position"
          transition={{
            layout: {
              duration: 0.3,
              ease: 'easeInOut',
              type: 'tween',
            },
          }}
          variants={modalVariants}
        >
          {onClose && (
            <Box position="absolute" top={0} right={0}>
              <button
                className={styles.closeButton}
                onClick={onClose}
                disabled={loading}
                aria-label="Loka glugga"
              >
                <Icon icon="close" type="outline" color="blue400" />
              </button>
            </Box>
          )}
          <Box marginBottom={3}>
            <Text id={titleId} variant="h1" as="h2">
              {title}
            </Text>
          </Box>
          {text && (
            <Box marginBottom={4} className={styles.breakSpaces}>
              {
                // Check if text is a string or Element
                isValidElement(text) ? text : <Text>{text}</Text>
              }
            </Box>
          )}
          {children}
          <Box
            display="flex"
            alignItems="center"
            justifyContent={footerJustifyContent}
            columnGap={2}
            paddingBottom={6}
            paddingTop={2}
            background="white"
            position="sticky"
            bottom={0}
            zIndex={10}
          >
            {footerCheckbox && (
              <Checkbox
                data-testid="footerCheckbox"
                id={footerCheckboxId}
                name={footerCheckboxId}
                label={footerCheckbox.label}
                onChange={footerCheckbox.onChange}
                checked={footerCheckbox.checked}
                disabled={footerCheckbox.disabled || loading}
              />
            )}
            <Box display="flex" columnGap={3}>
              {buttons?.map((button, index) => {
                const isLastButton = index === lastButtonIndex
                const defaultTestId =
                  isLastButton &&
                  !(buttons.length === 1 && button.variant === 'ghost')
                    ? 'modalPrimaryButton'
                    : 'modalSecondaryButton'

                return (
                  <Button
                    key={`${button.text}-${index}`}
                    data-testid={button.dataTestId ?? defaultTestId}
                    variant={
                      button.variant === 'ghost' ? 'ghost' : undefined
                    }
                    onClick={button.onClick}
                    icon={button.icon}
                    loading={
                      (isLastButton && loading) || !!button.isLoading
                    }
                    disabled={loading || !!button.isDisabled}
                    colorScheme={
                      button.variant === 'ghost'
                        ? button.colorScheme
                        : button.colorScheme || 'default'
                    }
                  >
                    {button.text}
                  </Button>
                )
              })}
            </Box>
          </Box>
          {errorMessage && (
            <Box
              marginTop={1}
              role="alert"
              aria-live="assertive"
              data-testid="modalErrorMessage"
            >
              <Text variant="eyebrow" color="red600">
                {errorMessage}
              </Text>
            </Box>
          )}
        </motion.div>
      </motion.div>
    </FocusLock>
  )
}

export const ModalContainer = ({
  children,
  onClose,
  position = 'center',
}: ModalProps) => {
  const modalVariants = {
    open: {
      translateY: 0,
      opacity: 1,
    },
    closed: {
      translateY: 50,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  useKeyboardCombo('Escape', () => {
    onClose && onClose()
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.body.style.userSelect = 'none'

    return () => {
      document.body.style.overflow = ''
      document.body.style.userSelect = ''
    }
  }, [])

  return (
    <FocusLock autoFocus={false}>
      <motion.div
        key="modal"
        className={cn(styles.container, {
          [styles.alignItems[position]]: position,
        })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        data-testid="modal"
        onClick={() => {
          onClose && onClose()
        }}
      >
        <motion.div
          className={styles.modalContainerBare}
          initial="closed"
          animate="open"
          exit="closed"
          variants={modalVariants}
          onClick={(e) => {
            // Prevent click events from bubbling up to the container
            e.stopPropagation()
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </FocusLock>
  )
}

const ModalPortal = ({
  title,
  text,
  buttons,
  footerCheckbox,
  onClose,
  errorMessage,
  children,
  loading,
  footerJustifyContent,
}: ModalProps) => {
  const modalRoot =
    document.getElementById('modal') ?? document.createElement('div')

  return ReactDOM.createPortal(
    <Modal
      title={title}
      text={text}
      buttons={buttons}
      footerCheckbox={footerCheckbox}
      onClose={onClose}
      errorMessage={errorMessage}
      children={children}
      loading={loading}
      footerJustifyContent={footerJustifyContent}
    />,
    modalRoot,
  )
}

export default ModalPortal
