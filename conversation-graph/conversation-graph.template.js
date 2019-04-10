const CONNOR_COLOUR = '#74e2dd'
const ROBERT_COLOUR = '#E8A100'
const SELECTED_COLOUR = 'pink'

const cy = cytoscape({

  container: document.getElementById('cy'),

  elements: {{ data }},

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


let selectedId
const setSelected = (id) => {
  cy.$('node').unselect()
  cy.$(`#${id}`).select()
  const viewPadding = 350
  // http://cytoscape.github.io/cytoscape.js/#core/viewport-manipulation/cy.fit
  cy.fit(cy.$(':selected'), viewPadding)
  selectedId = id
}

// SET THE SELECTED from the url
const searchParams = new URLSearchParams(window.location.search)
const DEFAULT_SELECTED_NODE_ID = "1"
setSelected(searchParams.get('selected') || DEFAULT_SELECTED_NODE_ID)

// KEYBOARD LISTENERS FOR NAVIGATION
const LEFT_ARROW = 37
const UP_ARROW = 38
const RIGHT_ARROW = 39
const DOWN_ARROW = 40
const F_KEY = 70
const ESC_KEY = 27

document.onkeyup = event => {
  if (event.keyCode === ESC_KEY) document.getElementById('reply-input').blur()
  // only listen to keyboard,
  // if focus is not on the input box
  if (event.target.id !== 'reply-input') {
    let selectedNode,
      parentNodeId,
      childIds,
      childrenList,
      sortedChildrenList,
      siblingIds,
      siblingList,
      sortedSiblingList,
      nextNodeUp,
      nextNodeOver,
      nextNodeDown

    switch (event.keyCode) {
      case F_KEY:
        document.getElementById('reply-input').focus()
        break
      case LEFT_ARROW:
        setSelected(cy.elements(`edge[target="${selectedId}"]`)[0].data('source'))
        break;
      case UP_ARROW:
        selectedNode = cy.$(`#${selectedId}`)
        parentNodeId = cy.elements(`edge[target="${selectedId}"]`)[0].data('source')
        siblingIds = cy.elements(`edge[source="${parentNodeId}"]`).map(e => `#${e.data('target')}`).join(', ')
        siblingList = cy.elements(siblingIds)
        // sort them highest y to lowest y
        sortedSiblingList = siblingList.sort((a, b) => b.position().y - a.position().y)
        nextNodeUp = sortedSiblingList.toArray().find(n => n.position().y < selectedNode.position().y)
        setSelected(nextNodeUp.data('id'))
        break
      case RIGHT_ARROW:
        selectedNode = cy.$(`#${selectedId}`)
        childIds = cy.elements(`edge[source="${selectedId}"]`).map(e => `#${e.data('target')}`).join(', ')
        childrenList = cy.elements(childIds)
        // sort them lowest y to highest y
        sortedChildrenList = childrenList.sort((a, b) => a.position().y - b.position().y)
        nextNodeOver = sortedChildrenList.toArray().find(n => n.position().y >= selectedNode.position().y)
        if (!nextNodeOver) {
          sortedChildrenList = childrenList.sort((a, b) => b.position().y - a.position().y)
          nextNodeOver = sortedChildrenList.toArray().find(n => n.position().y <= selectedNode.position().y)
        }
        setSelected(nextNodeOver.data('id'))
        break
      case DOWN_ARROW:
        selectedNode = cy.$(`#${selectedId}`)
        parentNodeId = cy.elements(`edge[target="${selectedId}"]`)[0].data('source')
        siblingIds = cy.elements(`edge[source="${parentNodeId}"]`).map(e => `#${e.data('target')}`).join(', ')
        siblingList = cy.elements(siblingIds)
        // sort them lowest y to highest y
        sortedSiblingList = siblingList.sort((a, b) => a.position().y - b.position().y)
        nextNodeDown = sortedSiblingList.toArray().find(n => n.position().y > selectedNode.position().y)
        setSelected(nextNodeDown.data('id'))
        break
    }
  }
}


// AUTHORS
const authors = ["connor", "robert"]
let active_author = searchParams.get('author') || "connor"
const authorDiv = document.getElementById('authors')
authors.forEach(author => {
  const buttonEl = document.createElement("button")
  buttonEl.textContent = author
  if (author === active_author) {
    buttonEl.className = "activeAuthor"
  }
  authorDiv.appendChild(buttonEl)
  buttonEl.onclick = () => {
    window.location.search = "author=" + author
  }
})


// REPLIES
const replyInput = document.getElementById('reply-input')
const submitNode = () => {
  if (!replyInput.value) return
  const selected = cy.$(':selected')
  const reply_to = selected.length ? selected[0].data('id') : ''
  fetch('add-node', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      node: {
        text: replyInput.value,
        author: active_author
      },
      reply_to
    })
  }).then(async response => {
    const selectedId = await response.text()
    const search = new URLSearchParams(window.location.search)
    search.set('selected', selectedId)
    window.location.search = search.toString()
  })
}
replyInput.focus()
const enterKeyCode = 13
replyInput.onkeydown = event => {
  if (event.metaKey && event.keyCode === enterKeyCode) {
    submitNode()
  }
}

const replySubmit = document.getElementById('reply-submit')
replySubmit.onclick = event => {
  event.preventDefault()
  submitNode()
}


// WEBSOCKETS connection, to listen for updates

const socket = new WebSocket("ws://localhost:3000/")
// the only message type coming from the server means
// that there's a remote update
socket.onmessage = (msg) => document.getElementById('updates').className = 'show'

// you click this button to reload, because you've been 
// notified by the server that there's remote updates that
// have been pulled
document.getElementById('reload-button').onclick = () => {
  window.location.reload()
}
