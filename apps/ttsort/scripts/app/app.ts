/// <reference path="ttsort/DomainFactory.ts"/>

import DomainFactory = ttsort.DomainFactory;

angular
.module('ttsort', [])
.factory('domainFactory', () => {
    return new DomainFactory();
})
.controller('MainController', ['$scope', 'domainFactory', (scope, factory : DomainFactory) => {
    
    var inputParser = factory.createParser();
    var outputFormatter = factory.createFormatter();
    
    scope.sort = () => {
        try {
            var graph = factory.createGraph();
            
            inputParser.forEachEntries(scope.input, (from, to) => {
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
