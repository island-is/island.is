webpackHotUpdate_N_E("pages/clients",{

/***/ "./components/Clients.tsx":
/*!********************************!*\
  !*** ./components/Clients.tsx ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "../../node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "../../node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "../../node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "../../node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "../../node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "../../node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "../../node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "../../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! axios */ "../../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _Paginator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Paginator */ "./components/Paginator.tsx");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! next/link */ "../../node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_12__);









var __jsx = react__WEBPACK_IMPORTED_MODULE_9___default.a.createElement;

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = Object(_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return Object(_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__["default"])(this, result);
  };
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}






var Clients = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(Clients, _Component);

  var _super = _createSuper(Clients);

  function Clients() {
    var _this;

    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Clients);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "state", {
      clients: [],
      rowCount: 0,
      lastPage: 0,
      count: 1,
      page: 1
    });

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "getClients", /*#__PURE__*/Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      var response;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return axios__WEBPACK_IMPORTED_MODULE_10___default.a.get("/api/clients?page=".concat(_this.state.page, "&count=").concat(_this.state.count));

            case 2:
              response = _context.sent;

              _this.setState({
                clients: response.data.rows,
                rowCount: response.data.count,
                lastPage: Math.ceil(_this.state.rowCount / _this.state.count)
              });

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "componentDidMount", /*#__PURE__*/Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log("did mount");

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "handlePageChange", /*#__PURE__*/function () {
      var _ref3 = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(page) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this.state.page = page;
                _context3.next = 3;
                return _this.componentDidMount();

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }());

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "delete", /*#__PURE__*/function () {
      var _ref4 = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(clientId) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!window.confirm('Ertu viss um að þú viljir eyða þessari færslu?')) {
                  _context4.next = 7;
                  break;
                }

                _context4.next = 3;
                return axios__WEBPACK_IMPORTED_MODULE_10___default.a["delete"]("./clients/".concat(clientId));

              case 3:
                response = _context4.sent;
                console.log(response);
                _context4.next = 7;
                return _this.componentDidMount();

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }());

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "edit", /*#__PURE__*/function () {
      var _ref5 = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(client) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                console.log(client);

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x3) {
        return _ref5.apply(this, arguments);
      };
    }());

    return _this;
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Clients, [{
    key: "changeCount",
    value: function changeCount(count) {
      console.log("change count " + count);
      this.setState({
        count: +count,
        page: 1
      });
      console.log(this.state);
      this.getClients();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return __jsx("div", {
        className: "clients__container"
      }, __jsx("h2", null, "Vefir og sm\xE1forrit"), __jsx("div", {
        className: "clients__container__options"
      }, __jsx("div", {
        className: "clients__container__button"
      }, __jsx(next_link__WEBPACK_IMPORTED_MODULE_12___default.a, {
        href: '/client'
      }, __jsx("a", {
        className: "clients__button__new"
      }, "B\xE6ta vi\xF0 n\xFDjum"))), __jsx("div", {
        className: "clients__container__field"
      }, __jsx("label", {
        htmlFor: "count",
        className: "clients__label"
      }, "Fj\xF6ldi \xE1 s\xED\xF0u"), __jsx("select", {
        id: "count",
        onChange: function onChange(e) {
          return _this2.changeCount(e.target.value);
        },
        className: "clients__select"
      }, __jsx("option", {
        value: "1"
      }, "1"), __jsx("option", {
        value: "30"
      }, "30"), __jsx("option", {
        value: "50"
      }, "50"), __jsx("option", {
        value: "100"
      }, "100")))), __jsx("div", {
        className: "client__container__table"
      }, __jsx("table", {
        className: "clients__table"
      }, __jsx("thead", null, __jsx("tr", null, __jsx("th", null, "Au\xF0kenni"), __jsx("th", null, "Identity token lifetime"), __jsx("th", {
        colSpan: 2
      }))), __jsx("tbody", null, this.state.clients.map(function (client) {
        return __jsx("tr", {
          key: client.clientId
        }, __jsx("td", null, client.clientId), __jsx("td", null, client.identityTokenLifetime), __jsx("td", null, __jsx("button", {
          className: "clients__button__edit",
          onClick: function onClick() {
            return _this2.edit(client);
          }
        }, "Breyta")), __jsx("td", null, __jsx("button", {
          className: "clients__button__delete",
          onClick: function onClick() {
            return _this2["delete"](client.clientId);
          }
        }, "Ey\xF0a")));
      })))), __jsx(_Paginator__WEBPACK_IMPORTED_MODULE_11__["default"], {
        lastPage: this.state.lastPage,
        handlePageChange: this.handlePageChange
      }));
    }
  }]);

  return Clients;
}(react__WEBPACK_IMPORTED_MODULE_9__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Clients);
;

var _a, _b; // Legacy CSS implementations will `eval` browser code in a Node.js context
// to extract CSS. For backwards compatibility, we need to check we're in a
// browser context before continuing.


if (typeof self !== 'undefined' && // AMP / No-JS mode does not inject these helpers:
'$RefreshHelpers$' in self) {
  var currentExports = module.__proto__.exports;
  var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null; // This cannot happen in MainTemplate because the exports mismatch between
  // templating and execution.

  self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i); // A module can be accepted automatically based on its exports, e.g. when
  // it is a Refresh Boundary.

  if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
    // Save the previous exports on update so we can compare the boundary
    // signatures.
    module.hot.dispose(function (data) {
      data.prevExports = currentExports;
    }); // Unconditionally accept an update to this module, we'll check if it's
    // still a Refresh Boundary later.

    module.hot.accept(); // This field is set when the previous version of this module was a
    // Refresh Boundary, letting us know we need to check for invalidation or
    // enqueue an update.

    if (prevExports !== null) {
      // A boundary can become ineligible if its exports are incompatible
      // with the previous exports.
      //
      // For example, if you add/remove/change exports, we'll want to
      // re-execute the importing modules, and force those components to
      // re-render. Similarly, if you convert a class component to a
      // function, we want to invalidate the boundary.
      if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
        module.hot.invalidate();
      } else {
        self.$RefreshHelpers$.scheduleUpdate();
      }
    }
  } else {
    // Since we just executed the code for the module, it's possible that the
    // new exports made it ineligible for being a boundary.
    // We only care about the case when we were _previously_ a boundary,
    // because we already accepted this update (accidental side effect).
    var isNoLongerABoundary = prevExports !== null;

    if (isNoLongerABoundary) {
      module.hot.invalidate();
    }
  }
}

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/next/node_modules/webpack/buildin/harmony-module.js */ "../../node_modules/next/node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9DbGllbnRzLnRzeCJdLCJuYW1lcyI6WyJDbGllbnRzIiwiY2xpZW50cyIsInJvd0NvdW50IiwibGFzdFBhZ2UiLCJjb3VudCIsInBhZ2UiLCJheGlvcyIsInJlc3BvbnNlIiwiTWF0aCIsImNvbnNvbGUiLCJ3aW5kb3ciLCJlIiwiY2xpZW50IiwiY2xpZW50SWQiLCJoYW5kbGVQYWdlQ2hhbmdlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBOztJQUVNQSxPOzs7Ozs7Ozs7Ozs7Ozs7O2dOQUNJO0FBQ05DLGFBQU8sRUFERDtBQUVOQyxjQUFRLEVBRkY7QUFHTkMsY0FBUSxFQUhGO0FBSU5DLFdBQUssRUFKQztBQUtOQyxVQUFJLEVBQUU7QUFMQSxLOzttWkFRSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUNZQyw2Q0FBSyxDQUFMQSxnQ0FDQSxZQURBQSx3QkFDeUIsWUFGckMsS0FDWUEsRUFEWjs7QUFBQTtBQUNMQyxzQkFESyxnQkFDTEE7O0FBSU4sNkJBQWM7QUFDWk4sdUJBQU8sRUFBRU0sUUFBUSxDQUFSQSxLQURHO0FBRVpMLHdCQUFRLEVBQUVLLFFBQVEsQ0FBUkEsS0FGRTtBQUdaSix3QkFBUSxFQUFFSyxJQUFJLENBQUpBLEtBQVUsdUJBQXNCLFlBQWhDQTtBQUhFLGVBQWQ7O0FBTFc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7MFpBWU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNsQkMscUJBQU8sQ0FBUEE7O0FBRGtCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OzttTUFJRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2pCO0FBRGlCO0FBQUEsdUJBRVgsTUFGVyxpQkFFWCxFQUZXOztBQUFBO0FB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ZjkxN2EyZjQ1LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xyXG5pbXBvcnQgQ2xpZW50RFRPIGZyb20gJy4uL21vZGVscy9kdG9zL2NsaWVudC1kdG8nO1xyXG5pbXBvcnQgUGFnaW5hdG9yIGZyb20gJy4vUGFnaW5hdG9yJztcclxuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcclxuXHJcbmNsYXNzIENsaWVudHMgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIHN0YXRlID0ge1xyXG4gICAgY2xpZW50czogW10sXHJcbiAgICByb3dDb3VudDogMCxcclxuICAgIGxhc3RQYWdlOiAwLFxyXG4gICAgY291bnQ6IDEsXHJcbiAgICBwYWdlOiAxLFxyXG4gIH07XHJcblxyXG4gIGdldENsaWVudHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChcclxuICAgICAgYC9hcGkvY2xpZW50cz9wYWdlPSR7dGhpcy5zdGF0ZS5wYWdlfSZjb3VudD0ke3RoaXMuc3RhdGUuY291bnR9YFxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY2xpZW50czogcmVzcG9uc2UuZGF0YS5yb3dzLFxyXG4gICAgICByb3dDb3VudDogcmVzcG9uc2UuZGF0YS5jb3VudCxcclxuICAgICAgbGFzdFBhZ2U6IE1hdGguY2VpbCh0aGlzLnN0YXRlLnJvd0NvdW50IC8gdGhpcy5zdGF0ZS5jb3VudCksXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50ID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJkaWQgbW91bnRcIikgICAgXHJcbiAgfTtcclxuXHJcbiAgaGFuZGxlUGFnZUNoYW5nZSA9IGFzeW5jIChwYWdlOiBudW1iZXIpID0+IHtcclxuICAgIHRoaXMuc3RhdGUucGFnZSA9IHBhZ2U7XHJcbiAgICBhd2FpdCB0aGlzLmNvbXBvbmVudERpZE1vdW50KCk7XHJcbiAgfTtcclxuXHJcbiAgZGVsZXRlID0gYXN5bmMgKGNsaWVudElkOiBzdHJpbmcpID0+IHtcclxuICAgIGlmICh3aW5kb3cuY29uZmlybSgnRXJ0dSB2aXNzIHVtIGHDsCDDvsO6IHZpbGppciBlecOwYSDDvmVzc2FyaSBmw6Zyc2x1PycpKSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZGVsZXRlKGAuL2NsaWVudHMvJHtjbGllbnRJZH1gKTtcclxuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICBhd2FpdCB0aGlzLmNvbXBvbmVudERpZE1vdW50KCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZWRpdCA9IGFzeW5jIChjbGllbnQ6IENsaWVudERUTykgPT4ge1xyXG4gICAgY29uc29sZS5sb2coY2xpZW50KTtcclxuICB9O1xyXG5cclxuICBjaGFuZ2VDb3VudChjb3VudDogc3RyaW5nKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImNoYW5nZSBjb3VudCBcIiArIGNvdW50KVxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGNvdW50OiArY291bnQsXHJcbiAgICAgIHBhZ2U6IDEsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKVxyXG5cclxuICAgIHRoaXMuZ2V0Q2xpZW50cygpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRzX19jb250YWluZXJcIj5cclxuICAgICAgICA8aDI+VmVmaXIgb2cgc23DoWZvcnJpdDwvaDI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRzX19jb250YWluZXJfX29wdGlvbnNcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50c19fY29udGFpbmVyX19idXR0b25cIj5cclxuICAgICAgICAgICAgPExpbmsgaHJlZj17Jy9jbGllbnQnfT5cclxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJjbGllbnRzX19idXR0b25fX25ld1wiPkLDpnRhIHZpw7AgbsO9anVtPC9hPlxyXG4gICAgICAgICAgICA8L0xpbms+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50c19fY29udGFpbmVyX19maWVsZFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImNvdW50XCIgY2xhc3NOYW1lPVwiY2xpZW50c19fbGFiZWxcIj5cclxuICAgICAgICAgICAgICBGasO2bGRpIMOhIHPDrcOwdVxyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8c2VsZWN0XHJcbiAgICAgICAgICAgICAgaWQ9XCJjb3VudFwiXHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLmNoYW5nZUNvdW50KGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRzX19zZWxlY3RcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjFcIj4xPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjMwXCI+MzA8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiNTBcIj41MDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIxMDBcIj4xMDA8L29wdGlvbj5cclxuICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudF9fY29udGFpbmVyX190YWJsZVwiPlxyXG4gICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cImNsaWVudHNfX3RhYmxlXCI+XHJcbiAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICA8dGg+QXXDsGtlbm5pPC90aD5cclxuICAgICAgICAgICAgICAgIDx0aD5JZGVudGl0eSB0b2tlbiBsaWZldGltZTwvdGg+XHJcbiAgICAgICAgICAgICAgICA8dGggY29sU3Bhbj17Mn0+PC90aD5cclxuICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuY2xpZW50cy5tYXAoKGNsaWVudDogQ2xpZW50RFRPKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICA8dHIga2V5PXtjbGllbnQuY2xpZW50SWR9PlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57Y2xpZW50LmNsaWVudElkfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPntjbGllbnQuaWRlbnRpdHlUb2tlbkxpZmV0aW1lfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRzX19idXR0b25fX2VkaXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLmVkaXQoY2xpZW50KX1cclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQnJleXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50c19fYnV0dG9uX19kZWxldGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLmRlbGV0ZShjbGllbnQuY2xpZW50SWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBFecOwYVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxQYWdpbmF0b3JcclxuICAgICAgICAgIGxhc3RQYWdlPXt0aGlzLnN0YXRlLmxhc3RQYWdlfVxyXG4gICAgICAgICAgaGFuZGxlUGFnZUNoYW5nZT17dGhpcy5oYW5kbGVQYWdlQ2hhbmdlfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENsaWVudHM7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=