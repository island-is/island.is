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

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "componentDidMount", /*#__PURE__*/Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      var response;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return axios__WEBPACK_IMPORTED_MODULE_10___default.a.get("/api/clients?page=".concat(_this.state.page, "&count=").concat(_this.state.count));

            case 2:
              response = _context.sent;
              console.log(response);

              _this.setState({
                clients: response.data.rows,
                rowCount: response.data.count,
                lastPage: Math.ceil(_this.state.rowCount / _this.state.count)
              });

              console.log(response.data);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "handlePageChange", /*#__PURE__*/function () {
      var _ref2 = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(page) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this.state.page = page;
                _context2.next = 3;
                return _this.componentDidMount();

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "delete", /*#__PURE__*/function () {
      var _ref3 = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(clientId) {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!window.confirm('Ertu viss um að þú viljir eyða þessari færslu?')) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 3;
                return axios__WEBPACK_IMPORTED_MODULE_10___default.a["delete"]("./clients/".concat(clientId));

              case 3:
                response = _context3.sent;
                console.log(response);
                _context3.next = 7;
                return _this.componentDidMount();

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "edit", /*#__PURE__*/function () {
      var _ref4 = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(client) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                console.log(client);

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());

    return _this;
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Clients, [{
    key: "changeCount",
    value: function changeCount(count) {
      this.setState({
        count: +count,
        page: 1
      });
      this.componentDidMount();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9DbGllbnRzLnRzeCJdLCJuYW1lcyI6WyJDbGllbnRzIiwiY2xpZW50cyIsInJvd0NvdW50IiwibGFzdFBhZ2UiLCJjb3VudCIsInBhZ2UiLCJheGlvcyIsInJlc3BvbnNlIiwiY29uc29sZSIsIk1hdGgiLCJ3aW5kb3ciLCJlIiwiY2xpZW50IiwiY2xpZW50SWQiLCJoYW5kbGVQYWdlQ2hhbmdlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFFQTtBQUNBOztJQUVNQSxPOzs7Ozs7Ozs7Ozs7Ozs7O2dOQUNJO0FBQ05DLGFBQU8sRUFERDtBQUVOQyxjQUFRLEVBRkY7QUFHTkMsY0FBUSxFQUhGO0FBSU5DLFdBQUssRUFKQztBQUtOQyxVQUFJLEVBQUU7QUFMQSxLOzswWkFRWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUNLQyw2Q0FBSyxDQUFMQSxnQ0FDQSxZQURBQSx3QkFDeUIsWUFGOUIsS0FDS0EsRUFETDs7QUFBQTtBQUNaQyxzQkFEWSxnQkFDWkE7QUFHTkMscUJBQU8sQ0FBUEE7O0FBQ0EsNkJBQWM7QUFDWlAsdUJBQU8sRUFBRU0sUUFBUSxDQUFSQSxLQURHO0FBRVpMLHdCQUFRLEVBQUVLLFFBQVEsQ0FBUkEsS0FGRTtBQUdaSix3QkFBUSxFQUFFTSxJQUFJLENBQUpBLEtBQVUsdUJBQXNCLFlBQWhDQTtBQUhFLGVBQWQ7O0FBTUFELHFCQUFPLENBQVBBLElBQVlELFFBQVEsQ0FBcEJDOztBQVhrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7bU1BY0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNqQjtBQURpQjtBQUFBLHVCQUVYLE1BRlcsaUJBRVgsRUFGVzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7OzttTUFLVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFDSEUsTUFBTSxDQUFOQSxRQURHLGdEQUNIQSxDQURHO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsdUJBRWtCSiw2Q0FBSyxDQUFMQSxRQUFLLENBQUxBLHFCQUZsQixRQUVrQkEsRUFGbEI7O0FBQUE7QUFFQ0Msd0JBRkQsaUJBRUNBO0FBQ05DLHVCQUFPLENBQVBBO0FBSEs7QUFBQSx1QkFJQyxNQUpELGlCQUlDLEVBSkQ7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7bU1BUUY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNMQSx1QkFBTyxDQUFQQTs7QUFESztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Z0NBSUtKLEssRUFBZTtBQUN6QixvQkFBYztBQUNaQSxhQUFLLEVBQUUsQ0FESztBQUVaQyxZQUFJLEVBQUU7QUFGTSxPQUFkO0FBS0E7QUFDRDs7OzZCQUVRO0FBQUE7O0FBQ1AsYUFDRTtBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNFLGtCQURGLHVCQUNFLENBREYsRUFFRTtBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNFO0FBQUssaUJBQVMsRUFBQztBQUFmLFNBQ0U7QUFBTSxZQUFJLEVBQUU7QUFBWixTQUNFO0FBQUcsaUJBQVMsRUFBQztBQUFiLFNBSE4seUJBR00sQ0FERixDQURGLENBREYsRUFNRTtBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNFO0FBQU8sZUFBTyxFQUFkO0FBQXVCLGlCQUFTLEVBQUM7QUFBakMsU0FERiwyQkFDRSxDQURGLEVBSUU7QUFDRSxVQUFFLEVBREo7QUFFRSxnQkFBUSxFQUFFO0FBQUEsaUJBQU8sTUFBSSxDQUFKLFlBQWlCTSxDQUFDLENBQURBLE9BQXhCLEtBQU8sQ0FBUDtBQUZaO0FBR0UsaUJBQVMsRUFBQztBQUhaLFNBS0U7QUFBUSxhQUFLLEVBQUM7QUFBZCxTQUxGLEdBS0UsQ0FMRixFQU1FO0FBQVEsYUFBSyxFQUFDO0FBQWQsU0FORixJQU1FLENBTkYsRUFPRTtBQUFRLGFBQUssRUFBQztBQUFkLFNBUEYsSUFPRSxDQVBGLEVBUUU7QUFBUSxhQUFLLEVBQUM7QUFBZCxTQXBCUixLQW9CUSxDQVJGLENBSkYsQ0FORixDQUZGLEVBd0JFO0FBQUssaUJBQVMsRUFBQztBQUFmLFNBQ0U7QUFBTyxpQkFBUyxFQUFDO0FBQWpCLFNBQ0UscUJBQ0Usa0JBQ0Usa0JBREYsYUFDRSxDQURGLEVBRUUsa0JBRkYseUJBRUUsQ0FGRixFQUdFO0FBQUksZUFBTyxFQUFFO0FBQWIsUUFIRixDQURGLENBREYsRUFRRSxxQkFDRyx1QkFBdUIsa0JBQXVCO0FBQzdDLGVBQ0U7QUFBSSxhQUFHLEVBQUVDLE1BQU0sQ0FBQ0M7QUFBaEIsV0FDRSxrQkFBS0QsTUFBTSxDQURiLFFBQ0UsQ0FERixFQUVFLGtCQUFLQSxNQUFNLENBRmIscUJBRUUsQ0FGRixFQUdFLGtCQUNFO0FBQ0UsbUJBQVMsRUFEWDtBQUVFLGlCQUFPLEVBQUU7QUFBQSxtQkFBTSxNQUFJLENBQUosS0FBTixNQUFNLENBQU47QUFBQTtBQUZYLFdBSkosUUFJSSxDQURGLENBSEYsRUFXRSxrQkFDRTtBQUNFLG1CQUFTLEVBRFg7QUFFRSxpQkFBTyxFQUFFO0FBQUEsbUJBQU0sTUFBSSxDQUFKLFFBQUksQ0FBSixDQUFZQSxNQUFNLENBQXhCLFFBQU0sQ0FBTjtBQUFBO0FBRlgsV0FiTixTQWFNLENBREYsQ0FYRixDQURGO0FBbkNWLE9Ba0NTLENBREgsQ0FSRixDQURGLENBeEJGLEVBNkRFO0FBQ0UsZ0JBQVEsRUFBRSxXQURaO0FBRUUsd0JBQWdCLEVBQUUsS0FBS0U7QUFGekIsUUE3REYsQ0FERjtBQW9FRDs7OztFQXRIbUJDLCtDOztBQXlIdEIiLCJmaWxlIjoic3RhdGljL3dlYnBhY2svcGFnZXMvY2xpZW50cy4wNmZiMmJiYWY4N2ZiNDg3ZjBmZS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcclxuaW1wb3J0IENsaWVudERUTyBmcm9tICcuLi9tb2RlbHMvZHRvcy9jbGllbnQtZHRvJztcclxuaW1wb3J0IFBhZ2luYXRvciBmcm9tICcuL1BhZ2luYXRvcic7XHJcbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XHJcblxyXG5jbGFzcyBDbGllbnRzIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBzdGF0ZSA9IHtcclxuICAgIGNsaWVudHM6IFtdLFxyXG4gICAgcm93Q291bnQ6IDAsXHJcbiAgICBsYXN0UGFnZTogMCxcclxuICAgIGNvdW50OiAxLFxyXG4gICAgcGFnZTogMSxcclxuICB9O1xyXG5cclxuICBjb21wb25lbnREaWRNb3VudCA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KFxyXG4gICAgICBgL2FwaS9jbGllbnRzP3BhZ2U9JHt0aGlzLnN0YXRlLnBhZ2V9JmNvdW50PSR7dGhpcy5zdGF0ZS5jb3VudH1gXHJcbiAgICApO1xyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGNsaWVudHM6IHJlc3BvbnNlLmRhdGEucm93cyxcclxuICAgICAgcm93Q291bnQ6IHJlc3BvbnNlLmRhdGEuY291bnQsXHJcbiAgICAgIGxhc3RQYWdlOiBNYXRoLmNlaWwodGhpcy5zdGF0ZS5yb3dDb3VudCAvIHRoaXMuc3RhdGUuY291bnQpLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgaGFuZGxlUGFnZUNoYW5nZSA9IGFzeW5jIChwYWdlOiBudW1iZXIpID0+IHtcclxuICAgIHRoaXMuc3RhdGUucGFnZSA9IHBhZ2U7XHJcbiAgICBhd2FpdCB0aGlzLmNvbXBvbmVudERpZE1vdW50KCk7XHJcbiAgfTtcclxuXHJcbiAgZGVsZXRlID0gYXN5bmMgKGNsaWVudElkOiBzdHJpbmcpID0+IHtcclxuICAgIGlmICh3aW5kb3cuY29uZmlybSgnRXJ0dSB2aXNzIHVtIGHDsCDDvsO6IHZpbGppciBlecOwYSDDvmVzc2FyaSBmw6Zyc2x1PycpKSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZGVsZXRlKGAuL2NsaWVudHMvJHtjbGllbnRJZH1gKTtcclxuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICBhd2FpdCB0aGlzLmNvbXBvbmVudERpZE1vdW50KCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZWRpdCA9IGFzeW5jIChjbGllbnQ6IENsaWVudERUTykgPT4ge1xyXG4gICAgY29uc29sZS5sb2coY2xpZW50KTtcclxuICB9O1xyXG5cclxuICBjaGFuZ2VDb3VudChjb3VudDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY291bnQ6ICtjb3VudCxcclxuICAgICAgcGFnZTogMSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQoKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50c19fY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGgyPlZlZmlyIG9nIHNtw6Fmb3JyaXQ8L2gyPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2xpZW50c19fY29udGFpbmVyX19vcHRpb25zXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudHNfX2NvbnRhaW5lcl9fYnV0dG9uXCI+XHJcbiAgICAgICAgICAgIDxMaW5rIGhyZWY9eycvY2xpZW50J30+XHJcbiAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiY2xpZW50c19fYnV0dG9uX19uZXdcIj5Cw6Z0YSB2acOwIG7DvWp1bTwvYT5cclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNsaWVudHNfX2NvbnRhaW5lcl9fZmllbGRcIj5cclxuICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJjb3VudFwiIGNsYXNzTmFtZT1cImNsaWVudHNfX2xhYmVsXCI+XHJcbiAgICAgICAgICAgICAgRmrDtmxkaSDDoSBzw63DsHVcclxuICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgIGlkPVwiY291bnRcIlxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5jaGFuZ2VDb3VudChlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50c19fc2VsZWN0XCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIxXCI+MTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIzMFwiPjMwPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjUwXCI+NTA8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMTAwXCI+MTAwPC9vcHRpb24+XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjbGllbnRfX2NvbnRhaW5lcl9fdGFibGVcIj5cclxuICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9XCJjbGllbnRzX190YWJsZVwiPlxyXG4gICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgPHRoPkF1w7BrZW5uaTwvdGg+XHJcbiAgICAgICAgICAgICAgICA8dGg+SWRlbnRpdHkgdG9rZW4gbGlmZXRpbWU8L3RoPlxyXG4gICAgICAgICAgICAgICAgPHRoIGNvbFNwYW49ezJ9PjwvdGg+XHJcbiAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmNsaWVudHMubWFwKChjbGllbnQ6IENsaWVudERUTykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgPHRyIGtleT17Y2xpZW50LmNsaWVudElkfT5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+e2NsaWVudC5jbGllbnRJZH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57Y2xpZW50LmlkZW50aXR5VG9rZW5MaWZldGltZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2xpZW50c19fYnV0dG9uX19lZGl0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5lZGl0KGNsaWVudCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJyZXl0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNsaWVudHNfX2J1dHRvbl9fZGVsZXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5kZWxldGUoY2xpZW50LmNsaWVudElkKX1cclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRXnDsGFcclxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8UGFnaW5hdG9yXHJcbiAgICAgICAgICBsYXN0UGFnZT17dGhpcy5zdGF0ZS5sYXN0UGFnZX1cclxuICAgICAgICAgIGhhbmRsZVBhZ2VDaGFuZ2U9e3RoaXMuaGFuZGxlUGFnZUNoYW5nZX1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDbGllbnRzO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9