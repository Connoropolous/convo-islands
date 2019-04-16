const CONNOR_COLOUR = '#74e2dd'
const ROBERT_COLOUR = '#E8A100'
const SELECTED_COLOUR = 'pink'


module.exports = function (data) {
  return cytoscape({

    container: document.getElementById('cy'),

    elements: data,

    layout: {
      name: 'preset'
    },

    // so we can see the ids
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(text)',
          'text-events': 'yes',
          'text-wrap': 'wrap',
          'text-max-width': '150px',
          "text-background-opacity": 0.7,
          "color": "#222",
          "text-background-shape": "roundrectangle",
          "text-background-padding": "8px"
        }
      },
      {
        selector: 'node[author = "connor"]',
        style: {
          'background-color': CONNOR_COLOUR,
          "text-background-color": CONNOR_COLOUR
        }
      },
      {
        selector: 'node[author = "robert"]',
        style: {
          'background-color': ROBERT_COLOUR,
          "text-background-color": ROBERT_COLOUR
        }
      },
      {
        selector: 'node:selected',
        style: {
          'background-color': SELECTED_COLOUR
        }
      },
      {
        selector: 'edge[authors = "connor-connor"]',
        style: {
          'line-fill': 'linear-gradient',
          'line-gradient-stop-colors': CONNOR_COLOUR + ' ' + CONNOR_COLOUR
        }
      },
      {
        selector: 'edge[authors = "robert-robert"]',
        style: {
          'line-fill': 'linear-gradient',
          'line-gradient-stop-colors': ROBERT_COLOUR + ' ' + ROBERT_COLOUR
        }
      },
      {
        selector: 'edge[authors = "robert-connor"]',
        style: {
          'line-fill': 'linear-gradient',
          'line-gradient-stop-colors': ROBERT_COLOUR + ' ' + CONNOR_COLOUR
        }
      },
      {
        selector: 'edge[authors = "connor-robert"]',
        style: {
          'line-fill': 'linear-gradient',
          'line-gradient-stop-colors': CONNOR_COLOUR + ' ' + ROBERT_COLOUR
        }
      },
      {
        selector: 'edge:selected',
        style: {
          'line-color': SELECTED_COLOUR,
          'line-fill': 'solid'
        }
      },
    ]
  })
}