const cy = cytoscape({

  container: document.getElementById('cy'),

  elements: [{"data":{"text":"may all our conversations begin here and be very fruitful","id":"1"},"position":{"x":0,"y":0}},{"data":{"text":"how to use this","id":"_1dibr5xjl"},"position":{"x":250,"y":200}},{"data":{"text":"select a node","id":"_85xo626um"},"position":{"x":500,"y":600}},{"data":{"text":"then type in the input area","id":"_k1212bftn"},"position":{"x":750,"y":600}},{"data":{"text":"then hit submit","id":"_tw8dghnim"},"position":{"x":1000,"y":600}},{"data":{"text":"once you have added the data you want to share","id":"_3id3gb428"},"position":{"x":500,"y":200}},{"data":{"text":"do a git commit of this repo","id":"_856xkqlmp"},"position":{"x":750,"y":200}},{"data":{"text":"then push it back to github","id":"_25r52hdu4"},"position":{"x":1000,"y":200}},{"data":{"text":"by doing this, we get a distributed conversation platform out-of-the-box","id":"_g3pxpx9hz"},"position":{"x":1250,"y":200}},{"data":{"text":"weird questions","id":"_6nqg1dw91"},"position":{"x":-750,"y":900}},{"data":{"text":"does it keep\nline breaks","id":"_oo0hf4kma"},"position":{"x":-500,"y":900}},{"data":{"text":"no","id":"_n7uzuerlp"},"position":{"x":-250,"y":1100}},{"data":{"text":"first, run `node editor-server.js`","id":"_cstd467mq"},"position":{"x":500,"y":400}},{"data":{"text":"then, open http://localhost:3000","id":"_qt5ftx9bc"},"position":{"x":750,"y":400}},{"data":{"text":"do what editing and replying you want","id":"_1w372i49p"},"position":{"x":1000,"y":400}},{"data":{"text":"when you're done, stop the server with ctrl-c","id":"_44eew70hi"},"position":{"x":1250,"y":400}},{"data":{"text":"feature ideas","id":"_z0k58fv18"},"position":{"x":250,"y":-200}},{"data":{"text":"a delete button to delete a selected node","id":"_u68grbeyz"},"position":{"x":500,"y":-1000}},{"data":{"text":"does it\nkeep\nline breaks\nnow?","id":"_xsrc06qip"},"position":{"x":-250,"y":900}},{"data":{"text":"yes","id":"_sbrahpa8s"},"position":{"x":0,"y":900}},{"data":{"text":"this is now added","id":"_qv0q1taxh"},"position":{"x":750,"y":-1400}},{"data":{"text":"pretty print the json to the file so we get nicer git diffs","id":"_wj994fyp6"},"position":{"x":500,"y":-400}},{"data":{"text":"did my tweak to JSON.stringify work?","id":"_tonamgioa"},"position":{"x":750,"y":-600}},{"data":{"text":"yes","id":"_pqvxatotp"},"position":{"x":1000,"y":-600}},{"data":{"text":"test a git diff","id":"_lh1gzred7"},"position":{"x":1250,"y":-600}},{"data":{"text":"we use the tool to build the tool","id":"_bf5h6531x"},"position":{"x":250,"y":-400}},{"data":{"text":"do a git commit after every modifying action?","id":"_j86eaw68y"},"position":{"x":500,"y":-1200}},{"data":{"text":"hi\nthis is my first comment","id":"_tfezvamnc"},"position":{"x":250,"y":400}},{"data":{"text":"this is now added","id":"_jjq3mp9mj"},"position":{"x":1500,"y":-600}},{"data":{"text":"put author of a node next to the node, so we know who said it","id":"_wtic0984u"},"position":{"x":500,"y":-200}},{"data":{"text":"an alternative to this","id":"_7qred7u9w"},"position":{"x":750,"y":-200}},{"data":{"text":"Pegah proposes: different authors could have different colors","id":"_ksq8htjso"},"position":{"x":1000,"y":-200}},{"data":{"text":"the nodes would have a fill colour that signified the author","id":"_iz00w85x9"},"position":{"x":1250,"y":-400}},{"data":{"text":"ability to tag nodes as having a certain 'topic'","id":"_b0c29zzfa"},"position":{"x":500,"y":-800}},{"data":{"text":"each topic would have a colour","id":"_8gmh71q9i"},"position":{"x":750,"y":-1000}},{"data":{"text":"have a node be selected for responding to, after you create it","id":"_wh0g0unl5"},"position":{"x":500,"y":-1400}},{"data":{"text":"you could assign a hex colour to a topic","id":"_s8ii3vwo2"},"position":{"x":1000,"y":-1000}},{"data":{"text":"actually not every node would have a colour, you could add a topic to a node","id":"_kg31prkha"},"position":{"x":1000,"y":-1200}},{"data":{"text":"an alternative to this","id":"_3ynivi711"},"position":{"x":750,"y":-400}},{"data":{"text":"the node icon could be a profile picture of the author","id":"_q1g4upjfa"},"position":{"x":1000,"y":-400}},{"data":{"text":"have a switch mode between the 'participant' view and the 'topic' view","id":"_u7eycyukb"},"position":{"x":500,"y":-600}},{"data":{"text":"a panel on the right hand side of the screen which can be expanded or minimized","id":"_dnoyh5iqd"},"position":{"x":750,"y":-800}},{"data":{"text":"shows possible modes","id":"_p9478ptfw"},"position":{"x":1000,"y":-800}},{"data":{"text":"participant view","id":"_jm7yquhkh"},"position":{"x":1250,"y":-800}},{"data":{"text":"topic view","id":"_f0zz76ghl"},"position":{"x":1250,"y":-1000}},{"data":{"text":"you could multi-select and then tag multiple nodes with a topic","id":"_ijjh13e9a"},"position":{"x":750,"y":-1200}},{"data":{"text":"there could be a panel which displays a selected thread in a linear, start to finish way","id":"_30j91k9oe"},"position":{"x":500,"y":-2000}},{"data":{"text":"nodes could have media attached","id":"_4y27ccx2g"},"position":{"x":500,"y":-1600}},{"data":{"text":"videos","id":"_7l1ijlmdx"},"position":{"x":750,"y":-2000}},{"data":{"text":"pictures","id":"_lzx52sxu8"},"position":{"x":750,"y":-2200}},{"data":{"text":"links","id":"_cuyi403ed"},"position":{"x":750,"y":-2400}},{"data":{"text":"songs","id":"_7stos8ygw"},"position":{"x":750,"y":-2600}},{"data":{"text":"in page search","id":"_pidexjd4s"},"position":{"x":500,"y":-2200}},{"data":{"text":"when the page reloads after node creation, set that node as the focal node","id":"_5qhgayc5q"},"position":{"x":750,"y":-1800}},{"data":{"text":"nodes should have timestamps attached when they're created, and updated","id":"_j9l8zevhb"},"position":{"x":500,"y":-2400}},{"data":{"text":"edges could also have colour","id":"_zcad3xzyn"},"position":{"x":1250,"y":-200}},{"data":{"text":"the colour for an edge could be consistent for the whole edge if the author of the two nodes is the same","id":"_iqyyzry8g"},"position":{"x":1500,"y":-400}},{"data":{"text":"the colour for an edge could be a gradient between the colours of the two authors if the edge is between nodes by two authors!","id":"_0scvcomsp"},"position":{"x":1500,"y":-200}},{"data":{"text":"Connor loves this idea","id":"_arurdkiwc"},"position":{"x":1750,"y":-200}},{"data":{"text":"nodes could be given a size according to how many descendants they have","id":"_segwg6hc7"},"position":{"x":500,"y":-2600}},{"data":{"text":"the ability to set an interval for how often to poll git remotes for new updates","id":"_5hbprlh4b"},"position":{"x":500,"y":-1800}},{"data":{"text":"I am really liking this idea","id":"_4liqrfezp"},"position":{"x":750,"y":-1600}},{"data":{"text":"from the user interface","id":"_fjufb15iz"},"position":{"x":750,"y":-2800}},{"data":{"id":"edge0","source":"1","target":"_1dibr5xjl"}},{"data":{"id":"edge1","source":"_1dibr5xjl","target":"_85xo626um"}},{"data":{"id":"edge2","source":"_85xo626um","target":"_k1212bftn"}},{"data":{"id":"edge3","source":"_k1212bftn","target":"_tw8dghnim"}},{"data":{"id":"edge4","source":"_1dibr5xjl","target":"_3id3gb428"}},{"data":{"id":"edge5","source":"_3id3gb428","target":"_856xkqlmp"}},{"data":{"id":"edge6","source":"_856xkqlmp","target":"_25r52hdu4"}},{"data":{"id":"edge7","source":"_25r52hdu4","target":"_g3pxpx9hz"}},{"data":{"id":"edge8","source":"_6nqg1dw91","target":"_oo0hf4kma"}},{"data":{"id":"edge9","source":"_oo0hf4kma","target":"_n7uzuerlp"}},{"data":{"id":"edge10","source":"_1dibr5xjl","target":"_cstd467mq"}},{"data":{"id":"edge11","source":"_cstd467mq","target":"_qt5ftx9bc"}},{"data":{"id":"edge12","source":"_qt5ftx9bc","target":"_1w372i49p"}},{"data":{"id":"edge13","source":"_1w372i49p","target":"_44eew70hi"}},{"data":{"id":"edge14","source":"1","target":"_z0k58fv18"}},{"data":{"id":"edge15","source":"_z0k58fv18","target":"_u68grbeyz"}},{"data":{"id":"edge16","source":"_oo0hf4kma","target":"_xsrc06qip"}},{"data":{"id":"edge17","source":"_xsrc06qip","target":"_sbrahpa8s"}},{"data":{"id":"edge18","source":"_u68grbeyz","target":"_qv0q1taxh"}},{"data":{"id":"edge19","source":"_z0k58fv18","target":"_wj994fyp6"}},{"data":{"id":"edge20","source":"_wj994fyp6","target":"_tonamgioa"}},{"data":{"id":"edge21","source":"_tonamgioa","target":"_pqvxatotp"}},{"data":{"id":"edge22","source":"_pqvxatotp","target":"_lh1gzred7"}},{"data":{"id":"edge23","source":"1","target":"_bf5h6531x"}},{"data":{"id":"edge24","source":"_z0k58fv18","target":"_j86eaw68y"}},{"data":{"id":"edge25","source":"1","target":"_tfezvamnc"}},{"data":{"id":"edge26","source":"_lh1gzred7","target":"_jjq3mp9mj"}},{"data":{"id":"edge27","source":"_z0k58fv18","target":"_wtic0984u"}},{"data":{"id":"edge28","source":"_wtic0984u","target":"_7qred7u9w"}},{"data":{"id":"edge29","source":"_7qred7u9w","target":"_ksq8htjso"}},{"data":{"id":"edge30","source":"_ksq8htjso","target":"_iz00w85x9"}},{"data":{"id":"edge31","source":"_z0k58fv18","target":"_b0c29zzfa"}},{"data":{"id":"edge32","source":"_b0c29zzfa","target":"_8gmh71q9i"}},{"data":{"id":"edge33","source":"_z0k58fv18","target":"_wh0g0unl5"}},{"data":{"id":"edge34","source":"_8gmh71q9i","target":"_s8ii3vwo2"}},{"data":{"id":"edge35","source":"_8gmh71q9i","target":"_kg31prkha"}},{"data":{"id":"edge36","source":"_wtic0984u","target":"_3ynivi711"}},{"data":{"id":"edge37","source":"_3ynivi711","target":"_q1g4upjfa"}},{"data":{"id":"edge38","source":"_z0k58fv18","target":"_u7eycyukb"}},{"data":{"id":"edge39","source":"_u7eycyukb","target":"_dnoyh5iqd"}},{"data":{"id":"edge40","source":"_dnoyh5iqd","target":"_p9478ptfw"}},{"data":{"id":"edge41","source":"_p9478ptfw","target":"_jm7yquhkh"}},{"data":{"id":"edge42","source":"_p9478ptfw","target":"_f0zz76ghl"}},{"data":{"id":"edge43","source":"_b0c29zzfa","target":"_ijjh13e9a"}},{"data":{"id":"edge44","source":"_z0k58fv18","target":"_30j91k9oe"}},{"data":{"id":"edge45","source":"_z0k58fv18","target":"_4y27ccx2g"}},{"data":{"id":"edge46","source":"_4y27ccx2g","target":"_7l1ijlmdx"}},{"data":{"id":"edge47","source":"_4y27ccx2g","target":"_lzx52sxu8"}},{"data":{"id":"edge48","source":"_4y27ccx2g","target":"_cuyi403ed"}},{"data":{"id":"edge49","source":"_4y27ccx2g","target":"_7stos8ygw"}},{"data":{"id":"edge50","source":"_z0k58fv18","target":"_pidexjd4s"}},{"data":{"id":"edge51","source":"_wh0g0unl5","target":"_5qhgayc5q"}},{"data":{"id":"edge52","source":"_z0k58fv18","target":"_j9l8zevhb"}},{"data":{"id":"edge53","source":"_ksq8htjso","target":"_zcad3xzyn"}},{"data":{"id":"edge54","source":"_zcad3xzyn","target":"_iqyyzry8g"}},{"data":{"id":"edge55","source":"_zcad3xzyn","target":"_0scvcomsp"}},{"data":{"id":"edge56","source":"_0scvcomsp","target":"_arurdkiwc"}},{"data":{"id":"edge57","source":"_z0k58fv18","target":"_segwg6hc7"}},{"data":{"id":"edge58","source":"_z0k58fv18","target":"_5hbprlh4b"}},{"data":{"id":"edge59","source":"_j86eaw68y","target":"_4liqrfezp"}},{"data":{"id":"edge60","source":"_5hbprlh4b","target":"_fjufb15iz"}}],

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