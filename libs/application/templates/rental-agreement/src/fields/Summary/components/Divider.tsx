import { divider } from '../summaryStyles.css'

interface DividerProps {
  strong?: boolean
}

export const Divider = ({ strong }: DividerProps) => {
  return <div className={`${divider} ${strong && strong}`} />
}
