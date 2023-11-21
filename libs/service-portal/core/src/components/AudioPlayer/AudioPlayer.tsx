import { FC, useEffect, useRef, useState } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import format from 'date-fns/format'
import * as styles from './AudioPlayer.css'
import { ProgressBar } from '../ProgressBar/ProgressBar'
interface Props {
  url: string
  title?: string
}

export const AudioPlayer = ({ url, title }: Props) => {
  const [trackProgress, setTrackProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const audioProgress = trackProgress / duration ?? 0

  const toggleAudio = () => {
    if (hasEnded) {
      setHasEnded(false)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const setTimeChange = (durationPercent?: number) => {
    if (!durationPercent || !audioRef.current) {
      return
    }
    audioRef.current.currentTime = duration * durationPercent
  }

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    return format(date, 'm:ss')
  }

  console.log(isReady)
  if (!isReady) {
    //return <SkeletonLoader />
  }

  return (
    <>
      <SkeletonLoader display={!isReady ? 'inlineBlock' : 'none'} />
      <Box display={isReady ? 'block' : 'none'}>
        <GridContainer className={styles.container}>
          <GridRow className={styles.audio} align="center" alignItems="center">
            <GridColumn span="1/12">
              <Box display={'flex'} justifyContent="center">
                {
                  <button
                    title={
                      hasEnded
                        ? 'Replay audio'
                        : isPlaying
                        ? 'Pause audio'
                        : 'Play audio'
                    }
                    onClick={toggleAudio}
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
                }
              </Box>
            </GridColumn>
            <GridColumn span={'9/12'}>
              <Box display="flex" justifyContent="center">
                <Text variant="small">{`${formatTime(
                  trackProgress,
                )} / ${formatTime(duration)}`}</Text>
              </Box>
              <ProgressBar
                progress={audioProgress}
                onClick={setTimeChange}
                renderProgressBar={isReady}
                variant
              />
            </GridColumn>
            <GridColumn span="1/12">
              <Box display="flex" justifyContent="center">
                <button
                  title={isMuted ? 'Unmute audio' : 'Mute audio'}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  <Icon
                    icon={isMuted ? 'volumeMute' : 'volumeHigh'}
                    color="blue400"
                  />
                </button>
              </Box>
            </GridColumn>
            {/*}
    <GridColumn span="1/12">
      <Box display="flex" justifyContent="center">
        <Icon icon="ellipsisVertical" color="blue400" />
      </Box>
    </GridColumn>
      */}
          </GridRow>
        </GridContainer>
      </Box>
      <audio
        ref={audioRef}
        preload="auto"
        muted={isMuted}
        onEnded={() => setHasEnded(true)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTrackProgress(e.currentTarget.currentTime)}
        onCanPlay={() => setIsReady(true)}
        title={title}
      >
        <source type="audio/mp3" src={url} />
      </audio>
    </>
  )
}
