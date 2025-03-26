var app_profile = {
    posts_container: document.getElementById('posts_container'),
    bodyTemplate: (userdata)=>`<div class="d-block p-3 border-bottom _post dss_post" data-name="profileBody">
                        <div class="d-flex">
                            <div style="width: 100px; height: 100px; background-color: #c6c6c6; border-radius: 50%; flex-shrink: 0;"></div>
                            <div class="d-block ps-4 pt-2 w-100" data-name="profileData">
                                <div class="d-flex">
                                    <span class="fw-bold">${userdata.user_name}</span>
                                    <div class="ms-auto dropdown" data-name="profileDropDown">
                                        <span class="" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-bars"></i></span>    
                                        
                                    </div>
                                </div>
                                <div data-name="relationshipData">
                                    <div class="d-flex mt-2">
                                        <div class="me-3" data-field_name="following">following: ${userdata.following.length}</div>
                                        <div data-field_name="followed_by">followers: ${userdata.followed_by.length}</div>
                                    </div>
                                    <div class="d-flex">
                                        <div class="me-3" data-field_name="friends">friends: ${userdata.friends.length}</div>
                                        <div data-field_name="recommended_by">recommended by: ${userdata.recommended_by.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ps-2 w-100 mt-2">
                            <div>${userdata.bio}</div>
                        </div>
                        <ul class="nav nav-tabs mt-4" id="myTab" role="tablist"">
                            <li class="nav-item-sm" role="presentation">
                                <button class="nav-link py-0 px-2 active" id="home-tab" data-bs-toggle="tab" data-bs-target=".tabpanel-posts" type="button" role="tab">
                                    Posts
                                </button>
                            </li>
                            <li class="nav-item-sm" role="presentation">
                                <button class="nav-link py-0 px-2" id="profile-tab" data-bs-toggle="tab" data-bs-target=".tabpanel-comments" type="button" role="tab">
                                    Comments
                                </button>
                            </li>
                            <li class="nav-item-sm" role="presentation">
                                <button class="nav-link py-0 px-2" id="contact-tab" data-bs-toggle="tab" data-bs-target=".tabpanel-gallery" type="button" role="tab">
                                    Gallery
                                </button>
                            </li>
                        </ul>

                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade show active tabpanel-posts" role="tabpanel">
                                <div class="d-flex flex-column align-items-center" data-name="posts_container"></div>
                            </div>
                            <div class="tab-pane fade show tabpanel-comments" role="tabpanel">
                                <div class="d-flex flex-column align-items-center">            
                                    No comments yet
                                </div>
                            </div>
                            <div class="tab-pane fade show tabpanel-gallery" role="tabpanel">
                                <div class="d-flex flex-column align-items-center">            
                                    No pics yet
                                </div>
                            </div>
                        </div>
                    </div>`,

    relationshipButtons: ()=>`<div class="d-flex mt-2" data-name="relationshipButtons">
                                    <button type="button" style="padding: 0px 5px !important" data-name="btnFollow" class="me-2 btn-primary btn btn-sm">follow</button>
                                    <button type="button" style="padding: 0px 5px !important" data-name="btnAddFriend" class="me-2 btn btn-primary btn-sm">add friend</button>
                                    <button type="button" style="padding: 0px 5px !important" data-name="btnRecommend" class="btn btn-primary btn-sm">recommend</button>
                                </div>`,

    profileDropDownSelf: ()=>`<ul class="dropdown-menu" data-name="profileDropDownSelf">
                                <li><a class="dropdown-item" data-name="btnEditProfile">Edit profile</a></li>
                                <li><a class="dropdown-item" data-field_name="follow_requests_received" data-name="btnFollowRequests">Follow requests</a></li>
                                <li><a class="dropdown-item" data-field_name="friend_requests_received" data-name="btnFriendRequests">Friend requests</a></li>
                                <li><a class="dropdown-item" data-field_name="" data-name="btnSettings">Settings</a></li>
                                <li><a class="dropdown-item" href="{% url 'logout' %}">Log out</a></li>
                            </ul>`,

    profileDropDown: ()=>`<ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Report</a></li>
                            <li><a class="dropdown-item" href="#">Block</a></li>
                        </ul>`,

    post_template: (user_name, postdata)=>`<div class="d-flex pt-3 pb-3 border-bottom _post dss_post">
                                <div style="width: 50px;">
                                    <div style="width: 50px; height: 50px; background-color: #c6c6c6; border-radius: 50%;"></div>
                                </div>
                                <div class="ps-2 w-100">
                                    <div class="d-flex">
                                        <span class="fw-bold text-sm">${user_name}</span>
                                        <span class="ms-auto">
                                            <span class="pe-1 fw-light">${postdata.created_at.replace("T", " ").replace("Z", "").slice(0,16)}</span>
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </span>
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


    async init(thread, isMe, userid){
        let userdata, posts
        main.clearThread(thread)
        if (isMe){
            userdata = await main.exchangeData("/getSelfDetails/")
            posts = await main.exchangeData("/getOneUsersPosts/")
        } else {
            userdata = await main.exchangeData("/getUserDetails/", {user_id: userid})
            posts = await main.exchangeData("/getOneUsersPosts/", {user_id: userid})
        }

        thread.innerHTML += app_profile.bodyTemplate(userdata.userdetails[0])
        thread.querySelector("[data-name='profileDropDown']").innerHTML += isMe? app_profile.profileDropDownSelf(): app_profile.profileDropDown()

            
        
        let profileBody = thread.querySelector("[data-name='profileBody']")
        let divProfileData = thread.querySelector("[data-name='profileData']")
        let profileDropDown
        

        if (!isMe){
            divProfileData.innerHTML += app_profile.relationshipButtons()
            divProfileData.querySelector("[data-name='btnFollow']").addEventListener("click", async ()=>{
                await main.exchangeData("/requestfollow/", {user_id: userid});
            })
            divProfileData.querySelector("[data-name='btnAddFriend']").addEventListener("click", async ()=>{
                await main.exchangeData("/requestfriend/", {user_id: userid});
            })

            divProfileData.querySelector("[data-name='relationshipData']").addEventListener("click", async (event)=>{
                await app_lists.init(document.getElementById('main_thread_content'),event.target.dataset.field_name,userid)
            })
        } else {
            profileDropDown = thread.querySelector("[data-name='profileDropDownSelf']")
            profileDropDown.addEventListener('click', async (event)=>{await app_lists.init(document.getElementById('main_thread_content'), event.target.dataset.field_name)})
            divProfileData.querySelector("[data-name='relationshipData']").addEventListener("click", async (event)=>{
                await app_lists.init(document.getElementById('main_thread_content'),event.target.dataset.field_name)
            })
        }
        
        
        let posts_container = profileBody.querySelector("[data-name='posts_container']")
        if (posts.posts.length > 0){
            for (let post of posts.posts){
                posts_container.innerHTML += app_profile.post_template(userdata.userdetails[0].user_name, post)
            }
        } else {
            posts_container.innerHTML += "No posts yet"
        }
    }
}