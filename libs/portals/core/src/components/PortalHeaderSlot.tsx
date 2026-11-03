import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

type PortalHeaderSlotName = 'lead' | 'trail'

type PortalHeaderSlotContextValue = {
  active: boolean
  register: () => () => void
  targets: Record<PortalHeaderSlotName, HTMLElement | null>
  setTargets: Record<PortalHeaderSlotName, (el: HTMLElement | null) => void>
}

const PortalHeaderSlotContext = createContext<
  PortalHeaderSlotContextValue | undefined
>(undefined)

export const PortalHeaderSlotProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [activeCount, setActiveCount] = useState(0)
  const [lead, setLead] = useState<HTMLElement | null>(null)
  const [trail, setTrail] = useState<HTMLElement | null>(null)

  const register = useCallback(() => {
    setActiveCount((count) => count + 1)
    return () => setActiveCount((count) => count - 1)
  }, [])

  const value = useMemo(
    () => ({
      active: activeCount > 0,
      register,
      targets: { lead, trail },
      setTargets: { lead: setLead, trail: setTrail },
    }),
    [activeCount, register, lead, trail],
  )

  return (
    <PortalHeaderSlotContext.Provider value={value}>
      {children}
    </PortalHeaderSlotContext.Provider>
  )
}

const usePortalHeaderSlotContext = () => {
  const ctx = useContext(PortalHeaderSlotContext)
  if (!ctx) {
    throw new Error(
      'PortalHeaderSlot must be used within PortalHeaderSlotProvider',
    )
  }
  return ctx
}

export const usePortalHeaderSlotActive = () =>
  usePortalHeaderSlotContext().active

export const PortalHeaderSlotOutlet = ({
  name,
}: {
  name: PortalHeaderSlotName
}) => {
  const { setTargets } = usePortalHeaderSlotContext()

  return <div ref={setTargets[name]} style={{ display: 'contents' }} />
}

export const PortalHeaderSlot = ({
  lead,
  trail,
}: {
  lead?: ReactNode
  trail?: ReactNode
}) => {
  const { register, targets } = usePortalHeaderSlotContext()

  useLayoutEffect(() => register(), [register])

  return (
    <>
      {targets.lead && lead ? createPortal(lead, targets.lead) : null}
      {targets.trail && trail ? createPortal(trail, targets.trail) : null}
    </>
  )
}
