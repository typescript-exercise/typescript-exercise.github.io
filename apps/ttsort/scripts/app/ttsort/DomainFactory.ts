module ttsort {
    export class DomainFactory {
        createGraph = () : Graph => {
            return new Graph();
        };
        
        createTTSort = (graph : Graph) : TTSort => {
            return new TTSort(graph);
        };
        
        createNode = (name : string) : Node => {
            return new Node(name);
        };
        
        createFormatter = () : OutputFormatter => {
            return new OutputFormatter();
        };
        
        createParser = () : InputParser => {
            return new InputParser();
        };
    };
}
