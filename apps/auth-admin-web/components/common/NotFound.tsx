import React from 'react'

interface Props {
  title: string
}

const NotFound: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  children,
}) => {
  return (
    <div className="not-found">
      <h3>{title}</h3>
      <div className="not-found__container__form">
        <div className="not-found__content">{children}</div>
      </div>
    </div>
  )
}

export default NotFound
