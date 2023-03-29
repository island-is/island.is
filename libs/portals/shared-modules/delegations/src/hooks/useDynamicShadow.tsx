import { CSSProperties, useEffect, useRef, useState } from "react";

const style: CSSProperties = {
  height: '1px',
  backgroundColor: 'transparent',
}

const debugStyle: CSSProperties = {
  height: '1px',
  backgroundColor: 'springgreen',
}

const defaultOptions: IntersectionObserverInit = {
  threshold: [0, 1],
}

/**
 * This hooks works by observing if a tranparent element is inview or not.
 */
export const useDynamicShadow = (options?: IntersectionObserverInit, debug = false) => {
  // return {
  //   showShadow: true,
  //   pxProps: {

  //   }
  // }
  const ref = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false);
  const isObserving = useRef(false);

  useEffect(() => {
    if (debug) console.log('useDynamicShadow, useEffect', ref.current)

    if (!ref.current) return;
    if (isObserving.current) return;

    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].intersectionRatio === 0) {
        if (!showShadow) {
          if (debug) console.log('useDynamicShadow, 🔴 No intersection with screen')
          setShowShadow(true)
        }
      }

      else if (entries[0].intersectionRatio === 1) {

        // if (showShadow) {
        if (debug) console.log('useDynamicShadow, 🟢 Fully intersects with screen')
        setShowShadow(false)
        // }
      }
    }, { ...defaultOptions, ...options });

    if (debug) console.log('useDynamicShadow, 🔌 connect')
    isObserving.current = true;
    observer.observe(ref.current);

    // return () => {
    //   if (debug) console.log('useDynamicShadow, ✂️ disconnect')
    //   isObserving.current = false;
    //   observer.disconnect()
    // };

  }, [debug, options, showShadow]);


  return {
    showShadow,
    pxProps: {
      ref,
      style: debug ? debugStyle : style,
    }
  };
}