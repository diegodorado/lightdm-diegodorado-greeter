let sessionIdx = 0
let userIdx = 0

//dom elements
const msg = document.getElementById('msg')
const pwd = document.getElementById('pwd')
const session = document.getElementById('session')
const user = document.getElementById('user')
const suspend = document.getElementById('suspend')
const restart = document.getElementById('restart')
const shutdown = document.getElementById('shutdown')

// called when the greeter asks to show a login prompt for a user
show_prompt = (text) => lightdm.provide_secret(pwd.value)
// called when the greeter asks to show a message
show_message = (text) => msg.innerHTML = text
// called when the greeter asks to show an error
show_error = (text) => show_message(text)

// called when the greeter is finished the authentication request
function authentication_complete() {
  if (lightdm.is_authenticated) {
    lightdm.login(lightdm.authentication_user, lightdm.sessions[sessionIdx].key)
  } else {
    show_error("Authentication Failed")
    pwd.value = ""
  }
}


// called when the greeter wants us to perform a timed login
timed_login = (user) =>  lightdm.login(lightdm.timed_login_user)

updateSession = () => session.innerHTML = lightdm.sessions[sessionIdx].name
updateUser = () => {
  original_title = lightdm.users[userIdx].name
  current_title = original_title
  user.innerHTML = current_title

  lightdm.sessions.forEach((s, i) => {
    if (s.key === lightdm.users[userIdx].session)
      sessionIdx = i
  })
  updateSession()
}


initialize = () => {
  suspend.addEventListener('click', () => lightdm.suspend())
  restart.addEventListener('click', () => lightdm.restart())
  shutdown.addEventListener('click', () => lightdm.shutdown())

  document.addEventListener('keypress', (e) => {
    if (e.code === "Enter" && document.activeElement===pwd) {
      show_message("Logging in...")
      lightdm.cancel_timed_login();
      lightdm.start_authentication(lightdm.users[userIdx].name)
    }
  })

  //cycle through users and sessions
  document.addEventListener('keydown', (e) => {

    if (e.code === "ArrowUp") {
      userIdx--
      userIdx += lightdm.users.length
      userIdx %= lightdm.users.length
      updateUser()
    } else if (e.code === "ArrowDown") {
      userIdx++
      userIdx %= lightdm.users.length
      updateUser()
    } else if (e.code === "ArrowLeft") {
      sessionIdx++
      sessionIdx %= lightdm.sessions.length
      updateSession()
    } else if (e.code === "ArrowRight") {
      sessionIdx--
      sessionIdx += lightdm.sessions.length
      sessionIdx %= lightdm.sessions.length
      updateSession()
    }

  })

  updateUser()

  //disable right click
  document.oncontextmenu = () => false

  //focus on pwd input
  pwd.focus()

}

window.onload = initialize


const swaps = [
  ['i', '1'],
  ['e', '3'],
  ['o', '0'],
  ['g', '6'],
  ['a', '4']
]
let original_title = ''
let current_title = original_title
setInterval(() => {
  let i = Math.floor(Math.random() * swaps.length)
  const diff_count = current_title.split('')
    .reduce((acc, cur, idx) => acc + (original_title.charAt(idx) === cur ? 0 : 1), 0)
  const from = diff_count > 3 ? 1 : Math.round(Math.random())
  const to = from ? 0 : 1
  if (Math.random() < 0.5) {
    current_title = current_title.replace(swaps[i][from], swaps[i][to])
    user.innerHTML = current_title
  }
}, 100)
