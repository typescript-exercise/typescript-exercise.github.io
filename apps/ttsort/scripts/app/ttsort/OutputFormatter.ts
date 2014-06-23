module ttsort {
    export class OutputFormatter {
        
        format(nodes : Node[]) : string {
            return _.reduce(nodes, (memo : string, node : Node) => memo + '\n' + node);
        }
    }
}