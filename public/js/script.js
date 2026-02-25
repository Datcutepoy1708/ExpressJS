const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time)
    console.log(showAlert);
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
// End Show alert

// Button go back
const buttonGoBack=document.querySelectorAll("[button-go-back]")
if(buttonGoBack.length > 0){
   buttonGoBack.forEach(button=> {
     button.addEventListener("click",()=> {
        history.back();
     })
   })
}
// End Button go back