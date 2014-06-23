module ttsort {
    export class InputParser {
        
        forEachEntries(input : string, iterator : (from : string, to : string) => void) {
            if (_.isEmpty(input)) {
                throw 'Input が入力されていません。';
            }
            
            var entries = input.split(/\n/);
            
            _.each(entries, (line : string) => {
                if (line) {
                    var values = $.trim(line).split(/ +/);
                    
                    if (values.length !== 2) {
                        throw 'Input のフォーマットが不正です。';
                    }
                    
                    iterator(values[0], values[1]);
                }
            });
        }
    }
}