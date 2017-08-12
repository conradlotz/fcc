var matchsections = function(nameKey, myArray) {
    var array = myArray.completed;
    for (var i = 0; i < array.length; i++) {
        if (array[i].title === nameKey) {
            return array[i];
        }
    }
};

module.exports = {matchsections:matchsections};