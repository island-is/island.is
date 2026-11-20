import { FC, useEffect } from 'react'

interface Props {
  goToScreen?: (id: string) => void
}

const NavigateToConfirmation: FC<Props> = ({ goToScreen }) => {
  useEffect(() => {
    goToScreen?.('confirmation')
  }, [goToScreen])

  return null
}

export default NavigateToConfirmation
