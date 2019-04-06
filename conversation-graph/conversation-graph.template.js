const CONNOR_COLOUR = '#009D97'
const ROBERT_COLOUR = '#E8A100'
const SELECTED_COLOUR = 'pink'

const cy = cytoscape({

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
        'label': 'data(text)',
        'text-wrap': 'wrap',
        'text-max-width': '150px'
      }
    },
    {
      selector: 'node[author = "connor"]',
      style: {
        'background-color': CONNOR_COLOUR
      }
    },
    {
      selector: 'node[author = "robert"]',
      style: {
        'background-color': ROBERT_COLOUR
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

const searchParams = new URLSearchParams(window.location.search)
const selectedId = searchParams.get('selected') || "1"
cy.$(`#${selectedId}`).select()
// http://cytoscape.github.io/cytoscape.js/#core/viewport-manipulation/cy.fit
const viewPadding = 350
cy.fit( cy.$(':selected'), viewPadding)

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






