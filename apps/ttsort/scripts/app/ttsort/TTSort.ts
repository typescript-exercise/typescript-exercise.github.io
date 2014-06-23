module ttsort {
    export class TTSort {
        
        private graph : Graph;
        
        constructor(graph : Graph) {
            this.graph = graph;
        }
        
        sort() : Node[] {
            var entryNodes = this.graph.getEntryNodes();
            var result : Node[] = [];
            
            while (!_.isEmpty(entryNodes)) {
                
                var node = entryNodes.pop();
                result.push(node);
                
                node.forEachNextNode( next => {
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
        }
    }
}
