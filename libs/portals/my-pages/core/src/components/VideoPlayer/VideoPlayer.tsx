import { FC, useEffect, useRef, useState } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import * as styles from './VideoPlayer.css'
import cn from 'classnames'
import { ProgressBar } from '../ProgressBar/ProgressBar'

interface Props {
  url: string
  title?: string
}

export const VideoPlayer: FC<Props> = ({ url, title }) => {
  const [trackProgress, setTrackProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  const progress = trackProgress / duration || 0

  const toggleVideo = () => {
    if (hasEnded) {
      setHasEnded(false)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        videoRef.current.play()
      }
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    } else {
      containerRef?.current?.requestFullscreen()
      setIsFullscreen(true)
    }
  }

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      setIsFullscreen(true)
    } else {
      setIsFullscreen(false)
    }
  })

  const setTimeChange = (durationPercent?: number) => {
    if (!durationPercent || !videoRef.current) {
      return
    }
    videoRef.current.currentTime = duration * durationPercent

    if (hasEnded) {
      setHasEnded(false)
      setIsPlaying(true)
      videoRef.current.play()
    }
  }

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    return format(date, 'm:ss')
  }

  return (
    <Box
      ref={containerRef}
      className={styles.container}
      position="relative"
      overflow="hidden"
      borderRadius="large"
      borderWidth="large"
      borderStyle="solid"
      borderColor="blue200"
    >
      <video
        className={cn(styles.videoPlayer, {
          [styles.hidden]: !isReady,
        })}
        ref={videoRef}
        preload="metadata"
        muted={isMuted}
        onEnded={() => setHasEnded(true)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTrackProgress(e.currentTarget.currentTime)}
        onCanPlay={() => setIsReady(true)}
        title={title}
      >
        <source type="video/mp4" src={url} />
      </video>
      {!isReady && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          height="full"
        >
          <LoadingDots size="large" />
        </Box>
      )}
      {isReady && (
        <GridContainer className={cn(styles.controls)}>
          <GridRow className={styles.video} align="center" alignItems="center">
            <GridColumn
              span={['4/12', '3/12', '4/12', '3/12', '3/12']}
              className={styles.audioControl}
            >
              <Box
                display="flex"
                justifyContent="spaceAround"
                alignItems="center"
                columnGap={'p2'}
              >
                {isReady && (
                  <button
                    disabled={!isReady}
                    title={
                      hasEnded
                        ? 'Replay video'
                        : isPlaying
                        ? 'Pause video'
                        : 'Play video'
                    }
                    aria-label={
                      hasEnded
                        ? 'Replay video'
                        : isPlaying
                        ? 'Pause video'
                        : 'Play video'
                    }
                    onClick={toggleVideo}
                  >
                    <Icon
                      icon={
                        hasEnded
                          ? 'reload'
                          : isPlaying
                          ? 'pauseCircle'
                          : 'playCircle'
                      }
                      size="large"
                      color="blue400"
                    />
                  </button>
                )}
                <Text variant="small" textAlign="center">
                  {`${formatTime(trackProgress)} / ${formatTime(duration)}`}
                </Text>
              </Box>
            </GridColumn>
            <GridColumn
              span={['6/12', '7/12', '6/12', '6/12', '7/12']}
              className={styles.audioControl}
            >
              <ProgressBar
                id="progress-bar-video"
                progress={progress}
                onClick={setTimeChange}
                renderProgressBar={isReady}
                variant
              />
            </GridColumn>
            <GridColumn span="1/12" className={styles.audioControl}>
              <Box display="flex" justifyContent="center">
                <button
                  title={isMuted ? 'Unmute video' : 'Mute video'}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  <Icon
                    icon={isMuted ? 'volumeMute' : 'volumeHigh'}
                    color="blue400"
                  />
                </button>
              </Box>
            </GridColumn>
            <GridColumn span="1/12" className={styles.audioControl}>
              <Box display="flex" justifyContent="center">
                <button
                  title={isFullscreen ? 'Close fullscreen' : 'Open fullscreen'}
                  aria-label={
                    isFullscreen ? 'Close fullscreen' : 'Open fullscreen'
                  }
                  onClick={toggleFullscreen}
                >
                  <Icon icon="expand" color="blue400" />
                </button>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
    </Box>
  )
}
