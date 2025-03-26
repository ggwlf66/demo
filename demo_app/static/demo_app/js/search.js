var app_search = {
    bodyTemplate: ()=>`<div class="d-block p-3 border-bottom _post dss_post">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Search" aria-describedby="btnSearchOnApp" data_name="searchinput">
                        <button class="input-group-text" data_name="btnSearchOnApp"><span><i class="fa-solid fa-magnifying-glass"></i></span></button>
                    </div>
                    <div class="d-flex flex-column" data_name="search_result_container"></div>
                </div>`,

    user_in_search: (userdata)=>`<div class="d-flex pt-3 pb-3 border-bottom _post dss_post" data-user_id="${userdata.user_id}" data-userdata='${JSON.stringify(userdata)}'>
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

    async init(thread){
        main.clearThread(thread)
        thread.innerHTML += app_search.bodyTemplate()
        search_result_container = thread.querySelector("[data_name='search_result_container']")

        async function doSearch(){
            let result = await main.exchangeData('/search/', {searchedexpression: thread.querySelector("[data_name='searchinput']").value})
            search_result_container.innerHTML = ""
            for (let item of result.userdata){
                let resultItem = document.createElement("div")
                resultItem.innerHTML = app_search.user_in_search(item[0])
                search_result_container.appendChild(resultItem)
                resultItem.addEventListener("click", async ()=>{
                    await app_profile.init(thread, item[0].user_id.toString()===myId, item[0].user_id)
                })
            }
        }

        thread.querySelector("[data_name='btnSearchOnApp']").addEventListener('click', async()=>{await doSearch()})
    }
}