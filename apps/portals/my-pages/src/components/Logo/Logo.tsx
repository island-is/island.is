import React, { forwardRef } from 'react'

interface LogoProps {
  width?: number
  solid?: boolean
  solidColor?: string
  iconOnly?: boolean
  title?: string
}

export const Logo = forwardRef<SVGSVGElement, LogoProps>(
  ({ iconOnly = false }) =>
    iconOnly ? (
      <svg
        width="81"
        height="46"
        viewBox="0 0 81 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="path-1-inside-1" fill="white">
          <rect y="19" width="27" height="27" rx="3" />
        </mask>
        <rect
          y="19"
          width="27"
          height="27"
          rx="3"
          stroke="url(#paint0_linear)"
          strokeWidth="14"
          mask="url(#path-1-inside-1)"
        />
        <circle cx="13.5" cy="32.5" r="3.5" fill="url(#paint1_linear)" />
        <rect x="34" width="47" height="29" rx="8" fill="#f2f7ff" />
        <path
          d="M44.0015 9.728H48.5235C48.9248 9.728 49.2842 9.78867 49.6015 9.91C49.9282 10.0313 50.2035 10.1993 50.4275 10.414C50.6515 10.6287 50.8195 10.8947 50.9315 11.212C51.0528 11.52 51.1135 11.8607 51.1135 12.234C51.1135 12.6073 51.0622 12.9247 50.9595 13.186C50.8662 13.438 50.7355 13.648 50.5675 13.816C50.4088 13.984 50.2222 14.11 50.0075 14.194C49.8022 14.278 49.5875 14.3247 49.3635 14.334V14.418C49.5782 14.418 49.8068 14.46 50.0495 14.544C50.3015 14.628 50.5302 14.7633 50.7355 14.95C50.9502 15.1273 51.1275 15.3607 51.2675 15.65C51.4075 15.93 51.4775 16.28 51.4775 16.7C51.4775 17.092 51.4122 17.4607 51.2815 17.806C51.1602 18.142 50.9875 18.436 50.7635 18.688C50.5395 18.94 50.2735 19.1407 49.9655 19.29C49.6575 19.43 49.3215 19.5 48.9575 19.5H44.0015V9.728ZM45.8495 17.932H48.4255C48.7802 17.932 49.0555 17.8433 49.2515 17.666C49.4475 17.4793 49.5455 17.2133 49.5455 16.868V16.392C49.5455 16.0467 49.4475 15.7807 49.2515 15.594C49.0555 15.4073 48.7802 15.314 48.4255 15.314H45.8495V17.932ZM45.8495 13.802H48.1315C48.4675 13.802 48.7288 13.7133 48.9155 13.536C49.1022 13.3493 49.1955 13.0927 49.1955 12.766V12.332C49.1955 12.0053 49.1022 11.7533 48.9155 11.576C48.7288 11.3893 48.4675 11.296 48.1315 11.296H45.8495V13.802ZM56.1267 19.668C55.5854 19.668 55.1001 19.5793 54.6707 19.402C54.2507 19.2153 53.8914 18.9587 53.5927 18.632C53.3034 18.296 53.0794 17.8947 52.9207 17.428C52.7621 16.952 52.6827 16.42 52.6827 15.832C52.6827 15.2533 52.7574 14.7307 52.9067 14.264C53.0654 13.7973 53.2894 13.4007 53.5787 13.074C53.8681 12.738 54.2227 12.4813 54.6427 12.304C55.0627 12.1173 55.5387 12.024 56.0707 12.024C56.6401 12.024 57.1347 12.122 57.5547 12.318C57.9747 12.514 58.3201 12.78 58.5907 13.116C58.8614 13.452 59.0621 13.844 59.1927 14.292C59.3327 14.7307 59.4027 15.202 59.4027 15.706V16.294H54.5447V16.476C54.5447 17.008 54.6941 17.4373 54.9927 17.764C55.2914 18.0813 55.7347 18.24 56.3227 18.24C56.7707 18.24 57.1347 18.1467 57.4147 17.96C57.7041 17.7733 57.9607 17.5353 58.1847 17.246L59.1507 18.324C58.8521 18.744 58.4414 19.0753 57.9187 19.318C57.4054 19.5513 56.8081 19.668 56.1267 19.668ZM56.0987 13.368C55.6227 13.368 55.2447 13.5267 54.9647 13.844C54.6847 14.1613 54.5447 14.572 54.5447 15.076V15.188H57.5407V15.062C57.5407 14.558 57.4147 14.152 57.1627 13.844C56.9201 13.5267 56.5654 13.368 56.0987 13.368ZM63.2614 19.5C62.6454 19.5 62.174 19.3413 61.8474 19.024C61.53 18.6973 61.3714 18.2353 61.3714 17.638V13.62H60.2934V12.192H60.8534C61.124 12.192 61.306 12.1313 61.3994 12.01C61.502 11.8793 61.5534 11.688 61.5534 11.436V10.19H63.1634V12.192H64.6614V13.62H63.1634V18.072H64.5494V19.5H63.2614ZM71.5917 19.5C71.1997 19.5 70.887 19.388 70.6537 19.164C70.4297 18.9307 70.2897 18.6227 70.2337 18.24H70.1497C70.0284 18.716 69.781 19.0753 69.4077 19.318C69.0344 19.5513 68.5724 19.668 68.0217 19.668C67.275 19.668 66.701 19.472 66.2997 19.08C65.8984 18.688 65.6977 18.1653 65.6977 17.512C65.6977 16.756 65.9684 16.196 66.5097 15.832C67.051 15.4587 67.821 15.272 68.8197 15.272H70.0657V14.74C70.0657 14.3293 69.9584 14.012 69.7437 13.788C69.529 13.564 69.1837 13.452 68.7077 13.452C68.2877 13.452 67.947 13.5453 67.6857 13.732C67.4337 13.9093 67.219 14.124 67.0417 14.376L65.9777 13.424C66.2484 13.004 66.6077 12.668 67.0557 12.416C67.5037 12.1547 68.0964 12.024 68.8337 12.024C69.823 12.024 70.5744 12.248 71.0877 12.696C71.601 13.144 71.8577 13.788 71.8577 14.628V18.072H72.5857V19.5H71.5917ZM68.6237 18.366C69.025 18.366 69.3657 18.2773 69.6457 18.1C69.9257 17.9227 70.0657 17.6613 70.0657 17.316V16.35H68.9177C67.9844 16.35 67.5177 16.6487 67.5177 17.246V17.484C67.5177 17.7827 67.611 18.0067 67.7977 18.156C67.9937 18.296 68.269 18.366 68.6237 18.366Z"
          fill="#0061FF"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="1.00761"
            y1="19.922"
            x2="26.161"
            y2="44.9929"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0161FD" />
            <stop offset="0.25" stopColor="#3F46D2" />
            <stop offset="0.51" stopColor="#812EA4" />
            <stop offset="0.77" stopColor="#C21578" />
            <stop offset="1" stopColor="#FD0050" />
          </linearGradient>
          <linearGradient
            id="paint1_linear"
            x1="10.2612"
            y1="29.239"
            x2="16.7825"
            y2="35.7389"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0161FD" />
            <stop offset="0.25" stopColor="#3F46D2" />
            <stop offset="0.51" stopColor="#812EA4" />
            <stop offset="0.77" stopColor="#C21578" />
            <stop offset="1" stopColor="#FD0050" />
          </linearGradient>
        </defs>
      </svg>
    ) : (
      <svg
        width="223"
        height="38"
        viewBox="0 0 223 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M45.369 21.3724L41.8751 21.3675C41.5914 21.3671 41.361 21.5969 41.3606 21.8806L41.3402 36.6114C41.3398 36.8952 41.5695 37.1255 41.8532 37.1259L45.3471 37.1308C45.6309 37.1312 45.8613 36.9014 45.8617 36.6177L45.8821 21.8869C45.8825 21.6031 45.6528 21.3728 45.369 21.3724Z"
          fill="#00003C"
        />
        <path
          d="M69.9227 13.7305L66.4288 13.7257C66.1451 13.7253 65.9147 13.955 65.9143 14.2388L65.8832 36.6432C65.8828 36.927 66.1125 37.1573 66.3963 37.1577L69.8902 37.1626C70.174 37.163 70.4043 36.9333 70.4047 36.6495L70.4358 14.2451C70.4362 13.9613 70.2065 13.7309 69.9227 13.7305Z"
          fill="#00003C"
        />
        <path
          d="M100.093 21.3792C97.3181 21.3754 95.9822 21.3974 92.3855 21.4378C92.3157 21.4277 92.2445 21.434 92.1776 21.4562C92.1107 21.4784 92.0498 21.5159 91.9999 21.5657C91.95 21.6155 91.9123 21.6762 91.89 21.7431C91.8676 21.8099 91.8611 21.8811 91.871 21.9509L91.8505 36.6817C91.8404 36.7515 91.8467 36.8226 91.8689 36.8896C91.8911 36.9565 91.9286 37.0173 91.9784 37.0672C92.0282 37.1172 92.0889 37.1548 92.1558 37.1772C92.2226 37.1996 92.2938 37.2061 92.3636 37.1962L95.8575 37.201C95.9273 37.2111 95.9985 37.2048 96.0654 37.1826C96.1323 37.1604 96.1931 37.123 96.2431 37.0732C96.293 37.0234 96.3306 36.9627 96.353 36.8958C96.3754 36.8289 96.3819 36.7578 96.372 36.688L96.3887 24.6959L98.7187 24.6991C101.391 24.7029 102.006 25.4589 102.002 28.3028L101.99 36.6958C101.98 36.7655 101.987 36.8367 102.009 36.9036C102.031 36.9706 102.069 37.0314 102.118 37.0813C102.168 37.1313 102.229 37.1689 102.296 37.1913C102.363 37.2137 102.434 37.2202 102.504 37.2103L105.997 37.2151C106.067 37.2252 106.138 37.2189 106.205 37.1967C106.272 37.1745 106.333 37.137 106.383 37.0873C106.433 37.0375 106.471 36.9767 106.493 36.9099C106.515 36.843 106.522 36.7719 106.512 36.702L106.525 27.2456C106.532 22.5185 103.109 21.3834 100.093 21.3792Z"
          fill="#00003C"
        />
        <path
          d="M124.313 13.9016L120.817 13.8967C120.475 13.8962 120.302 14.068 120.302 14.5484L120.292 21.3737L116.729 21.3687C113.383 21.3641 109.843 22.3868 109.833 29.3411C109.824 36.1234 113.352 37.2921 116.707 37.2968C121.059 37.3028 122.428 37.2737 124.28 37.2404C124.35 37.2495 124.421 37.2425 124.487 37.2199C124.554 37.1974 124.614 37.1599 124.664 37.1103C124.713 37.0607 124.751 37.0004 124.774 36.934C124.797 36.8676 124.804 36.7969 124.795 36.7273L124.826 14.5619C124.826 14.0815 124.655 13.902 124.313 13.9016ZM120.275 34.0134L117.603 34.0097C115.239 34.0064 114.35 32.8748 114.354 29.4143C114.359 25.7842 115.252 24.722 117.616 24.7253L120.288 24.729L120.275 34.0134Z"
          fill="#00003C"
        />
        <path
          d="M132.587 37.3554C134.268 37.2532 135.548 35.8076 135.446 34.1265C135.343 32.4455 133.898 31.1656 132.217 31.2679C130.536 31.3701 129.256 32.8157 129.358 34.4968C129.46 36.1778 130.906 37.4577 132.587 37.3554Z"
          fill="#FF0050"
        />
        <path
          d="M43.6278 17.4986C45.312 17.501 46.6791 16.1376 46.6815 14.4535C46.6838 12.7694 45.3204 11.4022 43.6363 11.3999C41.9522 11.3975 40.585 12.7609 40.5827 14.445C40.5803 16.1292 41.9437 17.4963 43.6278 17.4986Z"
          fill="#00003C"
        />
        <path
          d="M81.7992 21.3539C78.9911 21.35 77.4497 21.3837 75.5999 21.4146C75.528 21.4079 75.4555 21.4177 75.3879 21.4431C75.3202 21.4685 75.2593 21.5089 75.2095 21.5613C75.1597 21.6137 75.1225 21.6767 75.1006 21.7455C75.0787 21.8143 75.0726 21.8872 75.083 21.9587L75.0799 24.1502C75.0697 24.2202 75.0761 24.2916 75.0984 24.3587C75.1207 24.4259 75.1584 24.4869 75.2085 24.5369C75.2586 24.5868 75.3196 24.6244 75.3868 24.6466C75.454 24.6688 75.5254 24.675 75.5954 24.6647L80.2197 24.6711C82.8915 24.6748 83.5763 25.431 83.5745 26.6976L83.5735 27.4145L79.1524 27.4084C75.5916 27.4034 73.499 28.4974 73.5274 32.1276C73.5579 35.9991 75.6114 37.2351 79.1746 37.2401C84.2792 37.2472 85.7179 37.2109 87.5677 37.1848C87.6374 37.1944 87.7083 37.1877 87.775 37.1654C87.8417 37.143 87.9023 37.1055 87.9521 37.0558C88.002 37.0061 88.0396 36.9456 88.0622 36.879C88.0847 36.8124 88.0916 36.7414 88.0822 36.6717L88.0958 26.8735C88.0947 22.493 84.6765 21.3579 81.7992 21.3539ZM83.5644 33.9626L80.1375 33.9578C78.7323 33.9559 78.0828 33.5439 78.0513 32.1387C78.0198 30.7334 78.7038 30.3257 80.1091 30.3277L83.5695 30.3325L83.5644 33.9626Z"
          fill="#00003C"
        />
        <path
          d="M59.1104 28.3458L55.0353 27.0043C54.1109 26.6947 53.8412 26.4195 53.8422 25.7336C53.8432 24.945 54.2548 24.6038 55.5548 24.6056L61.4457 24.6138C61.5164 24.6243 61.5886 24.6179 61.6563 24.5952C61.7241 24.5725 61.7856 24.5341 61.8357 24.4832C61.8859 24.4322 61.9233 24.3702 61.9449 24.3021C61.9665 24.2339 61.9718 24.1617 61.9602 24.0911L61.9633 21.8734C61.9724 21.8038 61.9654 21.7331 61.9428 21.6666C61.9203 21.6001 61.8828 21.5397 61.8332 21.49C61.7837 21.4403 61.7234 21.4027 61.657 21.3799C61.5906 21.3572 61.5198 21.35 61.4502 21.3589C59.6006 21.3205 58.1046 21.2873 54.907 21.2829C51.7095 21.2784 49.4235 22.2312 49.4191 25.3857L49.4183 25.9665C49.4158 27.7492 50.5439 29.395 52.8729 30.1869L56.776 31.4924C57.8055 31.8379 57.9701 32.0437 57.9693 32.6889C57.968 33.5803 57.5566 33.8546 56.5983 33.8532L50.1625 33.8443C50.0927 33.8342 50.0216 33.8405 49.9546 33.8627C49.8877 33.8849 49.8269 33.9224 49.777 33.9722C49.727 34.022 49.6894 34.0827 49.667 34.1496C49.6446 34.2164 49.6381 34.2876 49.648 34.3574L49.6449 36.5823C49.6348 36.6521 49.6411 36.7233 49.6633 36.7902C49.6855 36.8571 49.723 36.918 49.7728 36.9679C49.8226 37.0178 49.8833 37.0555 49.9502 37.0778C50.017 37.1002 50.0882 37.1067 50.158 37.0968C52.0077 37.1352 53.377 37.1706 56.5984 37.1751C60.5034 37.1805 62.4237 36.2583 62.4281 33.0392L62.429 32.4561C62.431 30.9529 61.8503 29.2386 59.1104 28.3458Z"
          fill="#00003C"
        />
        <path
          d="M144.032 21.5096L140.538 21.5047C140.254 21.5043 140.024 21.7341 140.024 22.0178L140.003 36.7486C140.003 37.0324 140.233 37.2627 140.516 37.2631L144.01 37.268C144.294 37.2684 144.524 37.0386 144.525 36.7549L144.545 22.0241C144.546 21.7403 144.316 21.51 144.032 21.5096Z"
          fill="#00003C"
        />
        <path
          d="M142.508 17.6158C144.188 17.4986 145.455 16.0417 145.338 14.3616C145.221 12.6816 143.764 11.4146 142.084 11.5318C140.404 11.649 139.137 13.106 139.254 14.786C139.371 16.4661 140.828 17.733 142.508 17.6158Z"
          fill="#00003C"
        />
        <path
          d="M157.776 28.483L153.701 27.1415C152.777 26.8319 152.507 26.5567 152.508 25.8708C152.509 25.0822 152.921 24.741 154.223 24.7428L160.116 24.751C160.187 24.7607 160.258 24.7536 160.325 24.7306C160.393 24.7075 160.453 24.669 160.503 24.6182C160.552 24.5674 160.589 24.5056 160.611 24.4379C160.632 24.3702 160.637 24.2984 160.626 24.2284L160.629 22.0106C160.638 21.941 160.631 21.8703 160.609 21.8038C160.586 21.7374 160.549 21.677 160.499 21.6273C160.449 21.5776 160.389 21.5399 160.323 21.5172C160.256 21.4944 160.186 21.4872 160.116 21.4961C158.266 21.4577 156.77 21.4245 153.573 21.4201C150.375 21.4157 148.08 22.3708 148.075 25.5229L148.075 26.1037C148.072 27.8865 149.2 29.5322 151.529 30.3241L155.442 31.6296C156.469 31.9751 156.636 32.1809 156.635 32.8261C156.634 33.7175 156.222 33.9918 155.262 33.9905L148.826 33.9815C148.755 33.9696 148.682 33.9746 148.614 33.9963C148.545 34.018 148.483 34.0557 148.431 34.1063C148.38 34.1569 148.342 34.2189 148.319 34.2872C148.297 34.3556 148.291 34.4283 148.302 34.4994L148.299 36.7243C148.289 36.794 148.296 36.8649 148.318 36.9316C148.341 36.9983 148.378 37.0589 148.428 37.1087C148.477 37.1586 148.538 37.1962 148.605 37.2188C148.671 37.2413 148.742 37.2482 148.812 37.2388C150.662 37.2772 152.033 37.3126 155.252 37.3171C159.16 37.3225 161.078 36.4003 161.082 33.1812L161.083 32.5933C161.094 31.0902 160.516 29.3759 157.776 28.483Z"
          fill="#00003C"
        />
        <mask id="path-12-inside-1" fill="white">
          <rect y="10" width="27" height="27" rx="3" />
        </mask>
        <rect
          y="10"
          width="27"
          height="27"
          rx="3"
          stroke="url(#paint_large0_linear)"
          strokeWidth="14"
          mask="url(#path-12-inside-1)"
        />
        <circle cx="13.5" cy="23.5" r="3.5" fill="url(#paint_large1_linear)" />
        <rect x="176" width="47" height="29" rx="8" fill="#F2F7FF" />
        <path
          d="M186.002 9.728H190.524C190.925 9.728 191.284 9.78867 191.602 9.91C191.928 10.0313 192.204 10.1993 192.428 10.414C192.652 10.6287 192.82 10.8947 192.932 11.212C193.053 11.52 193.114 11.8607 193.114 12.234C193.114 12.6073 193.062 12.9247 192.96 13.186C192.866 13.438 192.736 13.648 192.568 13.816C192.409 13.984 192.222 14.11 192.008 14.194C191.802 14.278 191.588 14.3247 191.364 14.334V14.418C191.578 14.418 191.807 14.46 192.05 14.544C192.302 14.628 192.53 14.7633 192.736 14.95C192.95 15.1273 193.128 15.3607 193.268 15.65C193.408 15.93 193.478 16.28 193.478 16.7C193.478 17.092 193.412 17.4607 193.282 17.806C193.16 18.142 192.988 18.436 192.764 18.688C192.54 18.94 192.274 19.1407 191.966 19.29C191.658 19.43 191.322 19.5 190.958 19.5H186.002V9.728ZM187.85 17.932H190.426C190.78 17.932 191.056 17.8433 191.252 17.666C191.448 17.4793 191.546 17.2133 191.546 16.868V16.392C191.546 16.0467 191.448 15.7807 191.252 15.594C191.056 15.4073 190.78 15.314 190.426 15.314H187.85V17.932ZM187.85 13.802H190.132C190.468 13.802 190.729 13.7133 190.916 13.536C191.102 13.3493 191.196 13.0927 191.196 12.766V12.332C191.196 12.0053 191.102 11.7533 190.916 11.576C190.729 11.3893 190.468 11.296 190.132 11.296H187.85V13.802ZM198.127 19.668C197.585 19.668 197.1 19.5793 196.671 19.402C196.251 19.2153 195.891 18.9587 195.593 18.632C195.303 18.296 195.079 17.8947 194.921 17.428C194.762 16.952 194.683 16.42 194.683 15.832C194.683 15.2533 194.757 14.7307 194.907 14.264C195.065 13.7973 195.289 13.4007 195.579 13.074C195.868 12.738 196.223 12.4813 196.643 12.304C197.063 12.1173 197.539 12.024 198.071 12.024C198.64 12.024 199.135 12.122 199.555 12.318C199.975 12.514 200.32 12.78 200.591 13.116C200.861 13.452 201.062 13.844 201.193 14.292C201.333 14.7307 201.403 15.202 201.403 15.706V16.294H196.545V16.476C196.545 17.008 196.694 17.4373 196.993 17.764C197.291 18.0813 197.735 18.24 198.323 18.24C198.771 18.24 199.135 18.1467 199.415 17.96C199.704 17.7733 199.961 17.5353 200.185 17.246L201.151 18.324C200.852 18.744 200.441 19.0753 199.919 19.318C199.405 19.5513 198.808 19.668 198.127 19.668ZM198.099 13.368C197.623 13.368 197.245 13.5267 196.965 13.844C196.685 14.1613 196.545 14.572 196.545 15.076V15.188H199.541V15.062C199.541 14.558 199.415 14.152 199.163 13.844C198.92 13.5267 198.565 13.368 198.099 13.368ZM205.261 19.5C204.645 19.5 204.174 19.3413 203.847 19.024C203.53 18.6973 203.371 18.2353 203.371 17.638V13.62H202.293V12.192H202.853C203.124 12.192 203.306 12.1313 203.399 12.01C203.502 11.8793 203.553 11.688 203.553 11.436V10.19H205.163V12.192H206.661V13.62H205.163V18.072H206.549V19.5H205.261ZM213.592 19.5C213.2 19.5 212.887 19.388 212.654 19.164C212.43 18.9307 212.29 18.6227 212.234 18.24H212.15C212.028 18.716 211.781 19.0753 211.408 19.318C211.034 19.5513 210.572 19.668 210.022 19.668C209.275 19.668 208.701 19.472 208.3 19.08C207.898 18.688 207.698 18.1653 207.698 17.512C207.698 16.756 207.968 16.196 208.51 15.832C209.051 15.4587 209.821 15.272 210.82 15.272H212.066V14.74C212.066 14.3293 211.958 14.012 211.744 13.788C211.529 13.564 211.184 13.452 210.708 13.452C210.288 13.452 209.947 13.5453 209.686 13.732C209.434 13.9093 209.219 14.124 209.042 14.376L207.978 13.424C208.248 13.004 208.608 12.668 209.056 12.416C209.504 12.1547 210.096 12.024 210.834 12.024C211.823 12.024 212.574 12.248 213.088 12.696C213.601 13.144 213.858 13.788 213.858 14.628V18.072H214.586V19.5H213.592ZM210.624 18.366C211.025 18.366 211.366 18.2773 211.646 18.1C211.926 17.9227 212.066 17.6613 212.066 17.316V16.35H210.918C209.984 16.35 209.518 16.6487 209.518 17.246V17.484C209.518 17.7827 209.611 18.0067 209.798 18.156C209.994 18.296 210.269 18.366 210.624 18.366Z"
          fill="#0061FF"
        />
        <defs>
          <linearGradient
            id="paint_large0_linear"
            x1="1.00761"
            y1="10.922"
            x2="26.161"
            y2="35.9929"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0161FD" />
            <stop offset="0.25" stopColor="#3F46D2" />
            <stop offset="0.51" stopColor="#812EA4" />
            <stop offset="0.77" stopColor="#C21578" />
            <stop offset="1" stopColor="#FD0050" />
          </linearGradient>
          <linearGradient
            id="paint_large1_linear"
            x1="10.2612"
            y1="20.239"
            x2="16.7825"
            y2="26.7389"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0161FD" />
            <stop offset="0.25" stopColor="#3F46D2" />
            <stop offset="0.51" stopColor="#812EA4" />
            <stop offset="0.77" stopColor="#C21578" />
            <stop offset="1" stopColor="#FD0050" />
          </linearGradient>
        </defs>
      </svg>
    ),
)