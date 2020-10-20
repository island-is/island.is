import React, { FC, useReducer, useRef, useState, useCallback } from 'react'
import { Button, Box } from '@island.is/island-ui/core'

import Cropper from 'react-easy-crop'
import getCroppedImg from './CropImage'
import { Icon } from '@island.is/island-ui/core'

interface ImageCropProps {
  imageSrc?: ArrayBuffer
  onCrop: Function
  onCancel: Function
}

const ImageCropper: FC<ImageCropProps> = ({
  imageSrc = null,
  onCrop,
  onCancel,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const dogImg =
    'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'

  // call upload from parent
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const cropImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
      )
      onCrop(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  const handleChange = (event: React.ChangeEvent<any>) => {
    setZoom(event.target.value)
  }

  if (imageSrc) {
    return (
      <Box display={'flex'} flexDirection="column">
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: '%100',
            height: '400px',
          }}
        >
          <Cropper
            style={{
              containerStyle: { background: 'white' },
              mediaStyle: {},
              cropAreaStyle: {},
            }}
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape={'round'}
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </Box>
        <Box display={'inlineFlex'} width={'full'}>
          <Icon type={'close'} />
          <input
            id="zoomInput"
            type="range"
            min="1"
            max="3"
            value={zoom}
            onChange={handleChange}
            step="0.1"
          />
          <Icon type={'plus'} />
          <button
            onClick={() => {
              setRotation(rotation - 90)
            }}
          >
            <Icon type={'arrowLeft'} />
          </button>
          <button
            onClick={() => {
              setRotation(rotation + 90)
            }}
          >
            <Icon type={'arrowRight'} />
          </button>
          <Button onClick={cropImage}>Crop</Button>
          <Button
            onClick={() => {
              onCancel()
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    )
  }
  return null
}

export default ImageCropper
