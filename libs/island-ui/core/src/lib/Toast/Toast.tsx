import React from 'react'
import { ToastContainer, toast, ToastOptions } from 'react-toastify'
import * as toastStyles from './Toast.treat'

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean
    global?: boolean
  }
}

interface ToastProps {
  hideProgressBar?: boolean
}

const Toast: React.FC<ToastProps> = ({ hideProgressBar = false }) => {
  return (
    <div className={toastStyles.root}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={hideProgressBar}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <style jsx>
        {`
          @keyframes Toastify__trackProgress {
            0% {
              transform: scaleX(1);
            }
            100% {
              transform: scaleX(0);
            }
          }
          @keyframes Toastify__bounceInRight {
            from,
            60%,
            75%,
            90%,
            to {
              animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            }
            from {
              opacity: 0;
              transform: translate3d(3000px, 0, 0);
            }
            60% {
              opacity: 1;
              transform: translate3d(-25px, 0, 0);
            }
            75% {
              transform: translate3d(10px, 0, 0);
            }
            90% {
              transform: translate3d(-5px, 0, 0);
            }
            to {
              transform: none;
            }
          }
          @keyframes Toastify__bounceOutRight {
            20% {
              opacity: 1;
              transform: translate3d(-20px, 0, 0);
            }
            to {
              opacity: 0;
              transform: translate3d(2000px, 0, 0);
            }
          }
          @keyframes Toastify__bounceInLeft {
            from,
            60%,
            75%,
            90%,
            to {
              animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            }
            0% {
              opacity: 0;
              transform: translate3d(-3000px, 0, 0);
            }
            60% {
              opacity: 1;
              transform: translate3d(25px, 0, 0);
            }
            75% {
              transform: translate3d(-10px, 0, 0);
            }
            90% {
              transform: translate3d(5px, 0, 0);
            }
            to {
              transform: none;
            }
          }
          @keyframes Toastify__bounceOutLeft {
            20% {
              opacity: 1;
              transform: translate3d(20px, 0, 0);
            }
            to {
              opacity: 0;
              transform: translate3d(-2000px, 0, 0);
            }
          }
          @keyframes Toastify__bounceInUp {
            from,
            60%,
            75%,
            90%,
            to {
              animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            }
            from {
              opacity: 0;
              transform: translate3d(0, 3000px, 0);
            }
            60% {
              opacity: 1;
              transform: translate3d(0, -20px, 0);
            }
            75% {
              transform: translate3d(0, 10px, 0);
            }
            90% {
              transform: translate3d(0, -5px, 0);
            }
            to {
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes Toastify__bounceOutUp {
            20% {
              transform: translate3d(0, -10px, 0);
            }
            40%,
            45% {
              opacity: 1;
              transform: translate3d(0, 20px, 0);
            }
            to {
              opacity: 0;
              transform: translate3d(0, -2000px, 0);
            }
          }
          @keyframes Toastify__bounceInDown {
            from,
            60%,
            75%,
            90%,
            to {
              animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            }
            0% {
              opacity: 0;
              transform: translate3d(0, -3000px, 0);
            }
            60% {
              opacity: 1;
              transform: translate3d(0, 25px, 0);
            }
            75% {
              transform: translate3d(0, -10px, 0);
            }
            90% {
              transform: translate3d(0, 5px, 0);
            }
            to {
              transform: none;
            }
          }
          @keyframes Toastify__bounceOutDown {
            20% {
              transform: translate3d(0, 10px, 0);
            }
            40%,
            45% {
              opacity: 1;
              transform: translate3d(0, -20px, 0);
            }
            to {
              opacity: 0;
              transform: translate3d(0, 2000px, 0);
            }
          }
          @keyframes Toastify__zoomIn {
            from {
              opacity: 0;
              transform: scale3d(0.3, 0.3, 0.3);
            }
            50% {
              opacity: 1;
            }
          }
          @keyframes Toastify__zoomOut {
            from {
              opacity: 1;
            }
            50% {
              opacity: 0;
              transform: scale3d(0.3, 0.3, 0.3);
            }
            to {
              opacity: 0;
            }
          }
          @keyframes Toastify__flipIn {
            from {
              transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
              animation-timing-function: ease-in;
              opacity: 0;
            }
            40% {
              transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
              animation-timing-function: ease-in;
            }
            60% {
              transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
              opacity: 1;
            }
            80% {
              transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
            }
            to {
              transform: perspective(400px);
            }
          }
          @keyframes Toastify__flipOut {
            from {
              transform: perspective(400px);
            }
            30% {
              transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
              opacity: 1;
            }
            to {
              transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
              opacity: 0;
            }
          }
          @keyframes Toastify__slideInRight {
            from {
              transform: translate3d(110%, 0, 0);
              visibility: visible;
            }
            to {
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes Toastify__slideInLeft {
            from {
              transform: translate3d(-110%, 0, 0);
              visibility: visible;
            }
            to {
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes Toastify__slideInUp {
            from {
              transform: translate3d(0, 110%, 0);
              visibility: visible;
            }
            to {
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes Toastify__slideInDown {
            from {
              transform: translate3d(0, -110%, 0);
              visibility: visible;
            }
            to {
              transform: translate3d(0, 0, 0);
            }
          }
          @keyframes Toastify__slideOutRight {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              visibility: hidden;
              transform: translate3d(110%, 0, 0);
            }
          }
          @keyframes Toastify__slideOutLeft {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              visibility: hidden;
              transform: translate3d(-110%, 0, 0);
            }
          }
          @keyframes Toastify__slideOutDown {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              visibility: hidden;
              transform: translate3d(0, 500px, 0);
            }
          }
          @keyframes Toastify__slideOutUp {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              visibility: hidden;
              transform: translate3d(0, -500px, 0);
            }
          }
        `}
      </style>
    </div>
  )
}

export { toast }
export default Toast
