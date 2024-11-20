import { BffProblemTemplateModal } from './BffProblemTemplateModal'

type BffSessionExpiredModalProps = {
  /**
   * Reload callback
   */
  onReload(): void
}

/**
 * This screen is unfortunately not translated because at this point we don't have a user locale.
 */
export const BffNewUserSameSessionModal = ({
  onReload,
}: BffSessionExpiredModalProps) => (
  <BffProblemTemplateModal
    title="Nýr notandi"
    action={{
      prefixText: 'Þú hefur skipt um notanda. Viltu',
      text: 'endurhlaða',
      postfixText: 'síðunni?',
      onClick: onReload,
    }}
  />
)
