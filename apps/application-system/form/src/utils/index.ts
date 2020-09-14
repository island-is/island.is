/**
 * Fixes references to SVG IDs.
 * Safari won't display SVG masks/fills e.g. referenced with
 * `url(#id)` when the <base> tag is on the page.
 *
 * More info:
 * - http://stackoverflow.com/a/18265336/796152
 * - http://www.w3.org/TR/SVG/linking.html
 * - https://www.jauernig-it.de/fixing-svg-url-with-base-href-for-safari/
 * - https://github.com/airbnb/lottie-web/issues/360#issuecomment-320243980
 *
 */
export function fixSvgUrls() {
  function fixForAttribute(attrib) {
    const baseUrl = window.location.href

      /**
       * Find all svg elements with the given attribute, e.g. for `mask`.
       * See: http://stackoverflow.com/a/23047888/796152
       */
    ;[].slice
      .call(document.querySelectorAll(`svg [${attrib}]`))
      // filter out all elements whose attribute doesn't start with `url(#`
      .filter(
        (element: SVGElement) =>
          element.getAttribute(attrib).indexOf('url(#') === 0,
      )
      // prepend `window.location` to the attrib's url() value, in order to make it an absolute IRI
      .forEach((element: SVGElement) => {
        const maskId = element
          .getAttribute(attrib)
          .replace('url(', '')
          .replace(')', '')
        element.setAttribute(attrib, `url(${baseUrl + maskId})`)
      })
  }

  fixForAttribute('fill')
  fixForAttribute('mask')
}
