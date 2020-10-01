export const toastKeyframes = `
    @keyframes Toastify__trackProgress {
    0% {
        transform: scaleX(1);
    }
    100% {
        transform: scaleX(0);
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
`
