declare module ttsort {
    class Graph {
        private nodes;
        private nodeMap;
        public getEntryNodes(): Node[];
        public hasEdge(): boolean;
        public addNode(from: string, to: string): void;
    }
}
declare module ttsort {
    class Node {
        private name;
        private nextNodes;
        private previousNodes;
        constructor(name: string);
        public addNextNode(next: Node): void;
        public isEntryNode(): boolean;
        public forEachNextNode(iterator: (t: Node) => void): void;
        public hasNextNode(): boolean;
        public removeAllNextNodes(): void;
        public removePreviousNode(node: Node): void;
        public toString(): string;
    }
}
declare module ttsort {
    class TTSort {
        private graph;
        constructor(graph: Graph);
        public sort(): Node[];
    }
}
