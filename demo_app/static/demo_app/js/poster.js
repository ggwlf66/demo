var app_poster = {
    bodyTemplate: ()=>`<div class="d-block px-3 border-bottom _post dss_post">
                        <div class="d-flex flex-column" data-name="result_container"></div>
                    </div>`,

    post_template: (user_name, user_id, profile_picture, postdata)=>`<div class="d-flex pt-3 pb-3 border-bottom _post dss_post" data-post_id="${postdata.id}" data-user_id="${user_id}">
                    <div style="width: 50px;">
                        <img src="${"/media/" + profile_picture}" style="width: 50px; height: 50px; background-color: #c6c6c6; border-radius: 50%;">
                    </div>
                    <div class="ps-2 w-100">
                        <div class="d-flex">
                            <span class="fw-bold text-sm dss_cursor_pointer" data-user_name_link="${user_name}">${user_name}</span>
                            <span class="ms-auto">
                                <span class="pe-1 fw-light">${postdata.created_at.replace("T", " ").replace("Z", "").slice(0,16)}</span>
                                <i class="fa-solid fa-ellipsis">
                            </i></span>
                        </div>
                        <div class="text-wrap text-break">${postdata.post_text_content}</div>
                        <div class="mt-3" data-name="reactButtons">
                            <span class="me-2"><i data-name="btnLike" class="fa-regular fa-heart dss_cursor_pointer"></i><span data-name="likeCounter">${postdata.liked_by.length}</span></span>
                            <span class="me-2"><i class="fa-regular fa-comment"></i>${postdata.comments.length}</span>
                            <span class="me-2"><i class="fa-solid fa-retweet"></i>${postdata.shared_by.length}</span>
                            <span class="me-2"><i class="fa-solid fa-medal"></i></span>
                        </div>
                    </div>
                </div>`,

    async loadPosts(thread, posts, result_container){
        //let result_container = thread.querySelector('[data-name="result_container"]')
        for (let post of posts.posts){
            //console.log(posts.userdetails.find(user => user.user_id === post.user_id))
            let creator = posts.userdetails.find(user => user.user_id === post.user_id)
            let postObj = document.createElement("div")
            postObj.innerHTML += app_poster.post_template(creator.user_name, creator.user_id, creator.profile_picture, post)
            if (post.liked_by.includes(parseInt(myId))){
                postObj.querySelector('[data-name="btnLike"]').classList.remove("fa-regular")
                postObj.querySelector('[data-name="btnLike"]').classList.add("fa-solid", "text-danger")
            }
            result_container.appendChild(postObj)
        }
        result_container.addEventListener("click", async (event)=>{
            if (event.target.dataset.user_name_link){
                await app_profile.init(thread, false, event.target.closest('div[data-user_id]').dataset.user_id)
            } else if (event.target.dataset.name === "btnLike"){
                let likereq = await main.exchangeData("/likePost/", {post_id: event.target.closest('div[data-post_id]').dataset.post_id})
                let likeCounter = event.target.parentElement.querySelector('[data-name="likeCounter"]')
                event.target.classList.remove("fa-solid", "fa-regular", "text-danger")
                if (likereq.status === "liked"){
                    likeCounter.textContent = parseInt(likeCounter.textContent) + 1
                    event.target.classList.add("fa-solid", "text-danger")
                } else if (likereq.status === "likeremoved"){
                    event.target.classList.add("fa-regular")
                    likeCounter.textContent = parseInt(likeCounter.textContent) - 1
                }
            }
        })
    },

    async init(thread, url='/getMainThread/'){
        let posts = await main.exchangeData(url)
        main.clearThread(thread)
        thread.innerHTML += app_poster.bodyTemplate()
        await app_poster.loadPosts(thread, posts, thread.querySelector('[data-name="result_container"]'))
    }
}