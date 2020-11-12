webpackHotUpdate_N_E("pages/clients",{

/***/ "./components/Paginator.tsx":
/*!**********************************!*\
  !*** ./components/Paginator.tsx ***!
  \**********************************/
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



var Paginator = /*#__PURE__*/function (_Component) {
  Object(_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(Paginator, _Component);

  var _super = _createSuper(Paginator);

  function Paginator() {
    var _this;

    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, Paginator);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "state", void 0);

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "next", /*#__PURE__*/Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(_this.state.page === _this.props.lastPage)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _this.setState({
                page: _this.state.page++
              });

              _this.props.handlePageChange(_this.state.page);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])(Object(_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_4__["default"])(_this), "previous", /*#__PURE__*/Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(_this.state.page === 1)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return");

            case 2:
              _this.setState({
                page: _this.state.page--
              });

              _this.props.handlePageChange(_this.state.page);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));

    return _this;
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(Paginator, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.lastPage !== this.state.lastPage) {
        this.setState({
          page: 1
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return __jsx("nav", {
        className: "paginator__pagination"
      }, __jsx("li", {
        className: "paginator__page-item"
      }, __jsx("button", {
        onClick: this.previous,
        className: "paginator__pagination-previous",
        disabled: this.state.page === 1
      }, "Back")), __jsx("li", {
        className: "paginator__page-item"
      }, __jsx("button", {
        onClick: this.next,
        className: "paginator__pagination-next",
        disabled: this.state.page === this.state.lastPage
      }, "Next")));
    }
  }]);

  return Paginator;
}(react__WEBPACK_IMPORTED_MODULE_9__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Paginator);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9QYWdpbmF0b3IudHN4Il0sIm5hbWVzIjpbIlBhZ2luYXRvciIsInBhZ2UiLCJsYXN0UGFnZSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBR01BLFM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2WUFhRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsb0JBQ0QscUJBQW9CLFlBRG5CO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBS0wsNkJBQWM7QUFBQ0Msb0JBQUksRUFBRTtBQUFQLGVBQWQ7O0FBQ0EsMkNBQTRCLFlBQTVCOztBQU5LO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O2laQVNJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvQkFDTCxxQkFESztBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUtULDZCQUFjO0FBQUVBLG9CQUFJLEVBQUU7QUFBUixlQUFkOztBQUNBLDJDQUE0QixZQUE1Qjs7QUFOUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7O3lDQWZTO0FBQ2xCLFVBQUksd0JBQXdCLFdBQTVCLFVBQWdEO0FBQzlDLHNCQUFjO0FBQUNBLGNBQUksRUFBRTtBQUFQLFNBQWQ7QUFDRDtBQUNGOzs7NkJBb0JRO0FBQ1AsYUFDRTtBQUFLLGlCQUFTLEVBQUM7QUFBZixTQUNFO0FBQUksaUJBQVMsRUFBQztBQUFkLFNBQ0U7QUFDRSxlQUFPLEVBQUUsS0FEWDtBQUVFLGlCQUFTLEVBRlg7QUFHRSxnQkFBUSxFQUFFLG9CQUFvQjtBQUhoQyxTQUZKLE1BRUksQ0FERixDQURGLEVBVUU7QUFBSSxpQkFBUyxFQUFDO0FBQWQsU0FDRTtBQUNFLGVBQU8sRUFBRSxLQURYO0FBRUUsaUJBQVMsRUFGWDtBQUdFLGdCQUFRLEVBQUUsb0JBQW9CLFdBQVdDO0FBSDNDLFNBWk4sTUFZTSxDQURGLENBVkYsQ0FERjtBQXNCRDs7OztFQXREcUJDLCtDOztBQXlEeEIiLCJmaWxlIjoic3RhdGljL3dlYnBhY2svcGFnZXMvY2xpZW50cy5iM2NlNjg2YWMwOWQxODZjYzVhNi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuXHJcbmNsYXNzIFBhZ2luYXRvciBleHRlbmRzIENvbXBvbmVudDx7IGxhc3RQYWdlOiBudW1iZXI7IGhhbmRsZVBhZ2VDaGFuZ2U6IGFueSB9PiB7XHJcbiAgc3RhdGU6IHtcclxuICAgIHBhZ2U6IDEsXHJcbiAgICBsYXN0UGFnZTogMFxyXG4gIH1cclxuXHJcblxyXG4gIGNvbXBvbmVudERpZFVwZGF0ZSgpe1xyXG4gICAgaWYgKHRoaXMucHJvcHMubGFzdFBhZ2UgIT09IHRoaXMuc3RhdGUubGFzdFBhZ2Upe1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtwYWdlOiAxfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZXh0ID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuc3RhdGUucGFnZSA9PT0gdGhpcy5wcm9wcy5sYXN0UGFnZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7cGFnZTogdGhpcy5zdGF0ZS5wYWdlKyt9KTtcclxuICAgIHRoaXMucHJvcHMuaGFuZGxlUGFnZUNoYW5nZSh0aGlzLnN0YXRlLnBhZ2UpO1xyXG4gIH07XHJcblxyXG4gIHByZXZpb3VzID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuc3RhdGUucGFnZSA9PT0gMSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHRoaXMuc3RhdGUucGFnZS0tfSk7XHJcbiAgICB0aGlzLnByb3BzLmhhbmRsZVBhZ2VDaGFuZ2UodGhpcy5zdGF0ZS5wYWdlKTtcclxuICB9O1xyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8bmF2IGNsYXNzTmFtZT1cInBhZ2luYXRvcl9fcGFnaW5hdGlvblwiPlxyXG4gICAgICAgIDxsaSBjbGFzc05hbWU9XCJwYWdpbmF0b3JfX3BhZ2UtaXRlbVwiPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByZXZpb3VzfVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwYWdpbmF0b3JfX3BhZ2luYXRpb24tcHJldmlvdXNcIlxyXG4gICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5zdGF0ZS5wYWdlID09PSAxfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBCYWNrXHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2xpPlxyXG4gICAgICAgIDxsaSBjbGFzc05hbWU9XCJwYWdpbmF0b3JfX3BhZ2UtaXRlbVwiPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm5leHR9XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInBhZ2luYXRvcl9fcGFnaW5hdGlvbi1uZXh0XCJcclxuICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMuc3RhdGUucGFnZSA9PT0gdGhpcy5zdGF0ZS5sYXN0UGFnZX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgTmV4dFxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9saT5cclxuICAgICAgPC9uYXY+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGFnaW5hdG9yO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9