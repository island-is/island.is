import React from 'react'

interface Props {
  show: boolean
  title?: string
  helpText: string
}

const NoActiveConnections: React.FC<React.PropsWithChildren<Props>> = ({
  show,
  title,
  helpText,
  children,
}) => {
  if (!show) {
    return null
  }

  return (
    <div className="no-active-connections">
      <h3>{title}</h3>
      <div className="no-active-connections__help">
        <i className="icon__info"></i>
        {helpText}
      </div>
      {children}
    </div>
  )
}
export default NoActiveConnections
