cytoscape({

  container: document.getElementById('cy'),

  elements: [{"data":{"id":1},"position":{"x":-1250,"y":0}},{"data":{"id":2},"position":{"x":-1000,"y":0}},{"data":{"id":3},"position":{"x":-750,"y":0}},{"data":{"id":4},"position":{"x":-500,"y":0}},{"data":{"id":5},"position":{"x":-250,"y":0}},{"data":{"id":6},"position":{"x":0,"y":0}},{"data":{"id":7},"position":{"x":250,"y":-200}},{"data":{"id":8},"position":{"x":500,"y":-200}},{"data":{"id":9},"position":{"x":750,"y":-200}},{"data":{"id":10},"position":{"x":1000,"y":-200}},{"data":{"id":11},"position":{"x":1250,"y":-200}},{"data":{"id":12},"position":{"x":1500,"y":-200}},{"data":{"id":13},"position":{"x":250,"y":200}},{"data":{"id":14},"position":{"x":500,"y":200}},{"data":{"id":15},"position":{"x":750,"y":200}},{"data":{"id":16},"position":{"x":1000,"y":200}},{"data":{"id":17},"position":{"x":1250,"y":200}},{"data":{"id":18},"position":{"x":-750,"y":500}},{"data":{"id":19},"position":{"x":-500,"y":500}},{"data":{"id":20},"position":{"x":-250,"y":500}},{"data":{"id":21},"position":{"x":0,"y":500}},{"data":{"id":22},"position":{"x":0,"y":-500}},{"data":{"id":23},"position":{"x":-250,"y":-500}},{"data":{"id":24},"position":{"x":-1250,"y":800}},{"data":{"id":25},"position":{"x":-1000,"y":800}},{"data":{"id":26},"position":{"x":-750,"y":800}},{"data":{"id":27},"position":{"x":-500,"y":800}},{"data":{"id":28},"position":{"x":-250,"y":800}},{"data":{"id":29},"position":{"x":0,"y":800}},{"data":{"id":30},"position":{"x":0,"y":-800}},{"data":{"id":31},"position":{"x":0,"y":1100}},{"data":{"id":32},"position":{"x":0,"y":-1100}},{"data":{"id":"edge0","source":1,"target":2}},{"data":{"id":"edge1","source":2,"target":3}},{"data":{"id":"edge2","source":3,"target":4}},{"data":{"id":"edge3","source":4,"target":5}},{"data":{"id":"edge4","source":5,"target":6}},{"data":{"id":"edge5","source":6,"target":7}},{"data":{"id":"edge6","source":7,"target":8}},{"data":{"id":"edge7","source":8,"target":9}},{"data":{"id":"edge8","source":9,"target":10}},{"data":{"id":"edge9","source":10,"target":11}},{"data":{"id":"edge10","source":11,"target":12}},{"data":{"id":"edge11","source":6,"target":13}},{"data":{"id":"edge12","source":13,"target":14}},{"data":{"id":"edge13","source":14,"target":15}},{"data":{"id":"edge14","source":15,"target":16}},{"data":{"id":"edge15","source":16,"target":17}},{"data":{"id":"edge16","source":4,"target":18}},{"data":{"id":"edge17","source":18,"target":19}},{"data":{"id":"edge18","source":19,"target":20}},{"data":{"id":"edge19","source":20,"target":21}},{"data":{"id":"edge20","source":3,"target":23}},{"data":{"id":"edge21","source":23,"target":22}},{"data":{"id":"edge22","source":24,"target":25}},{"data":{"id":"edge23","source":25,"target":26}},{"data":{"id":"edge24","source":26,"target":27}},{"data":{"id":"edge25","source":27,"target":28}},{"data":{"id":"edge26","source":28,"target":29}}],

  layout: {
    name: 'preset'
  },

  // so we can see the ids
  style: [
    {
      selector: 'node',
      style: {
        'label': 'data(id)'
      }
    }
  ]

});