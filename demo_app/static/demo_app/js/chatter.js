var app_chatter = {
    bodyTemplate: ()=>`<div class="d-block px-3 border-bottom _post dss_post">
                        <div class="d-flex flex-column" data-name="result_container"></div>
                        <ul class="nav nav-tabs mt-4" role="tablist" data-name="chatNavs">
                            <li class="nav-item-sm" role="presentation">
                                <button class="nav-link py-0 px-2 active" data-bs-toggle="tab" data-name="friends" data-bs-target=".tabpanel-friends" type="button" role="tab">
                                    Friends
                                </button>
                            </li>
                        </ul>

                        <div class="tab-content" data-name="chatTabs">
                            <div class="tab-pane fade show active tabpanel-friends" role="tabpanel" data-name="friendsListTab">
                                <div class="d-flex flex-column align-items-center" data-name="friendsList">            
                                    You dont have any...
                                </div>
                            </div>
                        </div>
                    </div>`,

    chatTemplate:()=>`<div class="d-block overflow-auto" data-name="messagesContainer" style="height: calc(100vh - 125px);">
                            </div>
                            <div class="d-flex">
                                <input type="text" class="form-control form-control-sm" data-name="messageInput">
                                <button data-name="btnSendMessage" class="btn btn-sm m-0 btn-outline-secondary"><i class="fa-solid fa-paper-plane"></i></button>
                                <button type="button" class="btn btn-outline-secondary btn-sm"><i class="fas fa-image"></i></button>
                                <button type="button" class="btn btn-outline-secondary btn-sm"><i class="fa-solid fa-music"></i></button>
                                <button type="button" class="btn btn-outline-secondary btn-sm"><i class="fas fa-plus"></i></button>
                            </div>`,
    
    chatNavItemTemplate:(chatName, userName)=>`<li class="nav-item-sm" role="presentation">
                                                    <button class="nav-link py-0 px-2" data-bs-toggle="tab" data-name="chats" data-bs-target=".${chatName}" type="button" role="tab" data-chatName="${chatName}">
                                                        ${userName}
                                                        <button type="button" class="btn-close ms-auto" disabled aria-label="Close"></button>
                                                    </button>
                                                </li>`,
    
    messageSentTemplate:(messageContent)=>`<div class="d-flex bg-transparent mt-2" >
                                <div class="ps-5 w-100 d-flex" data-name="contentBody">
                                    <div class="ms-auto me-1 p-2 rounded bg-light text-wrap text-break">
                                        ${messageContent}
                                    </div>
                                </div>
                            </div>`,

    messageRecTemplate:(messageContent, profile_picture)=>`<div class="d-flex bg-transparent mt-2">
                                            <div style="width: 40px;">
                                                <img src="${"/media/" + profile_picture}" style="width: 40px; height: 40px; background-color: #c6c6c6; border-radius: 50%;">
                                            </div>
                                            <div class="pe-5 w-100 d-flex" data-name="contentBody">
                                                <div class="me-auto ms-1 p-2 rounded bg-secondary text-wrap text-break">
                                                    ${messageContent}
                                                </div>
                                            </div>
                                        </div>`,

    async init(thread){
        main.clearThread(thread)
        thread.innerHTML += app_chatter.bodyTemplate()
        let openedChats = {}
        let navFriends = thread.querySelector("[data-name='friends']")

        let navContent = thread.querySelector("[data-name='chatNavs']")
        let chatTabs = thread.querySelector("[data-name='chatTabs']")
        
        navFriends.addEventListener('shown.bs.tab', async (event)=>{
            await app_lists.init(thread.querySelector("[data-name='friendsList']"),"friends")
        })

        await app_lists.init(thread.querySelector("[data-name='friendsList']"),"friends")

        thread.querySelector("[data-name='friendsList']").addEventListener("click", async (event)=>{
            console.log(event.target.hasAttribute("data-name"))
            //await initRoom(event.target.closest('[data-user_id]').dataset.user_id)
            if (!event.target.hasAttribute("data-name")){
                let userdata = JSON.parse(event.target.closest('[data-userdata]').dataset.userdata)
                let roomName = await main.exchangeData('/getChatName/', {user_id:userdata.user_id})
                if (!Object.keys(openedChats).includes(roomName.room_name)){
                    openedChats[roomName.room_name] = new WebSocket(`ws://${window.location.host}/ws/chat/${roomName.room_name}/`);
                    navContent.innerHTML += app_chatter.chatNavItemTemplate(roomName.room_name, userdata.user_name)

                    let tabContent = document.createElement('div')
                    tabContent.className = `tab-pane fade ${roomName.room_name}`
                    tabContent.innerHTML = app_chatter.chatTemplate()

                    openedChats[roomName.room_name].onmessage = (event)=>{
                        let data = JSON.parse(event.data);
                        if (data.username === myName) {
                            tabContent.querySelector("[data-name='messagesContainer']").innerHTML += app_chatter.messageSentTemplate(data.message)
                        } else {
                            tabContent.querySelector("[data-name='messagesContainer']").innerHTML += app_chatter.messageRecTemplate(data.message)
                        }
                        tabContent.querySelector("[data-name='messagesContainer']").scrollTop = tabContent.querySelector("[data-name='messagesContainer']").scrollHeight
                    }
                    //scrollDiv.scrollTop = scrollDiv.scrollHeight;
                    tabContent.querySelector("[data-name='btnSendMessage']").addEventListener("click",
                        async ()=>{
                            let message = tabContent.querySelector("[data-name='messageInput']").value
                            tabContent.querySelector("[data-name='messageInput']").value = ""
                            if(message !== ""){
                                await main.exchangeData("/saveMessage/", {room:roomName.room_name, message:message})
                                openedChats[roomName.room_name].send(JSON.stringify({ message: message, username: myName}));
                            }
                        }
                    )
                    let messages = await main.exchangeData('/getMessages/',{room:roomName.room_name})
                    console.log(messages.messages)

                    for (let msg of messages.messages){
                        if (msg.sender_id.toString() === myId) {
                            tabContent.querySelector("[data-name='messagesContainer']").innerHTML += app_chatter.messageSentTemplate(msg.content)
                        } else {
                            tabContent.querySelector("[data-name='messagesContainer']").innerHTML += app_chatter.messageRecTemplate(msg.content, userdata.profile_picture)
                        }
                    }

                    chatTabs.appendChild(tabContent)
                    
                    new bootstrap.Tab(navContent.querySelector(`[data-chatName=${roomName.room_name}]`)).show()
                    tabContent.querySelector("[data-name='messagesContainer']").scrollTop = tabContent.querySelector("[data-name='messagesContainer']").scrollHeight
                } else {
                    new bootstrap.Tab(navContent.querySelector(`[data-chatName=${roomName.room_name}]`)).show()
                }
            }
        })
    }
}