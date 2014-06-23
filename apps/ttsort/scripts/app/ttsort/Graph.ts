module ttsort {
    export class Graph {
        
        private nodeMap : {[key : string] : Node} = {};
        
        addNodes(from : Node, to : Node) {
            var fromNode = this.register(from);
            var toNode = this.register(to);
            
            fromNode.addNextNode(toNode);
        }
        
        hasEdge() : boolean {
            return _.any(this.nodeMap, (node : Node) => node.hasNextNode());
        }
        
        getEntryNodes() : Node[] {
            return _.filter(this.nodeMap, (node : Node) => node.isEntryNode());
        }
        
        getNode(name : string) : Node {
            return this.nodeMap[name];
        }
        
        private register(node : Node) : Node {
            var name = node.toString();
            
            if (name in this.nodeMap) {
                return this.nodeMap[name];
            } else {
                this.nodeMap[name] = node;
                return node;
            }
        }
    }
}
