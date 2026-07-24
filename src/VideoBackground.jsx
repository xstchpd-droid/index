import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import primaryVideo from '../sucai/101653-video-1080p.mp4?url'
import secondaryVideo from '../sucai/coverr-moving-subway-3744-1080p.mp4?url'

const CROSSFADE_MS = 1600
const CROSSFADE_LEAD_SECONDS = CROSSFADE_MS / 1000 + 0.12

function VideoBackground() {
  const firstVideoRef = useRef(null)
  const secondVideoRef = useRef(null)
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = (event) => setReduceMotion(event.matches)

    motionPreference.addEventListener('change', updateMotionPreference)
    return () => motionPreference.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const videos = [firstVideoRef.current, secondVideoRef.current]
    if (videos.some((video) => !video)) return undefined

    let activeIndex = 0
    let isTransitioning = false
    let disposed = false
    let runningAnimations = []

    const resetVideo = (video, opacity) => {
      video.pause()
      video.currentTime = 0
      video.style.opacity = String(opacity)
    }

    resetVideo(videos[0], 1)
    resetVideo(videos[1], 0)

    if (reduceMotion) {
      return () => videos.forEach((video) => video.pause())
    }

    const finishTransition = (outgoing, incoming, nextIndex) => {
      if (disposed) return

      outgoing.pause()
      outgoing.currentTime = 0
      outgoing.style.opacity = '0'
      incoming.style.opacity = '1'
      activeIndex = nextIndex
      isTransitioning = false
      runningAnimations = []
    }

    const crossfadeToNext = async () => {
      if (disposed || isTransitioning) return
      isTransitioning = true

      const nextIndex = (activeIndex + 1) % videos.length
      const outgoing = videos[activeIndex]
      const incoming = videos[nextIndex]

      incoming.currentTime = 0
      incoming.style.opacity = '0'

      try {
        await incoming.play()
      } catch {
        isTransitioning = false
        outgoing.currentTime = 0
        await outgoing.play().catch(() => {})
        return
      }

      if (disposed) {
        incoming.pause()
        return
      }

      const outgoingAnimation = animate(outgoing, {
        opacity: [1, 0],
        duration: CROSSFADE_MS,
        ease: 'inOutSine',
      })
      const incomingAnimation = animate(incoming, {
        opacity: [0, 1],
        duration: CROSSFADE_MS,
        ease: 'inOutSine',
        onComplete: () => finishTransition(outgoing, incoming, nextIndex),
      })

      runningAnimations = [outgoingAnimation, incomingAnimation]
    }

    const handleTimeUpdate = (event) => {
      const activeVideo = videos[activeIndex]
      if (
        event.currentTarget !== activeVideo
        || !Number.isFinite(activeVideo.duration)
        || activeVideo.duration <= 0
      ) return

      if (activeVideo.duration - activeVideo.currentTime <= CROSSFADE_LEAD_SECONDS) {
        crossfadeToNext()
      }
    }

    const handleEnded = (event) => {
      if (event.currentTarget === videos[activeIndex]) crossfadeToNext()
    }

    videos.forEach((video) => {
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('ended', handleEnded)
    })

    videos[0].play().catch(() => {})

    return () => {
      disposed = true
      runningAnimations.forEach((animation) => animation.revert())
      videos.forEach((video) => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('ended', handleEnded)
        video.pause()
      })
    }
  }, [reduceMotion])

  return (
    <div className="video-background" aria-hidden="true">
      <video
        className="video-background__media"
        ref={firstVideoRef}
        src={primaryVideo}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
      />
      <video
        className="video-background__media"
        ref={secondVideoRef}
        src={secondaryVideo}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
      />
      <div className="video-background__scrim" />
    </div>
  )
}

export default VideoBackground
