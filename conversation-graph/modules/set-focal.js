const FOCAL_ID_PARAMS_KEY = 'focal'
module.exports.FOCAL_ID_PARAMS_KEY = FOCAL_ID_PARAMS_KEY

const FOCAL_INPUT_ID = 'focal-input' // in the DOM
const FOCAL_SUBMIT_ID = 'focal-submit'

const setFocal = (id) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set(FOCAL_ID_PARAMS_KEY, id)
    window.location.search = searchParams.toString()
}

const getDataAndSubmit = () => {
    // use the text value of the input as the ID for the focal node
    const focalInput = document.getElementById(FOCAL_INPUT_ID)
    // don't proceed with an empty text value
    if (!focalInput.value) return

    setFocal(focalInput.value)
}

const init = () => {
    // SET FOCAL NODE
    const focalInput = document.getElementById(FOCAL_INPUT_ID)

    // setup keyboard listener for the input
    focalInput.onkeydown = event => {
        // cmd-enter or ctrl-enter both trigger node creation
        if ((event.metaKey || event.ctrlKey) && event.keyCode === ENTER_KEY_CODE) {
            getDataAndSubmit()
        }
    }

    // clicking the 'submit' button triggers node creation
    const focalSubmit = document.getElementById(FOCAL_SUBMIT_ID)
    focalSubmit.onclick = event => {
        event.preventDefault()
        getDataAndSubmit()
    }
}
module.exports.init = init