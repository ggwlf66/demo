var app_profile = {
    posts_container: document.getElementById('posts_container'),
    bodyTemplate: (userdata)=>`<div class="d-block p-3 border-bottom _post dss_post" data-name="profileBody">
                        <div class="d-flex">
                            <img src="${"/media/" + userdata.profile_picture}" style="width: 100px; height: 100px; background-color: #c6c6c6; border-radius: 50%; flex-shrink: 0;">
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
                            <div data-name="bioContainer">${userdata.bio}</div>
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
                                <div class="d-flex flex-column" data-name="posts_container"></div>
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
                                    <button type="button" style="padding: 0px 5px !important" data-name="btnFollow" data-url="/requestfollow/" class="me-2 btn-primary btn btn-sm">follow</button>
                                    <button type="button" style="padding: 0px 5px !important" data-name="btnAddFriend" data-url="/requestfriend/" class="me-2 btn btn-primary btn-sm">add friend</button>
                                    <button type="button" style="padding: 0px 5px !important" data-name="btnRecommend" data-url="" class="btn btn-primary btn-sm">recommend</button>
                                </div>`,

    profileDropDownSelf: ()=>`<ul class="dropdown-menu" data-name="profileDropDownSelf">
                                <li>
                                    <a class="dropdown-item" data-name="btnChangeProfilePic">
                                        <input class="dss_file-input" type="file" data-name="imageInput" accept="image/*">
                                        Change profile picture
                                    </a>
                                </li>
                                
                                <li><a class="dropdown-item" data-name="btnEditBio">Edit bio</a></li>
                                <li><a class="dropdown-item" data-field_name="follow_requests_received" data-name="btnFollowRequests">Follow requests</a></li>
                                <li><a class="dropdown-item" data-field_name="friend_requests_received" data-name="btnFriendRequests">Friend requests</a></li>
                                <li><a class="dropdown-item" data-field_name="" data-name="btnSettings">Settings</a></li>
                                <li><a class="dropdown-item" href="{% url 'logout' %}">Log out</a></li>
                            </ul>`,

    profileDropDown: ()=>`<ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Report</a></li>
                            <li><a class="dropdown-item" href="#">Block</a></li>
                        </ul>`,

    post_template: (user_name, postdata, profile_pic)=>`<div class="d-flex pt-3 pb-3 border-bottom _post dss_post">
                                <div style="width: 50px;">
                                    <img src="${"/media/" + profile_pic}" style="width: 50px; height: 50px; background-color: #c6c6c6; border-radius: 50%;">
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
                                        <span class="me-2"><i class="fa-solid fa-medal"></i></span>
                                    </div>
                                </div>
                            </div>`,
    
    editBioTemplate:(bio)=>`<div data-name="bioEditor">
                                <textarea class="form-control p-0" data-name="bioTextArea">${bio}</textarea>
                                <button class="btn btn-sm btn-primary" style="padding: 0px 5px !important" data-name="btnSaveEditBio">Save</button>
                                <button class="btn btn-sm btn-secondary" style="padding: 0px 5px !important" data-name="btnCancelEditBio">Cancel</button>
                            </div>`,


    async init(thread, isMe=true, userid){
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
        //thread.querySelector("[data-name='mainProfilePic']").src = "/media/" + userdata.userdetails[0].profile_picture
        const uploadImage = async (file) => {
            const formData = new FormData();
            formData.append("image", file);
        
            const response = await fetch("/uploadProfilePic/", {
                method: "POST",
                headers: {"X-CSRFToken": main.getCSRFToken()},
                body: formData
            });
        
            const data = await response.json();
            console.log("Válasz:", data);
        };
        
        let profileBody = thread.querySelector("[data-name='profileBody']")
        let divProfileData = thread.querySelector("[data-name='profileData']")
        let profileDropDown

        if (!isMe){
            divProfileData.innerHTML += app_profile.relationshipButtons()
            let btnFollow = divProfileData.querySelector("[data-name='btnFollow']")
            let btnAddFriend = divProfileData.querySelector("[data-name='btnAddFriend']")
            let btnRecommend = divProfileData.querySelector("[data-name='btnAddFriend']")

            function btnFollowStyling(){
                if (userdata.iRequestedToFollow){
                    btnFollow.innerHTML = "pending"
                    btnFollow.classList.remove("btn-primary", "btn-secondary", "btn-outline-secondary")
                    btnFollow.classList.add("btn-outline-secondary")
                    btnFollow.dataset.url = "/removeFollowRequest/"
                } else if (userdata.iFollow) {
                    btnFollow.innerHTML = "unfollow"
                    btnFollow.classList.remove("btn-primary", "btn-secondary", "btn-outline-secondary")
                    btnFollow.classList.add("btn-secondary")
                    btnFollow.dataset.url = "/unfollow/"
                }
            }
            btnFollowStyling()

            function btnAddFriendStyling(){
                if (userdata.iRequestedFriend){
                    btnAddFriend.innerHTML = "pending"
                    btnAddFriend.classList.remove("btn-primary", "btn-secondary", "btn-outline-secondary")
                    btnAddFriend.classList.add("btn-outline-secondary")
                    btnAddFriend.dataset.url = "/removeFriendRequest/"
                } else if (userdata.isMyFriend) {
                    btnAddFriend.innerHTML = "unfriend"
                    btnAddFriend.classList.remove("btn-primary", "btn-secondary", "btn-outline-secondary")
                    btnAddFriend.classList.add("btn-secondary")
                    btnAddFriend.dataset.url = "/unfriend/"
                }
            }
            btnAddFriendStyling()

            if(userdata.iRecommend){
                btnRecommend.innerHTML = "disrecommend"
                btnRecommend.classList.remove("btn-primary", "btn-secondary", "btn-outline-secondary")
                btnRecommend.classList.add("btn-secondary")
            }

            btnFollow.addEventListener("click", async ()=>{
                await main.exchangeData(btnFollow.dataset.url, {user_id: userid});
                app_profile.init(thread, isMe, userid)
            })
            btnAddFriend.addEventListener("click", async ()=>{
                await main.exchangeData(btnAddFriend.dataset.url, {user_id: userid});
                app_profile.init(thread, isMe, userid)
            })

            divProfileData.querySelector("[data-name='relationshipData']").addEventListener("click", async (event)=>{
                await app_lists.init(thread, event.target.dataset.field_name,userid)
            })
        } else {
            profileDropDown = thread.querySelector("[data-name='profileDropDownSelf']")
            thread.querySelector("[data-name='btnFollowRequests']").addEventListener('click', async (event)=>{await app_lists.init(thread,  event.target.dataset.field_name)})
            thread.querySelector("[data-name='btnFriendRequests']").addEventListener('click', async (event)=>{await app_lists.init(thread,  event.target.dataset.field_name)})
            divProfileData.querySelector("[data-name='relationshipData']").addEventListener("click", async (event)=>{
                await app_lists.init(thread, event.target.dataset.field_name)
            })
            thread.querySelector("[data-name='btnChangeProfilePic']").oninput = async ()=>{
                await uploadImage(thread.querySelector("[data-name='imageInput']").files[0])
            }
            thread.querySelector("[data-name='btnEditBio']").addEventListener("click", ()=>{
                thread.querySelector("[data-name='bioContainer']").innerHTML = app_profile.editBioTemplate(userdata.userdetails[0].bio)
                thread.querySelector("[data-name='btnSaveEditBio']").addEventListener("click", async ()=>{
                    let newBio = thread.querySelector("[data-name='bioTextArea']").value
                    let req = await main.exchangeData("/saveBio/", {bio_text:newBio})

                    if (req.status === "ok"){
                        thread.querySelector("[data-name='bioEditor']").remove()
                        thread.querySelector("[data-name='bioContainer']").textContent = newBio
                    }
                })
                thread.querySelector("[data-name='btnCancelEditBio']").addEventListener("click", ()=>{
                    thread.querySelector("[data-name='bioEditor']").remove()
                    thread.querySelector("[data-name='bioContainer']").textContent = userdata.userdetails[0].bio
                })
    
            })
            
        }
        
        let posts_container = profileBody.querySelector("[data-name='posts_container']")
        if (posts.posts.length > 0){
            /*for (let post of posts.posts){
                posts_container.innerHTML += app_profile.post_template(userdata.userdetails[0].user_name, post, userdata.userdetails[0].profile_picture)
            }*/
            await app_poster.loadPosts(thread, posts, profileBody.querySelector("[data-name='posts_container']"))
        } else {
            posts_container.innerHTML += "No posts yet"
        }
    }
}