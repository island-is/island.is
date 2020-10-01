import { useState, useEffect, useRef } from 'react';

export function useHorizontalDragScroll() {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState(null);
    const ref = useRef(null);

    function onMouseDown(e) {
        setIsMouseDown(true);
        setLastMousePosition(e.clientX);
    }
    function onTouchStart(e) {
        setIsMouseDown(true);
        setLastMousePosition(e.touches[0].clientY);
    }

    useEffect(() => {
        function onMouseUp() {
            setIsMouseDown(false);
            setLastMousePosition(null);
        }
        function onMouseMove(e) {
            if (!isMouseDown) return;
            if (ref.current === null) return;
            if (lastMousePosition === null) return;

            ref.current.scrollLeft += lastMousePosition - e.clientX;
            setLastMousePosition(e.clientX);
        }
        function onTouchMove(e) {
            if (!isMouseDown) return;
            if (ref.current === null) return;
            if (lastMousePosition === null) return;

            ref.current.scrollLeft += lastMousePosition - e.touches[0].clientX;
            setLastMousePosition(e.touches[0].clientX);
        }

        window.addEventListener('touchend', onMouseUp);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('touchend', onMouseUp);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [isMouseDown, lastMousePosition]);

    return {
        ref,
        onMouseDown,
        onTouchStart
    };
}