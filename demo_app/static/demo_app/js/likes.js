var app_likes = {
    bodyTemplate: ()=>`<div class="d-block p-3 border-bottom _post dss_post">
                            <div class="d-flex flex-column" data-name="result_container"></div>
                        </div>`,
    async init(thread){
        main.clearThread(thread)
        thread.innerHTML += app_likes.bodyTemplate()
        let posts = await main.exchangeData("/getLikedPosts/")
        await app_poster.loadPosts(thread, posts, thread.querySelector("[data-name='result_container']"))
    }
}