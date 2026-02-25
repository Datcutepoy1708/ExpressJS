
// FileUploadPreview
const upload = new window.FileUploadWithPreview("upload-image", {
    multiple: true,
    maxFileCount: 10
});

// CLIENT_SEND_MESSAGE
var timeOut;

const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const images = upload.cachedFileArray || [];
        if (content || images.length ) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    })
}
// CLIENT_SEND_MESSAGE


// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myID = document.querySelector("[my-id]").getAttribute("my-id");

    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".inner-list-typing");
    const div = document.createElement("div");

    let htmlFullname = "";
    let htmlContent = "";
    let htmlImages="";

    if (myID == data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        div.classList.add("inner-incoming");
        htmlFullname = `<div class="inner-name">${data.fullName}</div>`
    }
    if (data.content) {
        htmlContent = `
         <div class="inner-content">${data.content}</div>
        `;
    }
    if(data.images.length >0){
        htmlImages += `<div class="inner-images">`;
        for(const image of data.images){
           htmlImages+=`
           <img src=${image}>
           `
        }
        htmlImages+=`</div>`
    }
    div.innerHTML = `
    ${htmlFullname}
    ${htmlContent}
    ${htmlImages}
    `
    body.insertBefore(div, boxTyping);

    // Peview Image
    const boxImages=div.querySelector(".inner-images");
    if(boxImages){
        const gallery=new Viewer(boxImages);
    }
    //Preview Image

    body.scrollTop = body.scrollHeight;
})
// SERVER_RETURN_MESSAGE
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;

}
// Scroll

// Emoji Picker

// Show Typing 
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
}
// Show Typing

// document.querySelector('emoji-picker').addEventListener('emoji-click',event=> console.log(event.detail));
// Show Popup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.addEventListener("click", () => {
        tooltip.classList.toggle("shown");
    });
}
// Show Popup

//Insert Icon
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;
        console.log(icon);
        inputChat.value = inputChat.value + icon;
        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.forcus();
        showTyping();
    })
    inputChat.addEventListener("keyup", () => {
        showTyping();
    })
}
// Insert Icon
// Emoji Picker

// SERVER_RETURN_TYPING
const elementsListTyping = document.querySelector(".chat .inner-list-typing");
if (elementsListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const existTyping = elementsListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);
                boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName} </div>
          <div class="inner-dots">
            <span> </span>
            <span> </span>
            <span> </span>
          </div>
       `;
                elementsListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;

            }
        } else {
            const boxTypingRemove = elementsListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove) {
                elementsListTyping.removeChild(boxTypingRemove);
            }
        }
    })
}



// Preview Image
const chatBody= document.querySelector(".chat .inner-body");
if(chatBody){
    const gallery= new Viewer(chatBody);
}
// Preview Image