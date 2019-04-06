cytoscape({

  container: document.getElementById('cy'),

  elements: {{data}},

  layout: {
    name: 'preset'
  },

  // so we can see the ids
  style: [
    {
      selector: 'node',
      style: {
        'label': 'data(text)'
      }
    }
  ]

})