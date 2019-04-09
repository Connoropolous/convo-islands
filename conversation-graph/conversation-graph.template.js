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


// SET THE SELECTED from the url
const searchParams = new URLSearchParams(window.location.search)
const selectedId = searchParams.get('selected') || "1"
cy.$(`#${selectedId}`).select()
// http://cytoscape.github.io/cytoscape.js/#core/viewport-manipulation/cy.fit
const viewPadding = 350
cy.fit(cy.$(':selected'), viewPadding)

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
