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
        'label': 'data(text)'
      }
    }
  ]
})

const replyInput = document.getElementById('reply-input')
const replySubmit = document.getElementById('reply-submit')
replySubmit.onclick = event => {
  event.preventDefault()
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
        text: replyInput.value
      },
      reply_to
    })
  }).then(() => window.location.reload())
}