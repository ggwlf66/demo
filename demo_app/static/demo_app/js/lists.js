var app_lists = {
    bodyTemplate: ()=>`<div class="d-block p-3 border-bottom _post dss_post">
                        <div class="d-flex flex-column" data-name="result_container"></div>
                    </div>`,

    itemTemplate: (userdata)=>`<div class="d-flex pt-3 pb-3 border-bottom _post dss_post" data-user_id="${userdata.user_id}" data-userdata='${JSON.stringify(userdata)}'>
                        <div style="width: 50px;">
                            <img src="${"/media/" + userdata.profile_picture}" style="width: 50px; height: 50px; background-color: #c6c6c6; border-radius: 50%;">
                        </div>
                        <div class="ps-2 w-100 d-flex" data-name="contentBody">
                            <div class="">
                                <span class="fw-bold text-sm" data-name="username">${userdata.user_name}</span>
                                <div>following: ${userdata.following.length} followers: ${userdata.followed_by.length}</div>
                            </div>
                        </div>
                    </div>`,
    
    acceptDeclineButtons: ()=>`<div class="ms-auto pt-2">
                                <button type="button" class="btn btn-outline-primary btn-sm" data-name="btnAccept"><i class="fas fa-plus"></i></button>
                                <button type="button" class="btn btn-outline-danger btn-sm" data-name="btnDecline"><i class="fas fa-minus"></i></button>
                            </div>`,

    async init(thread, field, userid){
        main.clearThread(thread)
        thread.innerHTML += app_lists.bodyTemplate()
        let result_container = thread.querySelector("[data-name='result_container']")

        let requests = await main.exchangeData('/getOneField/', {field_name: field, user_id:userid?userid:null})
        let requestUserIDList = requests.fieldata[0][field]
        let requestUserDetailsList = await main.exchangeData('/getOneFieldByList/', {list: requestUserIDList})
        if (requestUserDetailsList.fieldata.length > 0){
            for (let item of requestUserDetailsList.fieldata){
                let resultItem = document.createElement("div")
                resultItem.innerHTML = app_lists.itemTemplate(item)
                if (field === "follow_requests_received" || field === "friend_requests_received"){
                    resultItem.querySelector("[data-name='contentBody']").innerHTML += app_lists.acceptDeclineButtons()
                    resultItem.querySelector("[data-name='btnAccept']").addEventListener('click', 
                        async()=>{
                            await main.exchangeData(field == 'follow_requests_received'?'/acceptFollowRequest/': 'acceptFriendRequest/', {user_id: item.user_id})
                            await app_lists.init(thread, field, userid)
                        })
                    }
                result_container.appendChild(resultItem)
                resultItem.querySelector("[data-name='username']").addEventListener("click", async ()=>{await app_profile.init(thread.closest("[data-name='thread_inner']"), item.user_id === myId, item.user_id)})
            }
        } else {
            result_container.innerHTML += "No requests yet"
        }
        
    }
}