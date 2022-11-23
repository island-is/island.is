"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveVariables = exports.lva = void 0;
function lva(liveVariablesMap) {
    const worklist = Array.from(liveVariablesMap.values(), lva => lva.segment);
    while (worklist.length > 0) {
        const current = worklist.pop();
        const liveVariables = liveVariablesMap.get(current.id);
        const liveInHasChanged = liveVariables.propagate(liveVariablesMap);
        if (liveInHasChanged) {
            current.prevSegments.forEach(prev => worklist.push(prev));
        }
    }
}
exports.lva = lva;
class LiveVariables {
    constructor(segment) {
        /**
         * variables that are being read in the block
         */
        this.gen = new Set();
        /**
         * variables that are being written in the block
         */
        this.kill = new Set();
        /**
         * variables needed by this or a successor block and are not killed in this block
         */
        this.in = new Set();
        /**
         * variables needed by successors
         */
        this.out = new Set();
        /**
         * collects references in order they are evaluated, set in JS maintains insertion order
         */
        this.references = new Set();
        this.segment = segment;
    }
    add(ref) {
        const variable = ref.resolved;
        if (variable) {
            if (ref.isRead()) {
                this.gen.add(variable);
            }
            if (ref.isWrite()) {
                this.kill.add(variable);
            }
            this.references.add(ref);
        }
    }
    propagate(liveVariablesMap) {
        this.out.clear();
        this.segment.nextSegments.forEach(next => {
            liveVariablesMap.get(next.id).in.forEach(v => this.out.add(v));
        });
        const newIn = union(this.gen, difference(this.out, this.kill));
        if (!equals(this.in, newIn)) {
            this.in = newIn;
            return true;
        }
        else {
            return false;
        }
    }
}
exports.LiveVariables = LiveVariables;
function difference(a, b) {
    return new Set([...a].filter(e => !b.has(e)));
}
function union(a, b) {
    return new Set([...a, ...b]);
}
function equals(a, b) {
    return a.size === b.size && [...a].every(e => b.has(e));
}
//# sourceMappingURL=lva.js.map