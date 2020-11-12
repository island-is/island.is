module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/client/index.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./components/Client.tsx":
/*!*******************************!*\
  !*** ./components/Client.tsx ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_dtos_client_dto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/dtos/client-dto */ "./models/dtos/client-dto.ts");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _StatusBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./StatusBar */ "./components/StatusBar.tsx");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/router */ "next/router");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}







class Client extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "client", void 0);

    _defineProperty(this, "response", void 0);

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "back", () => {
      const router = Object(next_router__WEBPACK_IMPORTED_MODULE_4__["useRouter"])();
      router.back();
    });

    _defineProperty(this, "isValid", () => {
      return true;
    });

    _defineProperty(this, "submit", async e => {
      e.preventDefault();
      const response = await axios__WEBPACK_IMPORTED_MODULE_2___default.a.post("/api/clients", this.client).catch(err => {
        console.log(err);
      });
      console.log(response);
      this.componentDidMount();
    });

    this.state = {
      response: {
        statusCode: 0,
        message: null,
        error: null
      }
    };
    this.client = this.props.client;

    if (!this.client) {
      this.client = new _models_dtos_client_dto__WEBPACK_IMPORTED_MODULE_1__["default"]();
    }

    this.response = {
      statusCode: 200,
      message: null,
      error: null
    };
  }

  componentDidMount() {
    this.setState({
      response: {
        statusCode: this.response.statusCode,
        message: this.response.message
      }
    });
  }

  render() {
    var _this$client$clientUr, _this$client$descript, _this$client$consentL, _this$client$frontCha, _this$client$pairWise, _this$client$userCode, _this$client$userSsoL;

    return __jsx("div", {
      className: "client"
    }, __jsx(_StatusBar__WEBPACK_IMPORTED_MODULE_3__["default"], {
      status: this.state.response
    }), __jsx("div", {
      className: "client__wrapper"
    }, __jsx("div", {
      className: "client__help"
    }, "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur sed alias neque ullam repudiandae, iste reiciendis suscipit rerum officiis necessitatibus doloribus incidunt libero distinctio consequuntur voluptatibus tenetur aliquid ut inventore!"), __jsx("div", {
      className: "client__container"
    }, __jsx("h1", null, "Stofna n\xFDjann Client"), __jsx("div", {
      className: "client__container__form"
    }, __jsx("form", {
      onSubmit: this.submit
    }, __jsx("div", {
      className: "client__container__fields"
    }, __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Client Id"), __jsx("input", {
      type: "text",
      defaultValue: this.client.clientId,
      onChange: e => this.client.clientId = e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Name"), __jsx("input", {
      type: "text",
      defaultValue: this.client.clientName,
      onChange: e => this.client.clientName = e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "URI"), __jsx("input", {
      type: "text",
      defaultValue: (_this$client$clientUr = this.client.clientUri) !== null && _this$client$clientUr !== void 0 ? _this$client$clientUr : "",
      onChange: e => this.client.clientUri = e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Description"), __jsx("input", {
      type: "text",
      defaultValue: (_this$client$descript = this.client.description) !== null && _this$client$descript !== void 0 ? _this$client$descript : "",
      onChange: e => this.client.clientUri = e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Client claims prefix"), __jsx("input", {
      type: "text",
      defaultValue: this.client.clientClaimsPrefix ? this.client.clientClaimsPrefix : "client__",
      onChange: e => this.client.clientClaimsPrefix = e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Protocol Type"), __jsx("input", {
      type: "text",
      defaultValue: this.client.protocolType ? this.client.protocolType : "oidc",
      onChange: e => this.client.protocolType = e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Virkur"), __jsx("input", {
      type: "checkbox",
      className: "client__checkbox",
      defaultChecked: this.client.enabled,
      onChange: e => this.client.enabled = e.target.checked
    })), __jsx("div", {
      className: "client__container__button"
    }, __jsx("button", {
      className: "client__button__show"
    }, "Advanced")), __jsx("div", {
      className: "client__container__advanced"
    }, __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Absolute Refresh Token Lifetime"), __jsx("input", {
      type: "number",
      defaultValue: this.client.absoluteRefreshTokenLifetime,
      onChange: e => this.client.absoluteRefreshTokenLifetime = +e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Access Token Lifetime"), __jsx("input", {
      type: "number",
      defaultValue: this.client.accessTokenLifetime,
      onChange: e => this.client.absoluteRefreshTokenLifetime = +e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "allow access token via browser"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.allowAccessTokenViaBrowser,
      onChange: e => this.client.allowAccessTokenViaBrowser = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Allow offline access"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.allowOfflineAccess,
      onChange: e => this.client.allowOfflineAccess = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Allow plain text Pkce"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.allowPlainTextPkce,
      onChange: e => this.client.allowPlainTextPkce = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Allow remember consent"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.allowRememberConsent,
      onChange: e => this.client.allowRememberConsent = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Always include user claims in Id token"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.alwaysIncludeUserClaimsInIdToken,
      onChange: e => this.client.alwaysIncludeUserClaimsInIdToken = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Always send client claims"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.alwaysSendClientClaims,
      onChange: e => this.client.alwaysSendClientClaims = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Authorization code lifetime"), __jsx("input", {
      type: "number",
      defaultValue: this.client.authorizationCodeLifetime,
      onChange: e => this.client.authorizationCodeLifetime = +e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Back channel logout session required"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.backChannelLogoutSessionRequired,
      onChange: e => this.client.backChannelLogoutSessionRequired = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Consent lifetime"), __jsx("input", {
      type: "number",
      defaultValue: (_this$client$consentL = this.client.consentLifetime) !== null && _this$client$consentL !== void 0 ? _this$client$consentL : "",
      onChange: e => this.client.consentLifetime = e.target.value === "" ? null : +e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Device code lifetime"), __jsx("input", {
      type: "number",
      defaultValue: this.client.deviceCodeLifetime.toString(),
      onChange: e => this.client.consentLifetime = +e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Enable local login"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.enableLocalLogin,
      onChange: e => this.client.enableLocalLogin = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Front channel logout session required"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.frontChannelLogoutSessionRequired,
      onChange: e => this.client.frontChannelLogoutSessionRequired = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Front channel logout uri"), __jsx("input", {
      type: "text",
      defaultValue: (_this$client$frontCha = this.client.frontChannelLogoutUri) !== null && _this$client$frontCha !== void 0 ? _this$client$frontCha : "",
      onChange: e => this.client.frontChannelLogoutUri = e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Identity token lifetime"), __jsx("input", {
      type: "number",
      defaultValue: this.client.identityTokenLifetime,
      onChange: e => this.client.identityTokenLifetime = +e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Include Jwt Id"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.includeJwtId,
      onChange: e => this.client.includeJwtId = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Rair wise subject salt"), __jsx("input", {
      type: "text",
      defaultValue: (_this$client$pairWise = this.client.pairWiseSubjectSalt) !== null && _this$client$pairWise !== void 0 ? _this$client$pairWise : "",
      onChange: e => this.client.pairWiseSubjectSalt = e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Refresh token expiration"), __jsx("input", {
      type: "number",
      defaultValue: this.client.refreshTokenExpiration,
      onChange: e => this.client.refreshTokenExpiration = +e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "refreshTokenUsage"), __jsx("input", {
      type: "number",
      defaultValue: this.client.refreshTokenUsage,
      onChange: e => this.client.refreshTokenUsage = +e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Require client secret"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.requireClientSecret,
      onChange: e => this.client.requireClientSecret = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Require consent"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.requireConsent,
      onChange: e => this.client.requireConsent = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Require Pkce"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.requirePkce,
      onChange: e => this.client.requirePkce = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Sliding refresh token lifetime"), __jsx("input", {
      type: "number",
      defaultValue: this.client.slidingRefreshTokenLifetime,
      onChange: e => this.client.slidingRefreshTokenLifetime = +e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "Update access token claims on refresh"), __jsx("input", {
      type: "checkbox",
      defaultChecked: this.client.updateAccessTokenClaimsOnRefresh,
      onChange: e => this.client.updateAccessTokenClaimsOnRefresh = e.target.checked,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "User code type"), __jsx("input", {
      type: "text",
      defaultValue: (_this$client$userCode = this.client.userCodeType) !== null && _this$client$userCode !== void 0 ? _this$client$userCode : "",
      onChange: e => this.client.userCodeType = e.target.value,
      className: "client__input"
    })), __jsx("div", {
      className: "client__container__field"
    }, __jsx("label", {
      className: "client__label"
    }, "userSsoLifetime"), __jsx("input", {
      type: "number",
      defaultValue: (_this$client$userSsoL = this.client.userSsoLifetime) === null || _this$client$userSsoL === void 0 ? void 0 : _this$client$userSsoL.toString(),
      onChange: e => this.client.userSsoLifetime = +e.target.value,
      className: "client__input"
    })))), __jsx("div", {
      className: "client__buttons__container"
    }, __jsx("div", {
      className: "client__button__container"
    }, __jsx("button", {
      className: "client__button__cancel",
      onClick: this.back
    }, "H\xE6tta vi\xF0")), __jsx("div", {
      className: "client__button__container"
    }, __jsx("input", {
      type: "submit",
      className: "client__button__save",
      disabled: !this.isValid(),
      value: "Save"
    }))))))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Client);

/***/ }),

/***/ "./components/StatusBar.tsx":
/*!**********************************!*\
  !*** ./components/StatusBar.tsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


class StatusBar extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    console.log("StatusBar " + this.props.status.statusCode);
    let className = "statusbar";

    if (this.props.status.statusCode !== 200) {
      className += " error";
    }

    return __jsx("div", {
      className: className
    }, __jsx("div", {
      className: "statusbar__code"
    }, this.props.status.statusCode), __jsx("div", {
      className: "statusbar__message"
    }, this.props.status.message), __jsx("div", {
      className: "statusbar__error"
    }, this.props.status.error));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (StatusBar);

/***/ }),

/***/ "./models/dtos/base/client-base-dto.ts":
/*!*********************************************!*\
  !*** ./models/dtos/base/client-base-dto.ts ***!
  \*********************************************/
/*! exports provided: ClientBaseDTO */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientBaseDTO", function() { return ClientBaseDTO; });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class ClientBaseDTO {
  constructor() {
    _defineProperty(this, "allowOfflineAccess", void 0);

    _defineProperty(this, "identityTokenLifetime", void 0);

    _defineProperty(this, "accessTokenLifetime", void 0);

    _defineProperty(this, "authorizationCodeLifetime", void 0);

    _defineProperty(this, "absoluteRefreshTokenLifetime", void 0);

    _defineProperty(this, "slidingRefreshTokenLifetime", void 0);

    _defineProperty(this, "consentLifetime", void 0);

    _defineProperty(this, "refreshTokenUsage", void 0);

    _defineProperty(this, "updateAccessTokenClaimsOnRefresh", void 0);

    _defineProperty(this, "refreshTokenExpiration", void 0);

    _defineProperty(this, "accessTokenType", void 0);

    _defineProperty(this, "enableLocalLogin", void 0);

    _defineProperty(this, "includeJwtId", void 0);

    _defineProperty(this, "alwaysSendClientClaims", void 0);

    _defineProperty(this, "pairWiseSubjectSalt", void 0);

    _defineProperty(this, "userSsoLifetime", void 0);

    _defineProperty(this, "userCodeType", void 0);

    _defineProperty(this, "deviceCodeLifetime", void 0);

    _defineProperty(this, "alwaysIncludeUserClaimsInIdToken", void 0);

    _defineProperty(this, "backChannelLogoutSessionRequired", void 0);

    _defineProperty(this, "enabled", void 0);

    _defineProperty(this, "logoUri", void 0);

    _defineProperty(this, "requireConsent", void 0);

    _defineProperty(this, "requirePkce", void 0);

    _defineProperty(this, "allowPlainTextPkce", void 0);

    _defineProperty(this, "allowAccessTokenViaBrowser", void 0);

    _defineProperty(this, "frontChannelLogoutUri", void 0);

    _defineProperty(this, "frontChannelLogoutSessionRequired", void 0);

    _defineProperty(this, "backChannelLogoutUri", void 0);

    _defineProperty(this, "allowRememberConsent", void 0);

    _defineProperty(this, "clientClaimsPrefix", void 0);

    _defineProperty(this, "clientName", void 0);

    _defineProperty(this, "clientUri", void 0);

    _defineProperty(this, "description", void 0);

    _defineProperty(this, "protocolType", void 0);

    _defineProperty(this, "requireClientSecret", void 0);

    this.allowOfflineAccess = false;
    this.identityTokenLifetime = 3600;
    this.accessTokenLifetime = 3600;
    this.authorizationCodeLifetime = 300;
    this.absoluteRefreshTokenLifetime = 2592000;
    this.slidingRefreshTokenLifetime = 1296000;
    this.consentLifetime = null;
    this.refreshTokenUsage = 1;
    this.updateAccessTokenClaimsOnRefresh = true;
    this.refreshTokenExpiration = 0;
    this.accessTokenType = 0;
    this.enableLocalLogin = true;
    this.includeJwtId = true;
    this.alwaysSendClientClaims = false;
    this.pairWiseSubjectSalt = null;
    this.userSsoLifetime = null;
    this.userCodeType = null;
    this.deviceCodeLifetime = 300;
    this.alwaysIncludeUserClaimsInIdToken = false;
    this.backChannelLogoutSessionRequired = true;
    this.enabled = true;
    this.logoUri = null;
    this.requireConsent = false;
    this.requirePkce = false;
    this.allowPlainTextPkce = false;
    this.allowAccessTokenViaBrowser = false;
    this.frontChannelLogoutUri = null;
    this.frontChannelLogoutSessionRequired = true;
    this.backChannelLogoutUri = null;
    this.allowRememberConsent = true;
    this.clientClaimsPrefix = "client__";
    this.clientName = "";
    this.clientUri = null;
    this.description = null;
    this.protocolType = "";
    this.requireClientSecret = true;
  }

}

/***/ }),

/***/ "./models/dtos/client-dto.ts":
/*!***********************************!*\
  !*** ./models/dtos/client-dto.ts ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_client_base_dto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base/client-base-dto */ "./models/dtos/base/client-base-dto.ts");
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}



class ClientDTO extends _base_client_base_dto__WEBPACK_IMPORTED_MODULE_0__["ClientBaseDTO"] {
  constructor() {
    super();

    _defineProperty(this, "clientId", void 0);

    this.clientId = "";
  }

}

/* harmony default export */ __webpack_exports__["default"] = (ClientDTO);

/***/ }),

/***/ "./pages/client/index.tsx":
/*!********************************!*\
  !*** ./pages/client/index.tsx ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Index; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_dtos_client_dto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/dtos/client-dto */ "./models/dtos/client-dto.ts");
/* harmony import */ var _components_Client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../components/Client */ "./components/Client.tsx");

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;


function Index() {
  return __jsx(_components_Client__WEBPACK_IMPORTED_MODULE_2__["default"], {
    client: new _models_dtos_client_dto__WEBPACK_IMPORTED_MODULE_1__["default"]()
  });
}

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("next/router");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy9DbGllbnQudHN4Iiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvU3RhdHVzQmFyLnRzeCIsIndlYnBhY2s6Ly8vLi9tb2RlbHMvZHRvcy9iYXNlL2NsaWVudC1iYXNlLWR0by50cyIsIndlYnBhY2s6Ly8vLi9tb2RlbHMvZHRvcy9jbGllbnQtZHRvLnRzIiwid2VicGFjazovLy8uL3BhZ2VzL2NsaWVudC9pbmRleC50c3giLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYXhpb3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJuZXh0L3JvdXRlclwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0XCIiXSwibmFtZXMiOlsiUmVhY3QiLCJjb25zdHJ1Y3RvciIsInJvdXRlciIsInVzZVJvdXRlciIsImUiLCJyZXNwb25zZSIsImVyciIsImNvbnNvbGUiLCJzdGF0dXNDb2RlIiwibWVzc2FnZSIsImVycm9yIiwiY29tcG9uZW50RGlkTW91bnQiLCJyZW5kZXIiLCJzdWJtaXQiLCJjaGVja2VkIiwiYmFjayIsImNsYXNzTmFtZSJdLCJtYXBwaW5ncyI6Ijs7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0Es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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7QUF0Q2lDLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQXBDOztBQUVBLDRGQUFzQztBQUNwQ0EsYUFBVyxHQUFHO0FBQ1o7O0FBRFk7O0FBRVo7QUFDRDs7QUFKbUM7O0FBU3RDLDBFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1hBO0FBQ0E7QUFDZSxpQkFBZ0I7QUFDM0IsU0FBTztBQUFRLFVBQU0sRUFBRztBQUFqQixJQUFQO0FBRUgsQzs7Ozs7Ozs7Ozs7QUNMRCxrQzs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxrQyIsImZpbGUiOiJwYWdlcy9jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHJlcXVpcmUoJy4uL3Nzci1tb2R1bGUtY2FjaGUuanMnKTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0dmFyIHRocmV3ID0gdHJ1ZTtcbiBcdFx0dHJ5IHtcbiBcdFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbiBcdFx0XHR0aHJldyA9IGZhbHNlO1xuIFx0XHR9IGZpbmFsbHkge1xuIFx0XHRcdGlmKHRocmV3KSBkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdH1cblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3BhZ2VzL2NsaWVudC9pbmRleC50c3hcIik7XG4iLCJpbXBvcnQgUmVhY3QsIHsgU3ludGhldGljRXZlbnQgfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IENsaWVudERUTyBmcm9tIFwiLi4vbW9kZWxzL2R0b3MvY2xpZW50LWR0b1wiO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XHJcbmltcG9ydCBTdGF0dXNCYXIgZnJvbSBcIi4vU3RhdHVzQmFyXCI7XHJcbmltcG9ydCBBUElSZXNwb25zZSBmcm9tIFwiLi4vbW9kZWxzL0FQSVJlc3BvbnNlXCI7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L3JvdXRlclwiO1xyXG5cclxudHlwZSBQcm9wcyA9IHtcclxuICBjbGllbnQ6IENsaWVudERUTztcclxufTtcclxuY2xhc3MgQ2xpZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHsgY2xpZW50OiBDbGllbnREVE8gfT4ge1xyXG4gIGNsaWVudDogQ2xpZW50RFRPO1xyXG4gIHJlc3BvbnNlOiBBUElSZXNwb25zZTtcclxuICBzdGF0ZTogeyByZXNwb25zZTogQVBJUmVzcG9uc2UgfTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHM6IFByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICByZXNwb25zZTogeyBzdGF0dXNDb2RlOiAwLCBtZXNzYWdlOiBudWxsLCBlcnJvcjogbnVsbCB9LFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmNsaWVudCA9IHRoaXMucHJvcHMuY2xpZW50O1xyXG4gICAgaWYgKCF0aGlzLmNsaWVudCkge1xyXG4gICAgICB0aGlzLmNsaWVudCA9IG5ldyBDbGllbnREVE8oKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVzcG9uc2UgPSB7IHN0YXR1c0NvZGU6IDIwMCwgbWVzc2FnZTogbnVsbCwgZXJyb3I6IG51bGwgfTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHJlc3BvbnNlOiB7XHJcbiAgICAgICAgc3RhdHVzQ29kZTogdGhpcy5yZXNwb25zZS5zdGF0dXNDb2RlLFxyXG4gICAgICAgIG1lc3NhZ2U6IHRoaXMucmVzcG9uc2UubWVzc2FnZSxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYmFjayA9ICgpID0+IHtcclxuICAgIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG4gICAgcm91dGVyLmJhY2soKTtcclxuICB9O1xyXG5cclxuICBpc1ZhbGlkID0gKCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfTtcclxuXHJcbiAgc3VibWl0ID0gYXN5bmMgKGU6IFN5bnRoZXRpY0V2ZW50KSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KFwiL2FwaS9jbGllbnRzXCIsIHRoaXMuY2xpZW50KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICB0aGlzLmNvbXBvbmVudERpZE1vdW50KCk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRcIj5cclxuICAgICAgICA8U3RhdHVzQmFyIHN0YXR1cz17dGhpcy5zdGF0ZS5yZXNwb25zZX0+PC9TdGF0dXNCYXI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX3dyYXBwZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19oZWxwXCI+XHJcbiAgICAgICAgICAgIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0IGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQuIENvbnNlcXVhdHVyXHJcbiAgICAgICAgICAgIHNlZCBhbGlhcyBuZXF1ZSB1bGxhbSByZXB1ZGlhbmRhZSwgaXN0ZSByZWljaWVuZGlzIHN1c2NpcGl0IHJlcnVtXHJcbiAgICAgICAgICAgIG9mZmljaWlzIG5lY2Vzc2l0YXRpYnVzIGRvbG9yaWJ1cyBpbmNpZHVudCBsaWJlcm8gZGlzdGluY3Rpb1xyXG4gICAgICAgICAgICBjb25zZXF1dW50dXIgdm9sdXB0YXRpYnVzIHRlbmV0dXIgYWxpcXVpZCB1dCBpbnZlbnRvcmUhXHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDxoMT5TdG9mbmEgbsO9amFubiBDbGllbnQ8L2gxPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19mb3JtXCI+XHJcbiAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuc3VibWl0fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkc1wiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICBDbGllbnQgSWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLmNsaWVudC5jbGllbnRJZH1cclxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gKHRoaXMuY2xpZW50LmNsaWVudElkID0gZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5OYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5jbGllbnQuY2xpZW50TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmNsaWVudE5hbWUgPSBlLnRhcmdldC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudF9faW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+VVJJPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5jbGllbnQuY2xpZW50VXJpID8/IFwiXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+ICh0aGlzLmNsaWVudC5jbGllbnRVcmkgPSBlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPkRlc2NyaXB0aW9uPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5jbGllbnQuZGVzY3JpcHRpb24gPz8gXCJcIn1cclxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gKHRoaXMuY2xpZW50LmNsaWVudFVyaSA9IGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudF9faW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgQ2xpZW50IGNsYWltcyBwcmVmaXhcclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGllbnQuY2xpZW50Q2xhaW1zUHJlZml4XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmNsaWVudC5jbGllbnRDbGFpbXNQcmVmaXhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiY2xpZW50X19cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5jbGllbnQuY2xpZW50Q2xhaW1zUHJlZml4ID0gZS50YXJnZXQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5Qcm90b2NvbCBUeXBlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50LnByb3RvY29sVHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5jbGllbnQucHJvdG9jb2xUeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIm9pZGNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5jbGllbnQucHJvdG9jb2xUeXBlID0gZS50YXJnZXQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5WaXJrdXI8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudF9fY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e3RoaXMuY2xpZW50LmVuYWJsZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+ICh0aGlzLmNsaWVudC5lbmFibGVkID0gZS50YXJnZXQuY2hlY2tlZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgPjwvaW5wdXQ+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fYnV0dG9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjbGllbnRfX2J1dHRvbl9fc2hvd1wiPkFkdmFuY2VkPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fYWR2YW5jZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQWJzb2x1dGUgUmVmcmVzaCBUb2tlbiBMaWZldGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLmNsaWVudC5hYnNvbHV0ZVJlZnJlc2hUb2tlbkxpZmV0aW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmFic29sdXRlUmVmcmVzaFRva2VuTGlmZXRpbWUgPSArZS50YXJnZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFjY2VzcyBUb2tlbiBMaWZldGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLmNsaWVudC5hY2Nlc3NUb2tlbkxpZmV0aW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmFic29sdXRlUmVmcmVzaFRva2VuTGlmZXRpbWUgPSArZS50YXJnZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG93IGFjY2VzcyB0b2tlbiB2aWEgYnJvd3NlclxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17dGhpcy5jbGllbnQuYWxsb3dBY2Nlc3NUb2tlblZpYUJyb3dzZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5jbGllbnQuYWxsb3dBY2Nlc3NUb2tlblZpYUJyb3dzZXIgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQuY2hlY2tlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsbG93IG9mZmxpbmUgYWNjZXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDaGVja2VkPXt0aGlzLmNsaWVudC5hbGxvd09mZmxpbmVBY2Nlc3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5jbGllbnQuYWxsb3dPZmZsaW5lQWNjZXNzID0gZS50YXJnZXQuY2hlY2tlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFsbG93IHBsYWluIHRleHQgUGtjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17dGhpcy5jbGllbnQuYWxsb3dQbGFpblRleHRQa2NlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmFsbG93UGxhaW5UZXh0UGtjZSA9IGUudGFyZ2V0LmNoZWNrZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbGxvdyByZW1lbWJlciBjb25zZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDaGVja2VkPXt0aGlzLmNsaWVudC5hbGxvd1JlbWVtYmVyQ29uc2VudH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5hbGxvd1JlbWVtYmVyQ29uc2VudCA9IGUudGFyZ2V0LmNoZWNrZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbHdheXMgaW5jbHVkZSB1c2VyIGNsYWltcyBpbiBJZCB0b2tlblxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGllbnQuYWx3YXlzSW5jbHVkZVVzZXJDbGFpbXNJbklkVG9rZW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmFsd2F5c0luY2x1ZGVVc2VyQ2xhaW1zSW5JZFRva2VuID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LmNoZWNrZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBbHdheXMgc2VuZCBjbGllbnQgY2xhaW1zXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDaGVja2VkPXt0aGlzLmNsaWVudC5hbHdheXNTZW5kQ2xpZW50Q2xhaW1zfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmFsd2F5c1NlbmRDbGllbnRDbGFpbXMgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQuY2hlY2tlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb24gY29kZSBsaWZldGltZVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLmNsaWVudC5hdXRob3JpemF0aW9uQ29kZUxpZmV0aW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmF1dGhvcml6YXRpb25Db2RlTGlmZXRpbWUgPSArZS50YXJnZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhY2sgY2hhbm5lbCBsb2dvdXQgc2Vzc2lvbiByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGllbnQuYmFja0NoYW5uZWxMb2dvdXRTZXNzaW9uUmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmJhY2tDaGFubmVsTG9nb3V0U2Vzc2lvblJlcXVpcmVkID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LmNoZWNrZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5Db25zZW50IGxpZmV0aW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLmNsaWVudC5jb25zZW50TGlmZXRpbWUgPz8gXCJcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5jb25zZW50TGlmZXRpbWUgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQudmFsdWUgPT09IFwiXCIgPyBudWxsIDogK2UudGFyZ2V0LnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudF9faW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERldmljZSBjb2RlIGxpZmV0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuY2xpZW50LmRldmljZUNvZGVMaWZldGltZS50b1N0cmluZygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmNvbnNlbnRMaWZldGltZSA9ICtlLnRhcmdldC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBFbmFibGUgbG9jYWwgbG9naW5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e3RoaXMuY2xpZW50LmVuYWJsZUxvY2FsTG9naW59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5jbGllbnQuZW5hYmxlTG9jYWxMb2dpbiA9IGUudGFyZ2V0LmNoZWNrZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRnJvbnQgY2hhbm5lbCBsb2dvdXQgc2Vzc2lvbiByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q2hlY2tlZD17XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGllbnQuZnJvbnRDaGFubmVsTG9nb3V0U2Vzc2lvblJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5mcm9udENoYW5uZWxMb2dvdXRTZXNzaW9uUmVxdWlyZWQgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQuY2hlY2tlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBGcm9udCBjaGFubmVsIGxvZ291dCB1cmlcclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuY2xpZW50LmZyb250Q2hhbm5lbExvZ291dFVyaSA/PyBcIlwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LmZyb250Q2hhbm5lbExvZ291dFVyaSA9IGUudGFyZ2V0LnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudF9faW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIElkZW50aXR5IHRva2VuIGxpZmV0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuY2xpZW50LmlkZW50aXR5VG9rZW5MaWZldGltZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5pZGVudGl0eVRva2VuTGlmZXRpbWUgPSArZS50YXJnZXQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5JbmNsdWRlIEp3dCBJZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e3RoaXMuY2xpZW50LmluY2x1ZGVKd3RJZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5pbmNsdWRlSnd0SWQgPSBlLnRhcmdldC5jaGVja2VkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudF9faW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJhaXIgd2lzZSBzdWJqZWN0IHNhbHRcclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuY2xpZW50LnBhaXJXaXNlU3ViamVjdFNhbHQgPz8gXCJcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5wYWlyV2lzZVN1YmplY3RTYWx0ID0gZS50YXJnZXQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgUmVmcmVzaCB0b2tlbiBleHBpcmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuY2xpZW50LnJlZnJlc2hUb2tlbkV4cGlyYXRpb259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5jbGllbnQucmVmcmVzaFRva2VuRXhwaXJhdGlvbiA9ICtlLnRhcmdldC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPnJlZnJlc2hUb2tlblVzYWdlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLmNsaWVudC5yZWZyZXNoVG9rZW5Vc2FnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5yZWZyZXNoVG9rZW5Vc2FnZSA9ICtlLnRhcmdldC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSZXF1aXJlIGNsaWVudCBzZWNyZXRcclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e3RoaXMuY2xpZW50LnJlcXVpcmVDbGllbnRTZWNyZXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5jbGllbnQucmVxdWlyZUNsaWVudFNlY3JldCA9IGUudGFyZ2V0LmNoZWNrZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5SZXF1aXJlIGNvbnNlbnQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDaGVja2VkPXt0aGlzLmNsaWVudC5yZXF1aXJlQ29uc2VudH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5yZXF1aXJlQ29uc2VudCA9IGUudGFyZ2V0LmNoZWNrZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5SZXF1aXJlIFBrY2U8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDaGVja2VkPXt0aGlzLmNsaWVudC5yZXF1aXJlUGtjZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5yZXF1aXJlUGtjZSA9IGUudGFyZ2V0LmNoZWNrZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImNsaWVudF9fbGFiZWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgU2xpZGluZyByZWZyZXNoIHRva2VuIGxpZmV0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuY2xpZW50LnNsaWRpbmdSZWZyZXNoVG9rZW5MaWZldGltZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC5zbGlkaW5nUmVmcmVzaFRva2VuTGlmZXRpbWUgPSArZS50YXJnZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGVja2VkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudF9faW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFVwZGF0ZSBhY2Nlc3MgdG9rZW4gY2xhaW1zIG9uIHJlZnJlc2hcclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdENoZWNrZWQ9e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50LnVwZGF0ZUFjY2Vzc1Rva2VuQ2xhaW1zT25SZWZyZXNoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC51cGRhdGVBY2Nlc3NUb2tlbkNsYWltc09uUmVmcmVzaCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC5jaGVja2VkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudF9faW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJjbGllbnRfX2xhYmVsXCI+VXNlciBjb2RlIHR5cGU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLmNsaWVudC51c2VyQ29kZVR5cGUgPz8gXCJcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmNsaWVudC51c2VyQ29kZVR5cGUgPSBlLnRhcmdldC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY2xpZW50X19sYWJlbFwiPnVzZXJTc29MaWZldGltZTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5jbGllbnQudXNlclNzb0xpZmV0aW1lPy50b1N0cmluZygpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuY2xpZW50LnVzZXJTc29MaWZldGltZSA9ICtlLnRhcmdldC52YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRfX2lucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fYnV0dG9uc19fY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19idXR0b25fX2NvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudF9fYnV0dG9uX19jYW5jZWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5iYWNrfVxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgIEjDpnR0YSB2acOwXHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fYnV0dG9uX19jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50X19idXR0b25fX3NhdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyF0aGlzLmlzVmFsaWQoKX1cclxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPVwiU2F2ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENsaWVudDtcclxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgQVBJUmVzcG9uc2UgZnJvbSBcIi4uLy4uL21vZGVscy9BUElSZXNwb25zZVwiO1xyXG5cclxuY2xhc3MgU3RhdHVzQmFyIGV4dGVuZHMgQ29tcG9uZW50PHsgc3RhdHVzOiBBUElSZXNwb25zZSB9PiB7XHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJTdGF0dXNCYXIgXCIgKyB0aGlzLnByb3BzLnN0YXR1cy5zdGF0dXNDb2RlKTtcclxuICAgIGxldCBjbGFzc05hbWUgPSBcInN0YXR1c2JhclwiO1xyXG4gICAgaWYgKHRoaXMucHJvcHMuc3RhdHVzLnN0YXR1c0NvZGUgIT09IDIwMCkge1xyXG4gICAgICBjbGFzc05hbWUgKz0gXCIgZXJyb3JcIjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YXR1c2Jhcl9fY29kZVwiPnt0aGlzLnByb3BzLnN0YXR1cy5zdGF0dXNDb2RlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhdHVzYmFyX19tZXNzYWdlXCI+e3RoaXMucHJvcHMuc3RhdHVzLm1lc3NhZ2V9PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGF0dXNiYXJfX2Vycm9yXCI+e3RoaXMucHJvcHMuc3RhdHVzLmVycm9yfTwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTdGF0dXNCYXI7XHJcbiIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDbGllbnRCYXNlRFRPIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbGxvd09mZmxpbmVBY2Nlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmlkZW50aXR5VG9rZW5MaWZldGltZSA9IDM2MDA7XG4gICAgdGhpcy5hY2Nlc3NUb2tlbkxpZmV0aW1lID0gMzYwMDtcbiAgICB0aGlzLmF1dGhvcml6YXRpb25Db2RlTGlmZXRpbWUgPSAzMDA7XG4gICAgdGhpcy5hYnNvbHV0ZVJlZnJlc2hUb2tlbkxpZmV0aW1lID0gMjU5MjAwMDtcbiAgICB0aGlzLnNsaWRpbmdSZWZyZXNoVG9rZW5MaWZldGltZSA9IDEyOTYwMDA7XG4gICAgdGhpcy5jb25zZW50TGlmZXRpbWUgPSBudWxsO1xuICAgIHRoaXMucmVmcmVzaFRva2VuVXNhZ2UgPSAxO1xuICAgIHRoaXMudXBkYXRlQWNjZXNzVG9rZW5DbGFpbXNPblJlZnJlc2ggPSB0cnVlO1xuICAgIHRoaXMucmVmcmVzaFRva2VuRXhwaXJhdGlvbiA9IDA7XG4gICAgdGhpcy5hY2Nlc3NUb2tlblR5cGUgPSAwO1xuICAgIHRoaXMuZW5hYmxlTG9jYWxMb2dpbiA9IHRydWU7XG4gICAgdGhpcy5pbmNsdWRlSnd0SWQgPSB0cnVlO1xuICAgIHRoaXMuYWx3YXlzU2VuZENsaWVudENsYWltcyA9IGZhbHNlO1xuICAgIHRoaXMucGFpcldpc2VTdWJqZWN0U2FsdCA9IG51bGw7XG4gICAgdGhpcy51c2VyU3NvTGlmZXRpbWUgPSBudWxsO1xuICAgIHRoaXMudXNlckNvZGVUeXBlID0gbnVsbDtcbiAgICB0aGlzLmRldmljZUNvZGVMaWZldGltZSA9IDMwMDtcbiAgICB0aGlzLmFsd2F5c0luY2x1ZGVVc2VyQ2xhaW1zSW5JZFRva2VuID0gZmFsc2U7XG4gICAgdGhpcy5iYWNrQ2hhbm5lbExvZ291dFNlc3Npb25SZXF1aXJlZCA9IHRydWU7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmxvZ29VcmkgPSBudWxsO1xuICAgIHRoaXMucmVxdWlyZUNvbnNlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnJlcXVpcmVQa2NlID0gZmFsc2U7XG4gICAgdGhpcy5hbGxvd1BsYWluVGV4dFBrY2UgPSBmYWxzZTtcbiAgICB0aGlzLmFsbG93QWNjZXNzVG9rZW5WaWFCcm93c2VyID0gZmFsc2U7XG4gICAgdGhpcy5mcm9udENoYW5uZWxMb2dvdXRVcmkgPSBudWxsO1xuICAgIHRoaXMuZnJvbnRDaGFubmVsTG9nb3V0U2Vzc2lvblJlcXVpcmVkID0gdHJ1ZTtcbiAgICB0aGlzLmJhY2tDaGFubmVsTG9nb3V0VXJpID0gbnVsbDtcbiAgICB0aGlzLmFsbG93UmVtZW1iZXJDb25zZW50ID0gdHJ1ZTtcbiAgICB0aGlzLmNsaWVudENsYWltc1ByZWZpeCA9IFwiY2xpZW50X19cIjtcbiAgICB0aGlzLmNsaWVudE5hbWUgPSBcIlwiO1xuICAgIHRoaXMuY2xpZW50VXJpID0gbnVsbDtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gbnVsbDtcbiAgICB0aGlzLnByb3RvY29sVHlwZSA9IFwiXCI7XG4gICAgdGhpcy5yZXF1aXJlQ2xpZW50U2VjcmV0ID0gdHJ1ZTtcbiAgfVxuXG4gIGFsbG93T2ZmbGluZUFjY2VzczogYm9vbGVhbjtcbiAgaWRlbnRpdHlUb2tlbkxpZmV0aW1lOiBudW1iZXI7XG4gIGFjY2Vzc1Rva2VuTGlmZXRpbWU6IG51bWJlcjtcbiAgYXV0aG9yaXphdGlvbkNvZGVMaWZldGltZTogbnVtYmVyO1xuICBhYnNvbHV0ZVJlZnJlc2hUb2tlbkxpZmV0aW1lOiBudW1iZXI7XG4gIHNsaWRpbmdSZWZyZXNoVG9rZW5MaWZldGltZTogbnVtYmVyO1xuICBjb25zZW50TGlmZXRpbWU6IG51bWJlciB8IG51bGw7XG4gIHJlZnJlc2hUb2tlblVzYWdlOiBudW1iZXI7XG4gIHVwZGF0ZUFjY2Vzc1Rva2VuQ2xhaW1zT25SZWZyZXNoOiBib29sZWFuO1xuICByZWZyZXNoVG9rZW5FeHBpcmF0aW9uOiBudW1iZXI7XG4gIGFjY2Vzc1Rva2VuVHlwZTogbnVtYmVyO1xuICBlbmFibGVMb2NhbExvZ2luOiBib29sZWFuO1xuICBpbmNsdWRlSnd0SWQ6IGJvb2xlYW47XG4gIGFsd2F5c1NlbmRDbGllbnRDbGFpbXM6IGJvb2xlYW47XG4gIHBhaXJXaXNlU3ViamVjdFNhbHQ6IHN0cmluZyB8IG51bGw7XG4gIHVzZXJTc29MaWZldGltZTogbnVtYmVyIHwgbnVsbDtcbiAgdXNlckNvZGVUeXBlOiBzdHJpbmcgfCBudWxsO1xuICBkZXZpY2VDb2RlTGlmZXRpbWU6IG51bWJlcjtcbiAgYWx3YXlzSW5jbHVkZVVzZXJDbGFpbXNJbklkVG9rZW46IGJvb2xlYW47XG4gIGJhY2tDaGFubmVsTG9nb3V0U2Vzc2lvblJlcXVpcmVkOiBib29sZWFuO1xuICBlbmFibGVkOiBib29sZWFuO1xuICBsb2dvVXJpOiBzdHJpbmcgfCBudWxsO1xuICByZXF1aXJlQ29uc2VudDogYm9vbGVhbjtcbiAgcmVxdWlyZVBrY2U6IGJvb2xlYW47XG4gIGFsbG93UGxhaW5UZXh0UGtjZTogYm9vbGVhbjtcbiAgYWxsb3dBY2Nlc3NUb2tlblZpYUJyb3dzZXI6IGJvb2xlYW47XG4gIGZyb250Q2hhbm5lbExvZ291dFVyaTogc3RyaW5nIHwgbnVsbDtcbiAgZnJvbnRDaGFubmVsTG9nb3V0U2Vzc2lvblJlcXVpcmVkOiBib29sZWFuO1xuICBiYWNrQ2hhbm5lbExvZ291dFVyaTogc3RyaW5nIHwgbnVsbDtcbiAgYWxsb3dSZW1lbWJlckNvbnNlbnQ6IGJvb2xlYW47XG4gIGNsaWVudENsYWltc1ByZWZpeDogc3RyaW5nO1xuICBjbGllbnROYW1lOiBzdHJpbmc7XG4gIGNsaWVudFVyaTogc3RyaW5nIHwgbnVsbDtcbiAgZGVzY3JpcHRpb246IHN0cmluZyB8IG51bGw7XG4gIHByb3RvY29sVHlwZTogc3RyaW5nO1xuICByZXF1aXJlQ2xpZW50U2VjcmV0OiBib29sZWFuO1xufVxuIiwiaW1wb3J0IHsgQ2xpZW50QmFzZURUTyB9IGZyb20gXCIuL2Jhc2UvY2xpZW50LWJhc2UtZHRvXCI7XG5cbmNsYXNzIENsaWVudERUTyBleHRlbmRzIENsaWVudEJhc2VEVE8ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY2xpZW50SWQgPSBcIlwiO1xuICB9XG5cbiAgY2xpZW50SWQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50RFRPO1xuIiwiaW1wb3J0IENsaWVudERUTyBmcm9tICcuLi8uLi9tb2RlbHMvZHRvcy9jbGllbnQtZHRvJ1xyXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4vLi4vLi4vY29tcG9uZW50cy9DbGllbnQnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEluZGV4KCl7XHJcbiAgICByZXR1cm4gPENsaWVudCBjbGllbnQ9eyBuZXcgQ2xpZW50RFRPKCl9Lz4gXHJcblxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXhpb3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9yb3V0ZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3RcIik7Il0sInNvdXJjZVJvb3QiOiIifQ==