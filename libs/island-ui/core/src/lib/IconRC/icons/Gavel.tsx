import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgGavel = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="gavel_svg__ionicon"
      aria-labelledby={titleId}
      viewBox="0 0 32 32"
      fill="none"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.16709 26.0044C3.46918 26.1676 2.13045 27.6043 2.13045 29.3349V30.1186C2.13045 30.543 2.45697 30.8696 2.88145 30.8696H21.6891C22.1135 30.8696 22.4401 30.543 22.4401 30.1186V29.3349C22.4401 27.6043 21.1013 26.1676 19.4034 26.0044H5.16709ZM20.9054 29.3349C20.9054 28.3227 20.0891 27.5064 19.0769 27.5064H5.42831C4.41609 27.5064 3.59979 28.3227 3.59979 29.3349V29.3676L20.9054 29.3349Z"
        fill="currentColor"
      />
      <path
        d="M28.6405 19.7993L21.6529 13.5627C22.4692 12.5179 23.1223 11.4404 23.6121 10.3955C23.808 10.4608 24.0365 10.4934 24.2324 10.4934C24.8528 10.4934 25.4732 10.2649 25.9304 9.80775C26.3875 9.35062 26.6487 8.76288 26.6487 8.10984C26.6487 7.45679 26.3875 6.86906 25.9304 6.41193L21.3917 1.84063C20.4448 0.893719 18.9428 0.893719 17.9959 1.84063C17.5388 2.29776 17.2775 2.8855 17.2775 3.53854C17.2775 3.76711 17.3102 3.96302 17.3755 4.15893C15.6776 4.94258 13.9144 6.18336 12.3471 7.75066C10.7145 9.38327 9.50635 11.1138 8.75535 12.7791C7.93904 12.5505 7.05744 12.7464 6.43705 13.3995C5.49014 14.3464 5.49014 15.8484 6.43705 16.7953L10.9757 21.3666C11.4328 21.8237 12.0532 22.0523 12.6736 22.0523C13.294 22.0523 13.9144 21.8237 14.3715 21.3666C14.8286 20.9095 15.0899 20.3217 15.0899 19.6687C15.0899 19.4401 15.0572 19.2442 14.9919 19.0483C16.0368 18.5912 17.1143 17.9055 18.1592 17.0892L24.3631 24.0441C24.9181 24.6645 25.7018 25.0236 26.5181 25.0563C26.5508 25.0563 26.5834 25.0563 26.6161 25.0563C27.4324 25.0563 28.1834 24.7298 28.7384 24.1747C29.3262 23.5869 29.6527 22.8033 29.62 21.9543C29.62 21.138 29.2282 20.3544 28.6405 19.7993ZM19.0408 2.91815C19.204 2.75489 19.4326 2.65693 19.6612 2.65693C19.8897 2.65693 20.1183 2.75489 20.2815 2.91815L24.8202 7.45679C24.9834 7.62006 25.0814 7.84862 25.0814 8.07719C25.0814 8.30575 24.9834 8.53432 24.8202 8.69758C24.461 9.05675 23.9059 9.05675 23.5468 8.69758L19.0408 4.19158C18.8775 4.02832 18.7795 3.79976 18.7795 3.57119C18.7795 3.34263 18.8775 3.08141 19.0408 2.91815ZM13.294 20.2891C12.9348 20.6483 12.3797 20.6483 12.0206 20.2891L7.48191 15.7504C7.12274 15.3913 7.12274 14.8362 7.48191 14.477C7.64517 14.3137 7.87374 14.2158 8.1023 14.2158C8.33087 14.2158 8.55943 14.3137 8.72269 14.477L13.2613 19.0156C13.6532 19.3748 13.6532 19.9299 13.294 20.2891ZM14.1429 17.7422L10.0614 13.628C10.7145 12.126 11.8246 10.4608 13.4246 8.82818C14.9266 7.32619 16.6245 6.15071 18.1918 5.43236L22.306 9.54653C21.6203 11.1465 20.4448 12.8117 18.9102 14.3137C17.3102 15.979 15.6449 17.0892 14.1429 17.7422ZM27.6936 23.0972C27.3997 23.391 27.0079 23.5543 26.5834 23.5216C26.1589 23.5216 25.7671 23.3257 25.5059 23.0319L19.302 16.077C19.5305 15.8484 19.7918 15.6198 20.0203 15.3913C20.2489 15.1627 20.4775 14.9341 20.706 14.6729L27.6283 20.9095C27.9548 21.2033 28.118 21.5625 28.118 21.987C28.1507 22.4115 27.9874 22.8033 27.6936 23.0972Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.4159 25.8745C21.1795 26.0441 22.5705 27.5359 22.5705 29.3349V30.1186C22.5705 30.6151 22.1856 31 21.6891 31H2.88145C2.38492 31 2 30.6151 2 30.1186V29.3349C2 27.5359 3.39099 26.0441 5.15461 25.8745L5.16709 25.8733L19.4159 25.8745ZM28.7301 19.7045C29.3391 20.2796 29.7497 21.0951 29.7505 21.9518C29.7839 22.8378 29.4423 23.6553 28.8307 24.2669C28.2518 24.8458 27.4679 25.1867 26.6161 25.1867H26.5129C25.662 25.1527 24.8449 24.7783 24.2658 24.1311L18.1429 17.2669C17.1575 18.0278 16.1419 18.6734 15.1501 19.1208C15.1969 19.2935 15.2203 19.4702 15.2203 19.6687C15.2203 20.3586 14.9437 20.9789 14.4638 21.4588C13.9799 21.9427 13.3253 22.1827 12.6736 22.1827C12.0219 22.1827 11.3673 21.9427 10.8835 21.4588L6.34481 16.8875C5.34735 15.8901 5.34695 14.3063 6.34363 13.3084C6.97233 12.6475 7.8542 12.4312 8.682 12.6256C9.44319 10.9749 10.6453 9.26801 12.2548 7.65842C13.8002 6.11302 15.5365 4.88145 17.2179 4.08852C17.1707 3.91518 17.1471 3.7378 17.1471 3.53854C17.1471 2.84864 17.4237 2.22834 17.9037 1.74839C18.9015 0.750536 20.4861 0.750536 21.484 1.74839L26.0226 6.31969C26.5025 6.79963 26.7792 7.41994 26.7792 8.10984C26.7792 8.79974 26.5025 9.42004 26.0226 9.89999C25.5388 10.3838 24.8842 10.6239 24.2324 10.6239C24.0599 10.6239 23.8639 10.6003 23.6821 10.5523C23.2092 11.5421 22.592 12.5581 21.8306 13.5465L28.7301 19.7045ZM21.6529 13.5627L28.6405 19.7993C29.2282 20.3544 29.62 21.138 29.62 21.9543C29.6527 22.8033 29.3262 23.5869 28.7384 24.1747C28.1834 24.7298 27.4324 25.0563 26.6161 25.0563H26.5181C25.7018 25.0236 24.9181 24.6645 24.3631 24.0441L18.1592 17.0892C17.1143 17.9055 16.0368 18.5912 14.9919 19.0483C15.0572 19.2442 15.0899 19.4401 15.0899 19.6687C15.0899 20.3217 14.8286 20.9095 14.3715 21.3666C13.9144 21.8237 13.294 22.0523 12.6736 22.0523C12.0532 22.0523 11.4328 21.8237 10.9757 21.3666L6.43705 16.7953C5.49014 15.8484 5.49014 14.3464 6.43705 13.3995C7.05744 12.7464 7.93904 12.5505 8.75535 12.7791C9.50635 11.1138 10.7145 9.38327 12.3471 7.75066C13.9144 6.18336 15.6776 4.94258 17.3755 4.15893C17.3102 3.96302 17.2775 3.76711 17.2775 3.53854C17.2775 2.8855 17.5388 2.29776 17.9959 1.84063C18.9428 0.893719 20.4448 0.893719 21.3917 1.84063L25.9304 6.41193C26.3875 6.86906 26.6487 7.45679 26.6487 8.10984C26.6487 8.76288 26.3875 9.35062 25.9304 9.80775C25.4732 10.2649 24.8528 10.4934 24.2324 10.4934C24.0365 10.4934 23.808 10.4608 23.6121 10.3955C23.1223 11.4404 22.4692 12.5179 21.6529 13.5627ZM13.1691 19.1079L8.63046 14.5692C8.49064 14.4294 8.29487 14.3462 8.1023 14.3462C7.90974 14.3462 7.71396 14.4294 7.57415 14.5692C7.26592 14.8775 7.26592 15.35 7.57415 15.6582L12.1128 20.1968C12.421 20.5051 12.8935 20.5051 13.2017 20.1968C13.5091 19.8895 13.5096 19.4201 13.1732 19.1118L13.1691 19.1079ZM18.9102 14.3137C20.4448 12.8117 21.6203 11.1465 22.306 9.54653L18.1918 5.43236C16.6245 6.15071 14.9266 7.32619 13.4246 8.82818C11.8246 10.4608 10.7145 12.126 10.0614 13.628L14.1429 17.7422C15.6449 17.0892 17.3102 15.979 18.9102 14.3137ZM14.1725 17.5868C15.6363 16.9365 17.2563 15.8469 18.8161 14.2234L18.8189 14.2205C20.3176 12.7536 21.4685 11.1329 22.151 9.57604L18.164 5.58899C16.635 6.30341 14.9829 7.45444 13.5173 8.91995C11.9559 10.5133 10.8668 12.135 10.2166 13.5992L14.1725 17.5868ZM26.5934 23.3916C26.9764 23.421 27.3318 23.2744 27.6013 23.0049C27.8709 22.7354 28.0175 22.38 27.988 21.997L27.9872 21.987C27.9872 21.6009 27.8411 21.2765 27.541 21.0064L20.7163 14.8578C20.5143 15.0817 20.3129 15.2832 20.1139 15.4821L20.1126 15.4835C19.9967 15.5994 19.8729 15.7149 19.751 15.8287C19.6597 15.9139 19.5686 15.999 19.482 16.0828L25.6032 22.945C25.8416 23.2132 26.1989 23.3912 26.5834 23.3912L26.5934 23.3916ZM19.302 16.077L25.5059 23.0319C25.7671 23.3257 26.1589 23.5216 26.5834 23.5216C27.0079 23.5543 27.3997 23.391 27.6936 23.0972C27.9874 22.8033 28.1507 22.4115 28.118 21.987C28.118 21.5625 27.9548 21.2033 27.6283 20.9095L20.706 14.6729C20.6771 14.7059 20.6483 14.7384 20.6194 14.7704C20.4197 14.9919 20.22 15.1916 20.0203 15.3913C19.906 15.5055 19.7836 15.6198 19.6612 15.7341C19.5387 15.8484 19.4163 15.9627 19.302 16.077ZM19.4034 26.0044C21.1013 26.1676 22.4401 27.6043 22.4401 29.3349V30.1186C22.4401 30.543 22.1135 30.8696 21.6891 30.8696H2.88145C2.45697 30.8696 2.13045 30.543 2.13045 30.1186V29.3349C2.13045 27.6043 3.46918 26.1676 5.16709 26.0044H19.4034ZM20.7701 29.2047C20.7039 28.3257 19.9733 27.6368 19.0769 27.6368H5.42831C4.52105 27.6368 3.78353 28.3426 3.733 29.2369L20.7701 29.2047ZM20.9009 29.2045C20.8343 28.2535 20.0452 27.5064 19.0769 27.5064H5.42831C4.44891 27.5064 3.65292 28.2706 3.60234 29.2371C3.60065 29.2695 3.59979 29.3021 3.59979 29.3349V29.3676L20.9054 29.3349L20.9054 29.3278C20.9052 29.2863 20.9037 29.2452 20.9009 29.2045ZM19.6612 2.78738C19.4686 2.78738 19.2728 2.87058 19.133 3.01039C18.9966 3.1468 18.91 3.37369 18.91 3.57119C18.91 3.76375 18.9932 3.95953 19.133 4.09934L23.639 8.60534C23.9472 8.91357 24.4197 8.91357 24.7279 8.60534C24.8678 8.46553 24.951 8.26975 24.951 8.07719C24.951 7.88462 24.8678 7.68884 24.7279 7.54903L20.1893 3.01039C20.0495 2.87058 19.8537 2.78738 19.6612 2.78738ZM13.2613 19.0156L8.72269 14.477C8.55943 14.3137 8.33087 14.2158 8.1023 14.2158C7.87374 14.2158 7.64517 14.3137 7.48191 14.477C7.12274 14.8362 7.12274 15.3913 7.48191 15.7504L12.0206 20.2891C12.3797 20.6483 12.9348 20.6483 13.294 20.2891C13.6532 19.9299 13.6532 19.3748 13.2613 19.0156ZM19.6612 2.65693C19.4326 2.65693 19.204 2.75489 19.0408 2.91815C18.8775 3.08141 18.7795 3.34263 18.7795 3.57119C18.7795 3.79976 18.8775 4.02832 19.0408 4.19158L23.5468 8.69758C23.9059 9.05675 24.461 9.05675 24.8202 8.69758C24.9834 8.53432 25.0814 8.30575 25.0814 8.07719C25.0814 7.84862 24.9834 7.62006 24.8202 7.45679L20.2815 2.91815C20.1183 2.75489 19.8897 2.65693 19.6612 2.65693Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default SvgGavel