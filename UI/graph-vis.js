cytoscape({

  container: document.getElementById('cy'),

  elements: [ { data: { id: 1 }, position: { x: -1000, y: 0 } },
    { data: { id: 2 }, position: { x: -750, y: 0 } },
    { data: { id: 3 }, position: { x: -500, y: 0 } },
    { data: { id: 4 }, position: { x: -250, y: 0 } },
    { data: { id: 5 }, position: { x: 0, y: 0 } },
    { data: { id: 6 }, position: { x: 250, y: -200 } },
    { data: { id: 7 }, position: { x: 500, y: -200 } },
    { data: { id: 8 }, position: { x: 750, y: -200 } },
    { data: { id: 9 }, position: { x: 1000, y: -200 } },
    { data: { id: 10 }, position: { x: 1250, y: -200 } },
    { data: { id: 11 }, position: { x: 1500, y: -200 } },
    { data: { id: 12 }, position: { x: 1750, y: -200 } },
    { data: { id: 13 }, position: { x: 2000, y: -200 } },
    { data: { id: 'edge0', source: 1, target: 2 } },
    { data: { id: 'edge1', source: 2, target: 3 } },
    { data: { id: 'edge2', source: 3, target: 4 } },
    { data: { id: 'edge3', source: 4, target: 5 } },
    { data: { id: 'edge4', source: 5, target: 6 } },
    { data: { id: 'edge5', source: 6, target: 7 } },
    { data: { id: 'edge6', source: 7, target: 8 } },
    { data: { id: 'edge7', source: 8, target: 9 } },
    { data: { id: 'edge8', source: 9, target: 10 } },
    { data: { id: 'edge9', source: 10, target: 11 } },
    { data: { id: 'edge10', source: 11, target: 12 } },
    { data: { id: 'edge11', source: 12, target: 13 } } ],

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