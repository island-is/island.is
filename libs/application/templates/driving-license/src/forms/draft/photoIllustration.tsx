import React, { FC } from 'react'

// Same frame as the quality photo in QualityPhoto.tsx. Þjóðskrá and RLS photos
// arrive at different pixel sizes, and a radio illustration given as a plain
// image is rendered at its natural size, so the options came out mismatched.
// A fixed frame keeps every option the same size; `contain` never crops the
// photo that will go on the licence.
export const PHOTO_FRAME_WIDTH = 191
export const PHOTO_FRAME_HEIGHT = 242

export const photoIllustration = (src: string): FC => {
  const PhotoIllustration: FC = () => (
    <img
      src={src}
      alt=""
      width={PHOTO_FRAME_WIDTH}
      height={PHOTO_FRAME_HEIGHT}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  )
  return PhotoIllustration
}
