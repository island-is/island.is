import cn from 'classnames'

import * as styles from './CircleIcon.css'

interface CircleIconProps {
  loading?: boolean
}

export const CircleIcon = ({ loading = false }: CircleIconProps) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={styles.container}
    >
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="url(#paint0_radial_1755_5516)"
        className={cn(styles.breathe, { [styles.infiniteBreathe]: loading })}
      />
      <path
        d="M104 96C104 100.416 100.416 104 96 104C91.584 104 88 100.416 88 96C88 91.584 91.584 88 96 88C100.416 88 104 91.584 104 96Z"
        fill="#0090FF"
      />

      <g className={styles.slideIn}>
        <path
          d="M92 60C92 77.671 77.671 92 60 92C42.329 92 28 77.671 28 60C28 42.329 42.329 28 60 28C77.671 28 92 42.329 92 60Z"
          fill="#0061FF"
        />
        <path
          className={cn(styles.rotateCounterClockwise, {
            [styles.infiniteRotateCounterClockwise]: loading,
          })}
          d="M65.95 63.6377L62.06 62.1777C59.95 61.3877 58.28 59.7177 57.48 57.5977L56.02 53.7077C55.49 52.3077 53.52 52.3077 52.98 53.7077L51.52 57.5977C50.73 59.7077 49.06 61.3777 46.94 62.1777L43.05 63.6377C41.65 64.1677 41.65 66.1377 43.05 66.6777L46.94 68.1377C49.05 68.9277 50.72 70.5977 51.52 72.7177L52.98 76.6077C53.51 78.0077 55.48 78.0077 56.02 76.6077L57.48 72.7177C58.27 70.6077 59.94 68.9377 62.06 68.1377L65.95 66.6777C67.35 66.1477 67.35 64.1777 65.95 63.6377Z"
          fill="white"
        />
        <path
          className={cn(styles.rotateClockwise, {
            [styles.infiniteRotateClockwise]: loading,
          })}
          d="M78.3299 50.0275L75.8399 49.0875C74.4899 48.5775 73.4199 47.5075 72.9099 46.1575L71.9699 43.6675C71.6299 42.7775 70.3699 42.7775 70.0199 43.6675L69.0799 46.1575C68.5699 47.5075 67.4999 48.5775 66.1499 49.0875L63.6599 50.0275C62.7699 50.3675 62.7699 51.6275 63.6599 51.9675L66.1499 52.9075C67.4999 53.4175 68.5699 54.4875 69.0799 55.8375L70.0199 58.3275C70.3599 59.2175 71.6199 59.2175 71.9699 58.3275L72.9099 55.8375C73.4199 54.4875 74.4899 53.4175 75.8399 52.9075L78.3299 51.9675C79.2199 51.6275 79.2199 50.3675 78.3299 50.0275Z"
          fill="white"
        />
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_1755_5516"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(60 60) rotate(90) scale(58)"
        >
          <stop stopColor="#0061FF" />
          <stop offset="0.394231" stopColor="#74A9FF" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
