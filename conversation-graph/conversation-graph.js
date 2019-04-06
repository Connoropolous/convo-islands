const cy = cytoscape({

  container: document.getElementById('cy'),

  elements: [{"data":{"text":"may all our conversations begin here and be very fruitful","id":"1"},"position":{"x":0,"y":0}},{"data":{"text":"how to use this","id":"_1dibr5xjl"},"position":{"x":250,"y":-200}},{"data":{"text":"select a node","id":"_85xo626um"},"position":{"x":500,"y":-600}},{"data":{"text":"then type in the input area","id":"_k1212bftn"},"position":{"x":750,"y":-600}},{"data":{"text":"then hit submit","id":"_tw8dghnim"},"position":{"x":1000,"y":-600}},{"data":{"text":"once you have added the data you want to share","id":"_3id3gb428"},"position":{"x":500,"y":-200}},{"data":{"text":"do a git commit of this repo","id":"_856xkqlmp"},"position":{"x":750,"y":-200}},{"data":{"text":"then push it back to github","id":"_25r52hdu4"},"position":{"x":1000,"y":-200}},{"data":{"text":"by doing this, we get a distributed conversation platform out-of-the-box","id":"_g3pxpx9hz"},"position":{"x":1250,"y":-200}},{"data":{"text":"weird questions","id":"_6nqg1dw91"},"position":{"x":-750,"y":500}},{"data":{"text":"does it keep\nline breaks","id":"_oo0hf4kma"},"position":{"x":-500,"y":500}},{"data":{"text":"no","id":"_n7uzuerlp"},"position":{"x":-250,"y":700}},{"data":{"text":"first, run `node editor-server.js`","id":"_cstd467mq"},"position":{"x":500,"y":-400}},{"data":{"text":"then, open http://localhost:3000","id":"_qt5ftx9bc"},"position":{"x":750,"y":-400}},{"data":{"text":"do what editing and replying you want","id":"_1w372i49p"},"position":{"x":1000,"y":-400}},{"data":{"text":"when you're done, stop the server with ctrl-c","id":"_44eew70hi"},"position":{"x":1250,"y":-400}},{"data":{"text":"feature ideas","id":"_z0k58fv18"},"position":{"x":250,"y":200}},{"data":{"text":"a delete button to delete a selected node","id":"_u68grbeyz"},"position":{"x":500,"y":200}},{"data":{"text":"does it\nkeep\nline breaks\nnow?","id":"_xsrc06qip"},"position":{"x":-250,"y":500}},{"data":{"text":"yes","id":"_sbrahpa8s"},"position":{"x":0,"y":500}},{"data":{"id":"edge0","source":"1","target":"_1dibr5xjl"}},{"data":{"id":"edge1","source":"_1dibr5xjl","target":"_85xo626um"}},{"data":{"id":"edge2","source":"_85xo626um","target":"_k1212bftn"}},{"data":{"id":"edge3","source":"_k1212bftn","target":"_tw8dghnim"}},{"data":{"id":"edge4","source":"_1dibr5xjl","target":"_3id3gb428"}},{"data":{"id":"edge5","source":"_3id3gb428","target":"_856xkqlmp"}},{"data":{"id":"edge6","source":"_856xkqlmp","target":"_25r52hdu4"}},{"data":{"id":"edge7","source":"_25r52hdu4","target":"_g3pxpx9hz"}},{"data":{"id":"edge8","source":"_6nqg1dw91","target":"_oo0hf4kma"}},{"data":{"id":"edge9","source":"_oo0hf4kma","target":"_n7uzuerlp"}},{"data":{"id":"edge10","source":"_1dibr5xjl","target":"_cstd467mq"}},{"data":{"id":"edge11","source":"_cstd467mq","target":"_qt5ftx9bc"}},{"data":{"id":"edge12","source":"_qt5ftx9bc","target":"_1w372i49p"}},{"data":{"id":"edge13","source":"_1w372i49p","target":"_44eew70hi"}},{"data":{"id":"edge14","source":"1","target":"_z0k58fv18"}},{"data":{"id":"edge15","source":"_z0k58fv18","target":"_u68grbeyz"}},{"data":{"id":"edge16","source":"_oo0hf4kma","target":"_xsrc06qip"}},{"data":{"id":"edge17","source":"_xsrc06qip","target":"_sbrahpa8s"}}],

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