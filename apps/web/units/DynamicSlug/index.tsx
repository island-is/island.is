import React from 'react'

export const withDynamicSlug = (Component) => {
  return (props) => (
    <div>
      <div>ok</div>
      <Component {...props} />
    </div>
  )
}
