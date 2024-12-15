let contentList

// when page loads
document.addEventListener("DOMContentLoaded", () => {
    contentList = document.getElementsByClassName("section")

    hideAllExept(0)
})

function hideAllExept(element){
    let length = contentList.length

    for (let index = 0; index < length; index++) {
        contentList[index].classList.add("hide")
        contentList[index].classList.remove("show")
        
        if (element == index) {
            contentList[index].classList.add("show")
            contentList[index].classList.remove("hide")
        }
    }

    // console.log(contentList[element].classList.add("hide"))
}