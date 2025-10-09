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
  Button,
  Checkbox,
  Icon,
  IconMapIcon,
  Text,
} from '@island.is/island-ui/core'
import { useKeyboardCombo } from '@island.is/judicial-system-web/src/utils/hooks/useKeyboardCombo/useKeyboardCombo'

import * as styles from './Modal.css'

interface ButtonProps {
  text: string
  icon?: IconMapIcon
  onClick: () => void
  isLoading?: boolean
  isDisabled?: boolean
  colorScheme?: 'default' | 'destructive'
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
  primaryButton?: ButtonProps
  secondaryButton?: ButtonProps
  footerCheckbox?: FooterCheckbox
  onClose?: () => void
  errorMessage?: string
  children?: ReactNode
  invertButtonColors?: boolean
  loading?: boolean
  position?: 'center' | 'top' | 'bottom'
}

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  text,
  primaryButton,
  secondaryButton,
  footerCheckbox,
  onClose,
  errorMessage,
  children,
  invertButtonColors,
  loading,
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
        data-testid="modal"
      >
        <motion.div
          className={styles.modalContainer}
          initial="closed"
          animate="open"
          exit="closed"
          variants={modalVariants}
        >
          {onClose && (
            <Box position="absolute" top={0} right={0}>
              <button
                className={styles.closeButton}
                onClick={onClose}
                disabled={loading}
              >
                <Icon icon="close" type="outline" color="blue400" />
              </button>
            </Box>
          )}
          <Box marginBottom={3}>
            <Text variant="h1" as="h2">
              {title}
            </Text>
          </Box>
          {text && (
            <Box marginBottom={6} className={styles.breakSpaces}>
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
            justifyContent="spaceBetween"
            columnGap={2}
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
              {secondaryButton && (
                <Button
                  data-testid="modalSecondaryButton"
                  variant={invertButtonColors ? undefined : 'ghost'}
                  onClick={secondaryButton.onClick}
                  loading={secondaryButton.isLoading}
                  disabled={loading || !!secondaryButton.isDisabled}
                >
                  {secondaryButton.text}
                </Button>
              )}
              {primaryButton && (
                <Button
                  data-testid="modalPrimaryButton"
                  variant={invertButtonColors ? 'ghost' : undefined}
                  onClick={primaryButton.onClick}
                  icon={primaryButton.icon}
                  loading={loading || !!primaryButton.isLoading}
                  disabled={loading || !!primaryButton.isDisabled}
                  colorScheme={primaryButton.colorScheme || 'default'}
                >
                  {primaryButton.text}
                </Button>
              )}
            </Box>
          </Box>
          {errorMessage && (
            <Box marginTop={1} data-testid="modalErrorMessage">
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
  primaryButton,
  secondaryButton,
  footerCheckbox,
  onClose,
  errorMessage,
  children,
  invertButtonColors,
  loading,
}: ModalProps) => {
  const modalRoot =
    document.getElementById('modal') ?? document.createElement('div')

  return ReactDOM.createPortal(
    <Modal
      title={title}
      text={text}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      footerCheckbox={footerCheckbox}
      onClose={onClose}
      errorMessage={errorMessage}
      children={children}
      invertButtonColors={invertButtonColors}
      loading={loading}
    />,
    modalRoot,
  )
}

export default ModalPortal
