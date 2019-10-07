let data = {
  quantity: 0,
  pricePerUnit: 5,
  totalCost: 0
}

let dependentMethods = {}
let methodToBeWatched

let watchedData = new Proxy( data, {
  get( object, property) {
    if ( ! dependentMethods[property] ) {
      dependentMethods[property] = []
    }
    if ((methodToBeWatched !== null) && (! dependentMethods[property].includes(methodToBeWatched)) ) {
      dependentMethods[property].push(methodToBeWatched)
    }
    return object[property]
  },
  set( object, property, value ) {
    if ( object[property] !== value) {
      object[property] = value
      dependentMethods[property].forEach(dependentMethod => {
          dependentMethod()
        })
    }
  }
  })

function costIncurred () {
  watchedData.totalCost = watchedData.quantity * watchedData.pricePerUnit;
}

function invokeMethod (method) {
  methodToBeWatched = method
  method()
  methodToBeWatched = null
}

invokeMethod(costIncurred)

console.log(watchedData.totalCost) //0

watchedData.quantity = 1;

console.log(watchedData.totalCost) //5

watchedData.quantity = 2;

console.log(watchedData.totalCost) //10
