import React, { FC } from 'react'

const IconCircleClose: FC<React.PropsWithChildren<unknown>> = () => (
  <svg
    height="24px"
    width="24px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
      fill="#00E4CA"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 12C7 11.7239 7.22386 11.5 7.5 11.5H16.5C16.7761 11.5 17 11.7239 17 12C17 12.2761 16.7761 12.5 16.5 12.5H7.5C7.22386 12.5 7 12.2761 7 12Z"
      fill="#00003C"
    />
  </svg>
)

export default IconCircleClose
