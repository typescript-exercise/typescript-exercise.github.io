module ttsort {
    export class Node {
        
        private name : string;
        private nextNodes : Node[] = [];
        private previousNodes : Node[] = [];
        
        constructor(name : string) {
            this.name = name;
        }
        
        addNextNode(next : Node) {
            this.nextNodes.push(next);
            next.previousNodes.push(this);
        }
        
        isEntryNode() : boolean {
            return _.isEmpty(this.previousNodes);
        }
        
        hasNextNode() : boolean {
            return !_.isEmpty(this.nextNodes);
        }
        
        forEachNextNode(iterator : (next : Node) => void) {
            _.each(_.clone(this.nextNodes), iterator);
        }
        
//        removeNextNodes() {
//            var that = this;
//            _.each(this.nextNodes, (next : Node) => {
//                next.previousNodes = _.reject(next.previousNodes, pre => pre === that);
//            });
//            
//            this.nextNodes = [];
//        }
        
        removePreviousNode(node : Node) {
            this.previousNodes = _.reject(this.previousNodes, pre => pre === node);
            var that = this;
            node.nextNodes = _.reject(node.nextNodes, next => next === that);
        }
        
        getNextNodes() : Node[] {
            return _.clone(this.nextNodes);
        }
        
        getPreviousNodes() : Node[] {
            return _.clone(this.previousNodes);
        }
        
        toString() : string {
            return this.name;
        }
    }
}