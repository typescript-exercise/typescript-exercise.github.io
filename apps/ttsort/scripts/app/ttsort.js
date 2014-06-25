var ttsort;
(function (ttsort) {
    var DomainFactory = (function () {
        function DomainFactory() {
            this.createGraph = function () {
                return new ttsort.Graph();
            };
            this.createTTSort = function (graph) {
                return new ttsort.TTSort(graph);
            };
            this.createNode = function (name) {
                return new ttsort.Node(name);
            };
            this.createFormatter = function () {
                return new ttsort.OutputFormatter();
            };
            this.createParser = function () {
                return new ttsort.InputParser();
            };
        }
        return DomainFactory;
    })();
    ttsort.DomainFactory = DomainFactory;
    ;
})(ttsort || (ttsort = {}));
var DomainFactory = ttsort.DomainFactory;

angular.module('ttsort', []).factory('domainFactory', function () {
    return new DomainFactory();
}).controller('MainController', [
    '$scope', 'domainFactory', function (scope, factory) {
        var inputParser = factory.createParser();
        var outputFormatter = factory.createFormatter();

        scope.sort = function () {
            try  {
                var graph = factory.createGraph();

                inputParser.forEachEntries(scope.input, function (from, to) {
                    graph.addNodes(factory.createNode(from), factory.createNode(to));
                });

                var ttsort = factory.createTTSort(graph);

                var nodes = ttsort.sort();

                scope.output = outputFormatter.format(nodes);
            } catch (e) {
                if (_.isString(e)) {
                    alert(e);
                } else {
                    throw e;
                }
            }
        };
    }]);
var ttsort;
(function (ttsort) {
    var Graph = (function () {
        function Graph() {
            this.nodeMap = {};
        }
        Graph.prototype.addNodes = function (from, to) {
            var fromNode = this.register(from);
            var toNode = this.register(to);

            fromNode.addNextNode(toNode);
        };

        Graph.prototype.hasEdge = function () {
            return _.any(this.nodeMap, function (node) {
                return node.hasNextNode();
            });
        };

        Graph.prototype.getEntryNodes = function () {
            return _.filter(this.nodeMap, function (node) {
                return node.isEntryNode();
            });
        };

        Graph.prototype.getNode = function (name) {
            return this.nodeMap[name];
        };

        Graph.prototype.register = function (node) {
            var name = node.toString();

            if (name in this.nodeMap) {
                return this.nodeMap[name];
            } else {
                this.nodeMap[name] = node;
                return node;
            }
        };
        return Graph;
    })();
    ttsort.Graph = Graph;
})(ttsort || (ttsort = {}));
var ttsort;
(function (ttsort) {
    var InputParser = (function () {
        function InputParser() {
        }
        InputParser.prototype.forEachEntries = function (input, iterator) {
            if (_.isEmpty(input)) {
                throw 'Input が入力されていません。';
            }

            var entries = input.split(/\n/);

            _.each(entries, function (line) {
                if (line) {
                    var values = $.trim(line).split(/ +/);

                    if (values.length !== 2) {
                        throw 'Input のフォーマットが不正です。';
                    }

                    iterator(values[0], values[1]);
                }
            });
        };
        return InputParser;
    })();
    ttsort.InputParser = InputParser;
})(ttsort || (ttsort = {}));
var ttsort;
(function (ttsort) {
    var Node = (function () {
        function Node(name) {
            this.nextNodes = [];
            this.previousNodes = [];
            this.name = name;
        }
        Node.prototype.addNextNode = function (next) {
            if (!_.contains(this.nextNodes, next)) {
                this.nextNodes.push(next);
                next.previousNodes.push(this);
            }
        };

        Node.prototype.isEntryNode = function () {
            return _.isEmpty(this.previousNodes);
        };

        Node.prototype.hasNextNode = function () {
            return !_.isEmpty(this.nextNodes);
        };

        Node.prototype.forEachNextNode = function (iterator) {
            _.each(_.clone(this.nextNodes), iterator);
        };

        Node.prototype.removePreviousNode = function (node) {
            this.previousNodes = _.reject(this.previousNodes, function (pre) {
                return pre === node;
            });
            var that = this;
            node.nextNodes = _.reject(node.nextNodes, function (next) {
                return next === that;
            });
        };

        Node.prototype.getNextNodes = function () {
            return _.clone(this.nextNodes);
        };

        Node.prototype.getPreviousNodes = function () {
            return _.clone(this.previousNodes);
        };

        Node.prototype.toString = function () {
            return this.name;
        };
        return Node;
    })();
    ttsort.Node = Node;
})(ttsort || (ttsort = {}));
var ttsort;
(function (ttsort) {
    var OutputFormatter = (function () {
        function OutputFormatter() {
        }
        OutputFormatter.prototype.format = function (nodes) {
            return _.reduce(nodes, function (memo, node) {
                return memo + '\n' + node;
            });
        };
        return OutputFormatter;
    })();
    ttsort.OutputFormatter = OutputFormatter;
})(ttsort || (ttsort = {}));
var ttsort;
(function (ttsort) {
    var TTSort = (function () {
        function TTSort(graph) {
            this.graph = graph;
        }
        TTSort.prototype.sort = function () {
            var entryNodes = this.graph.getEntryNodes();
            var result = [];

            while (!_.isEmpty(entryNodes)) {
                var node = entryNodes.pop();
                result.push(node);

                node.forEachNextNode(function (next) {
                    next.removePreviousNode(node);

                    if (next.isEntryNode()) {
                        entryNodes.push(next);
                    }
                });
            }

            if (this.graph.hasEdge()) {
                throw '循環している部分があります。';
            }

            return result;
        };
        return TTSort;
    })();
    ttsort.TTSort = TTSort;
})(ttsort || (ttsort = {}));
//# sourceMappingURL=ttsort.js.map
