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

const deleteButton = document.getElementById('delete')
deleteButton.onclick = event => {
  event.preventDefault()
  
  const selected = cy.$(':selected')

  if (!selected.length) return

  fetch('remove-node', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: selected[0].data('id')
    })
  }).then(() => window.location.reload())
}