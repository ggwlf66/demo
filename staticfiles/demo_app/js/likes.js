var app_likes = {
    bodyTemplate: ()=>`<div class="d-flex flex-column align-items-center">cuming soooon ahh</div>`,
    async init(thread){
        main.clearThread(thread)
        thread.innerHTML += app_likes.bodyTemplate()
    }
}