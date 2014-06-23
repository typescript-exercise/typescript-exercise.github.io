module ttsort {
    export class Graph {
        private nodes : Node[] = [];
        private nodeMap : {[s:string] : Node;} = {};
        
        getEntryNodes() : Node[] {
            return _.filter(this.nodes, node => node.isEntryNode());
        }
        
        hasEdge() : boolean {
            return _.any(this.nodes, value => value.hasNextNode());
        }
        
        addNode(from : string, to : string) : void {
            var fromNode = this.nodeMap[from];
            
            if (!fromNode) {
                fromNode = new Node(from);
                this.nodes.push(fromNode);
                this.nodeMap[from] = fromNode;
            }
            
            var toNode = this.nodeMap[to];
            
            if (!toNode) {
                toNode = new Node(to);
                this.nodes.push(toNode);
                this.nodeMap[to] = toNode;
            }
            
            fromNode.addNextNode(toNode);
        }
    }
}

module ttsort {
    export class Node {
        private name : string;
        private nextNodes : Node[] = [];
        private previousNodes : Node[] = [];
        
        constructor(name : string) {
            this.name = name;
        }
        
        addNextNode(next : Node) : void {
            this.nextNodes.push(next);
            next.previousNodes.push(this);
        }
        
        isEntryNode() : boolean {
            return _.isEmpty(this.previousNodes);
        }
        
        forEachNextNode(iterator : (t : Node) => void) : void {
            _.each(this.nextNodes, iterator);
        }
        
        hasNextNode() : boolean {
            return !_.isEmpty(this.nextNodes);
        }
        
        removeAllNextNodes() : void {
            _.each(this.nextNodes, next => next.removePreviousNode(this));
            this.nextNodes = [];
        }
        
        removePreviousNode(node : Node) : void {
            this.previousNodes = _.reject(this.previousNodes, pre => pre === node);
        }
        
        toString() : string {
            return this.name;
        }
    }
}

module ttsort {
    export class TTSort {
        private graph : Graph;
        
        constructor(graph : Graph) {
            this.graph = graph;
        }
        
        sort() : Node[] {
            var stack = this.graph.getEntryNodes();
            var list : Node[] = [];
            
            while (!_.isEmpty(stack)) {
                
                var n = stack.pop();
                list.push(n);
                
                n.forEachNextNode( m => {
                    m.removePreviousNode(n);
                    
                    if (m.isEntryNode()) {
                        stack.push(m);
                    }
                });
                
                n.removeAllNextNodes();
            }
            
            if (this.graph.hasEdge()) {
                throw '循環している部分があります。';
            }
            
            return list;
        }
    }
}

import Node = ttsort.Node;
import Graph = ttsort.Graph;
import TTSort = ttsort.TTSort;

angular
.module('ttsort', [])
.controller('MainController', ['$scope', 'inputParser', 'outputFormatter', (scope, inputParser, outputFormatter) => {
    
    scope.sort = () => {
        try {
            var graph = new Graph();
            
            inputParser.forEachEntries(scope.input, (from, to) => {
                graph.addNode(from, to);
            });
            
            var ttsort = new TTSort(graph);
            
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
}])
.service('outputFormatter', function() {
    this.format = (nodes : Node[]) => {
        return _.reduce(nodes, (memo : string, node : Node) => memo + '\n' + node);
    };
})
.service('inputParser', function() {
    this.forEachEntries = (input : string, iterator : (from : string, to : string) => void) => {
        if (!_.isString(input)) {
            throw 'Input の入力が不正です。';
        }
        
        var inputLines = input.split('\n');
        
        _.each(inputLines, (line)=>{
            var values = line.split(/ +/);
            if (values.length !== 2) {
                throw 'Input のフォーマットが不正です。';
            }
            
            var from = values[0];
            var to = values[1];
            
            iterator(from, to);
        });
    };
});
