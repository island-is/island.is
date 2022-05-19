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
export function fixSvgUrls(_: string) {
  function fixForAttribute(attrib: string) {
    const baseUrl = window.location.href

    /**
     * Find all svg elements with the given attribute, e.g. for `mask`.
     * See: http://stackoverflow.com/a/23047888/796152
     */
    ;[].slice
      .call(document.querySelectorAll(`svg [${attrib}]`))
      // filter out all elements whose attribute doesn't start with `url(#`
      .filter((element: SVGElement) => {
        const attribute = element.getAttribute(attrib)
        if (attribute !== null) {
          return attribute.indexOf('url(#') === 0
        }
        return false
      })
      // prepend baseUrl to the attrib's url() value, in order to make it an absolute IRI
      .forEach((element: SVGElement) => {
        const attribute = element.getAttribute(attrib)
        if (attribute !== null) {
          const maskId = attribute.replace('url(', '').replace(')', '')
          element.setAttribute(attrib, `url(${baseUrl + maskId})`)
        }
      })
  }

  fixForAttribute('fill')
  fixForAttribute('mask')
}
