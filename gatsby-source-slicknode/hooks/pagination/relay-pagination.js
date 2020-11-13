"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayPagination = void 0;
var DEFAULT_PAGE_SIZE = 10;
exports.RelayPagination = {
    name: "RelayPagination",
    expectedVariableNames: ["first", "after"],
    start: function () {
        return {
            variables: { first: DEFAULT_PAGE_SIZE, after: undefined },
            hasNextPage: true,
        };
    },
    next: function (state, page) {
        var _a, _b;
        var tail = page.edges[page.edges.length - 1];
        var first = (_a = Number(state.variables.first)) !== null && _a !== void 0 ? _a : DEFAULT_PAGE_SIZE;
        var after = tail === null || tail === void 0 ? void 0 : tail.cursor;
        return {
            variables: { first: first, after: after },
            hasNextPage: Boolean(((_b = page === null || page === void 0 ? void 0 : page.pageInfo) === null || _b === void 0 ? void 0 : _b.hasNextPage) && tail),
        };
    },
    concat: function (acc, page) {
        return __assign(__assign({}, acc), { edges: __assign(__assign({}, acc.edges), page.edges), pageInfo: page.pageInfo });
    },
    getItems: function (pageOrResult) {
        return pageOrResult.edges.map(function (edge) { return (edge ? edge.node : null); });
    },
};
