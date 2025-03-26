var app_poster = {
    bodyTemplate: ()=>`<div class="d-block px-3 border-bottom _post dss_post">
                        <div class="d-flex flex-column" data-name="result_container"></div>
                    </div>`,

    post_template: (user_name, user_id, postdata)=>`<div class="d-flex pt-3 pb-3 border-bottom _post dss_post" data-user_id="${user_id}">
                    <div style="width: 50px;">
                        <div style="width: 50px; height: 50px; background-color: #c6c6c6; border-radius: 50%;"></div>
                    </div>
                    <div class="ps-2 w-100">
                        <div class="d-flex">
                            <span class="fw-bold text-sm">${user_name}</span>
                            <span class="ms-auto">
                                <span class="pe-1 fw-light">${postdata.created_at.replace("T", " ").replace("Z", "").slice(0,16)}</span>
                                <i class="fa-solid fa-ellipsis">
                            </i></span>
                        </div>
                        <div class="text-wrap text-break">${postdata.post_text_content}</div>
                        <div class="mt-3">
                            <span class="me-2"><i class="fa-regular fa-heart"></i> ${postdata.liked_by.length}</span>
                            <span class="me-2"><i class="fa-regular fa-comment"></i> ${postdata.comments.length}</span>
                            <span class="me-2"><i class="fa-solid fa-retweet"></i> ${postdata.shared_by.length}</span>
                            <span class="me-2"><i class="fa-solid fa-share"></i></span>
                        </div>
                    </div>
                </div>`,


    async init(thread){
        let posts = await main.exchangeData('/getMainThread/')
        main.clearThread(thread)
        thread.innerHTML += app_poster.bodyTemplate()
        let result_container = thread.querySelector('[data-name="result_container"]')
        for (let post of posts.posts){
            //console.log(posts.userdetails.find(user => user.user_id === post.user_id))
            let creator = posts.userdetails.find(user => user.user_id === post.user_id)
            result_container.innerHTML += app_poster.post_template(creator.user_name, creator.user_id, post)
        }
        result_container.addEventListener("click", async (event)=>{
            await app_profile.init(document.getElementById('main_thread_content'), false, event.target.closest('div[data-user_id]').dataset.user_id)
            console.log()
        })
    }
}