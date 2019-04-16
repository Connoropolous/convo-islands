

module.exports = function() {
    // you click this button to reload, because you've been 
    // notified by the server that there's remote updates that
    // have been pulled
    document.getElementById('reload-button').onclick = () => {
        /*
        const search = new URLSearchParams(window.location.search)
        search.set('selected', remoteNodeToView)
        window.location.search = search.toString()
        */
       window.location.reload()
    }
}