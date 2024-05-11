//login



const login = document.querySelector(".login")
const loginForm = document.querySelector(".login__form")
const loginInput = document.querySelector(".login__input")

//chat

const chat = document.querySelector(".chat")
const chatForm = document.querySelector(".chat__form")
const chatInput = document.querySelector(".chat__input")
const chatMessages = document.querySelector(".chat__messages")

//cores que serão usadas no nome do usuario
const colors = [
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'magenta',
    'orange',
    'purple',
    'pink',
    'teal',
    'lime',
    'brown',
    'navy',
    'maroon',
    'olive'
  ];
  
const user = {id:"" , name:"", color:""}

let websocket

const createMessageSelf = (content) => {
    const div = document.createElement("div")
    div.classList.add("message__self")
    div.innerHTML = content

    return div
}

const createMessageOther = (content, sender, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    
    div.classList.add("message__other");
    span.classList.add("message__sender");

    span.style.color = senderColor;

    span.textContent = sender;
    div.appendChild(span);

    const textNode = document.createTextNode(content);
    div.appendChild(textNode);

    return div;
}


const randomColor = () => {
const randomIndex = Math.floor(Math.random() * colors.length)
return colors[randomIndex]
}
const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}
const processMessage = ({data}) => {
   const {userId, userName, userColor, content} = JSON.parse(data)

   const message = userId == user.id ? createMessageSelf(content) : createMessageOther(content, userName, userColor)

   const element = createMessageOther(content, userName, userColor)

   chatMessages.appendChild(message)


   scrollScreen()
}


//função para não recarregar a página
const handleLogin = (event) =>{
    event.preventDefault()
    user.name = loginInput.value
    user.id = crypto.randomUUID()
    user.color = randomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    //conecta o usuario ao servidor
    websocket = new WebSocket("ws://localhost:8080")

    websocket.onmessage = processMessage
    
   
}

const sendMessage = (event) =>{
    event.preventDefault()
    
    const message = {
        userId:user.id,
        userName:user.name,
        userColor:user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}
//evento de enviar seguido de uma função que anula o comportamento de recarregar a página
loginForm.addEventListener("submit", handleLogin)

chatForm.addEventListener("submit", sendMessage)