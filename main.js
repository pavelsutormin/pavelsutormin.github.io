import {get_navbar} from "/utils.js"
import '/style.css'

document.querySelector('#app').innerHTML = `
${get_navbar("home")}
<div>
    <h1>This is my website</h1>
</div>
`
