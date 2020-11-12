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

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "getClients", /*#__PURE__*/function () {
      var _ref = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(page, count) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return axios__WEBPACK_IMPORTED_MODULE_10___default.a.get("/api/clients?page=".concat(page, "&count=").concat(count));

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
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

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

      return function (_x3) {
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

      return function (_x4) {
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

      return function (_x5) {
        return _ref5.apply(this, arguments);
      };
    }());

    return _this;
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Clients, [{
    key: "changeCount",
    value: function changeCount(count) {
      this.getClients(1, +count);
      this.setState({
        count: +count,
        page: 1
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9DbGllbnRzLnRzeCJdLCJuYW1lcyI6WyJDbGllbnRzIiwiY2xpZW50cyIsInJvd0NvdW50IiwibGFzdFBhZ2UiLCJjb3VudCIsInBhZ2UiLCJheGlvcyIsInJlc3BvbnNlIiwiTWF0aCIsImNvbnNvbGUiLCJ3aW5kb3ciLCJlIiwiY2xpZW50IiwiY2xpZW50SWQiLCJoYW5kbGVQYWdlQ2hhbmdlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBOztJQUVNQSxPOzs7Ozs7Ozs7Ozs7Ozs7O2dOQUNJO0FBQ05DLGFBQU8sRUFERDtBQUVOQyxjQUFRLEVBRkY7QUFHTkMsY0FBUSxFQUhGO0FBSU5DLFdBQUssRUFKQztBQUtOQyxVQUFJLEVBQUU7QUFMQSxLOzs7a01BUUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFDWUMsNkNBQUssQ0FBTEEsd0RBRFosS0FDWUEsRUFEWjs7QUFBQTtBQUNMQyx3QkFESyxnQkFDTEE7O0FBSU4sK0JBQWM7QUFDWk4seUJBQU8sRUFBRU0sUUFBUSxDQUFSQSxLQURHO0FBRVpMLDBCQUFRLEVBQUVLLFFBQVEsQ0FBUkEsS0FGRTtBQUdaSiwwQkFBUSxFQUFFSyxJQUFJLENBQUpBLEtBQVUsdUJBQXNCLFlBQWhDQTtBQUhFLGlCQUFkOztBQUxXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7MFpBWU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNsQkMscUJBQU8sQ0FBUEE7O0FBRGtCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7OzttTUFJRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2pCO0FBRGlCO0FBQUEsdUJBRVgsTUFGVyxpQkFFWCxFQUZXOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7O21NQUtWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUNIQyxNQUFNLENBQU5BLFFBREcsZ0RBQ0hBLENBREc7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSx1QkFFa0JKLDZDQUFLLENBQUxBLFFBQUssQ0FBTEEscUJBRmxCLFFBRWtCQSxFQUZsQjs7QUFBQTtBQUVDQyx3QkFGRCxpQkFFQ0E7QUFDTkUsdUJBQU8sQ0FBUEE7QUFISztBQUFBLHVCQUlDLE1BSkQsaUJBSUMsRUFKRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OzttTUFRRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0xBLHVCQUFPLENBQVBBOztBQURLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7OztnQ0FJS0wsSyxFQUFlO0FBQ3pCLHlCQUFtQixDQUFuQjtBQUVBLG9CQUFjO0FBQ1pBLGFBQUssRUFBRSxDQURLO0FBRVpDLFlBQUksRUFBRTtBQUZNLE9BQWQ7QUFJRDs7OzZCQUVRO0FBQUE7O0FBQ1AsYUFDRTtBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNFLGtCQURGLHVCQUNFLENBREYsRUFFRTtBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNFO0FBQUssaUJBQVMsRUFBQztBQUFmLFNBQ0U7QUFBTSxZQUFJLEVBQUU7QUFBWixTQUNFO0FBQUcsaUJBQVMsRUFBQztBQUFiLFNBSE4seUJBR00sQ0FERixDQURGLENBREYsRUFNRTtBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNFO0FBQU8sZUFBTyxFQUFkO0FBQXVCLGlCQUFTLEVBQUM7QUFBakMsU0FERiwyQkFDRSxDQURGLEVBSUU7QUFDRSxVQUFFLEVBREo7QUFFRSxnQkFBUSxFQUFFO0FBQUEsaUJBQU8sTUFBSSxDQUFKLFlBQWlCTSxDQUFDLENBQURBLE9BQXhCLEtBQU8sQ0FBUDtBQUZaO0FBR0UsaUJBQVMsRUFBQztBQUhaLFNBS0U7QUFBUSxhQUFLLEVBQUM7QUFBZCxTQUxGLEdBS0UsQ0FMRixFQU1FO0FBQVEsYUFBSyxFQUFDO0FBQWQsU0FORixJQU1FLENBTkYsRUFPRTtBQUFRLGFBQUssRUFBQztBQUFkLFNBUEYsSUFPRSxDQVBGLEVBUUU7QUFBUSxhQUFLLEVBQUM7QUFBZCxTQXBCUixLQW9CUSxDQVJGLENBSkYsQ0FORixDQUZGLEVBd0JFO0FBQUssaUJBQVMsRUFBQztBQUFmLFNBQ0U7QUFBTyxpQkFBUyxFQUFDO0FBQWpCLFNBQ0UscUJBQ0Usa0JBQ0Usa0JBREYsYUFDRSxDQURGLEVBRUUsa0JBRkYseUJBRUUsQ0FGRixFQUdFO0FBQUksZUFBTyxFQUFFO0FBQWIsUUFIRixDQURGLENBREYsRUFRRSxxQkFDRyx1QkFBdUIsa0JBQXVCO0FBQzdDLGVBQ0U7QUFBSSxhQUFHLEVBQUVDLE1BQU0sQ0FBQ0M7QUFBaEIsV0FDRSxrQkFBS0QsTUFBTSxDQURiLFFBQ0UsQ0FERixFQUVFLGtCQUFLQSxNQUFNLENBRmIscUJBRUUsQ0FGRixFQUdFLGtCQUNFO0FBQ0UsbUJBQVMsRUFEWDtBQUVFLGlCQUFPLEVBQUU7QUFBQSxtQkFBTSxNQUFJLENBQUosS0FBTixNQUFNLENBQU47QUFBQTtBQUZYLFdBSkosUUFJSSxDQURGLENBSEYsRUFXRSxrQkFDRTtBQUNFLG1CQUFTLEVBRFg7QUFFRSxpQkFBTyxFQUFFO0FBQUEsbUJBQU0sTUFBSSxDQUFKLFFBQUksQ0FBSixDQUFZQSxNQUFNLENBQXhCLFFBQU0sQ0FBTjtBQUFBO0FBRlgsV0FiTixTQWFNLENBREYsQ0FYRixDQURGO0FBbkNWLE9Ba0NTLENBREgsQ0FSRixDQURGLENBeEJGLEVBNkRFO0FBQ0UsZ0JBQVEsRUFBRSxXQURaO0FBRUUsd0JBQWdCLEVBQUUsS0FBS0U7QUFGekIsUUE3REYsQ0FERjtBQW9FRDs7OztFQXhIbUJDLCtDOztBQTJIdEIiLCJmaWxlIjoic3RhdGljL3dlYnBhY2svcGFnZXMvY2xpZW50cy45MThlMWNjOGI0ZDlhNTk4YzlkNy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IENsaWVudERUTyBmcm9tICcuLi9tb2RlbHMvZHRvcy9jbGllbnQtZHRvJztcclxuaW1wb3J0IFBhZ2luYXRvciBmcm9tICcuL1BhZ2luYXRvcic7XHJcbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XHJcblxyXG5jbGFzcyBDbGllbnRzIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBzdGF0ZSA9IHtcclxuICAgIGNsaWVudHM6IFtdLFxyXG4gICAgcm93Q291bnQ6IDAsXHJcbiAgICBsYXN0UGFnZTogMCxcclxuICAgIGNvdW50OiAxLFxyXG4gICAgcGFnZTogMSxcclxuICB9O1xyXG5cclxuICBnZXRDbGllbnRzID0gYXN5bmMgKHBhZ2UsIGNvdW50KSA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChcclxuICAgICAgYC9hcGkvY2xpZW50cz9wYWdlPSR7cGFnZX0mY291bnQ9JHtjb3VudH1gXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjbGllbnRzOiByZXNwb25zZS5kYXRhLnJvd3MsXHJcbiAgICAgIHJvd0NvdW50OiByZXNwb25zZS5kYXRhLmNvdW50LFxyXG4gICAgICBsYXN0UGFnZTogTWF0aC5jZWlsKHRoaXMuc3RhdGUucm93Q291bnQgLyB0aGlzLnN0YXRlLmNvdW50KSxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcImRpZCBtb3VudFwiKSAgICBcclxuICB9O1xyXG5cclxuICBoYW5kbGVQYWdlQ2hhbmdlID0gYXN5bmMgKHBhZ2U6IG51bWJlcikgPT4ge1xyXG4gICAgdGhpcy5zdGF0ZS5wYWdlID0gcGFnZTtcclxuICAgIGF3YWl0IHRoaXMuY29tcG9uZW50RGlkTW91bnQoKTtcclxuICB9O1xyXG5cclxuICBkZWxldGUgPSBhc3luYyAoY2xpZW50SWQ6IHN0cmluZykgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5jb25maXJtKCdFcnR1IHZpc3MgdW0gYcOwIMO+w7ogdmlsamlyIGV5w7BhIMO+ZXNzYXJpIGbDpnJzbHU/JykpIHtcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5kZWxldGUoYC4vY2xpZW50cy8ke2NsaWVudElkfWApO1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgIGF3YWl0IHRoaXMuY29tcG9uZW50RGlkTW91bnQoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBlZGl0ID0gYXN5bmMgKGNsaWVudDogQ2xpZW50RFRPKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhjbGllbnQpO1xyXG4gIH07XHJcblxyXG4gIGNoYW5nZUNvdW50KGNvdW50OiBzdHJpbmcpIHtcclxuICAgIHRoaXMuZ2V0Q2xpZW50cygxLCArY291bnQpO1xyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjb3VudDogK2NvdW50LFxyXG4gICAgICBwYWdlOiAxLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudHNfX2NvbnRhaW5lclwiPlxyXG4gICAgICAgIDxoMj5WZWZpciBvZyBzbcOhZm9ycml0PC9oMj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudHNfX2NvbnRhaW5lcl9fb3B0aW9uc1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRzX19jb250YWluZXJfX2J1dHRvblwiPlxyXG4gICAgICAgICAgICA8TGluayBocmVmPXsnL2NsaWVudCd9PlxyXG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImNsaWVudHNfX2J1dHRvbl9fbmV3XCI+QsOmdGEgdmnDsCBuw71qdW08L2E+XHJcbiAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRzX19jb250YWluZXJfX2ZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiY291bnRcIiBjbGFzc05hbWU9XCJjbGllbnRzX19sYWJlbFwiPlxyXG4gICAgICAgICAgICAgIEZqw7ZsZGkgw6Egc8Otw7B1XHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxzZWxlY3RcclxuICAgICAgICAgICAgICBpZD1cImNvdW50XCJcclxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHRoaXMuY2hhbmdlQ291bnQoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudHNfX3NlbGVjdFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMVwiPjE8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMzBcIj4zMDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI1MFwiPjUwPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjEwMFwiPjEwMDwvb3B0aW9uPlxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50X19jb250YWluZXJfX3RhYmxlXCI+XHJcbiAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwiY2xpZW50c19fdGFibGVcIj5cclxuICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgIDx0aD5BdcOwa2Vubmk8L3RoPlxyXG4gICAgICAgICAgICAgICAgPHRoPklkZW50aXR5IHRva2VuIGxpZmV0aW1lPC90aD5cclxuICAgICAgICAgICAgICAgIDx0aCBjb2xTcGFuPXsyfT48L3RoPlxyXG4gICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5jbGllbnRzLm1hcCgoY2xpZW50OiBDbGllbnREVE8pID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2NsaWVudC5jbGllbnRJZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPntjbGllbnQuY2xpZW50SWR9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+e2NsaWVudC5pZGVudGl0eVRva2VuTGlmZXRpbWV9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudHNfX2J1dHRvbl9fZWRpdFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuZWRpdChjbGllbnQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBCcmV5dGFcclxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjbGllbnRzX19idXR0b25fX2RlbGV0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuZGVsZXRlKGNsaWVudC5jbGllbnRJZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEV5w7BhXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPFBhZ2luYXRvclxyXG4gICAgICAgICAgbGFzdFBhZ2U9e3RoaXMuc3RhdGUubGFzdFBhZ2V9XHJcbiAgICAgICAgICBoYW5kbGVQYWdlQ2hhbmdlPXt0aGlzLmhhbmRsZVBhZ2VDaGFuZ2V9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50cztcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==