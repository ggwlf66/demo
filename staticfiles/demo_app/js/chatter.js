var app_chatter = {
    bodyTemplate: ()=>`<div class="d-block px-3 border-bottom _post dss_post">
                        <div class="d-flex flex-column" data-name="result_container"></div>
                        <ul class="nav nav-tabs mt-4" id="myTab" role="tablist"">
                        <li class="nav-item-sm" role="presentation">
                            <button class="nav-link py-0 px-2 active" id="profile-tab" data-bs-toggle="tab" data-name="friends" data-bs-target=".tabpanel-friends" type="button" role="tab">
                                Friends
                            </button>
                        </li>    
                        <li class="nav-item-sm" role="presentation">
                            <button class="nav-link py-0 px-2 " id="home-tab" data-bs-toggle="tab" data-name="chats" data-bs-target=".tabpanel-chats" type="button" role="tab">
                                Chats
                            </button>
                        </li>
                        </ul>

                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade show active tabpanel-friends" role="tabpanel">
                                <div class="d-flex flex-column align-items-center" data-name="friendsList">            
                                    You dont have any...
                                </div>
                            </div>
                            <div class="tab-pane fade show tabpanel-chats" role="tabpanel" >
                                <div>
                                    <div class="d-block overflow-auto" data-name="messagesContainer" style="height: calc(100vh - 125px);">
                                        
                                    </div>
                                    <div class="d-flex">
                                        <input type="text" class="form-control form-control-sm" data-name="messageInput">
                                        <button data-name="btnSendMessage" class="btn btn-sm m-0 btn-outline-secondary"><i class="fa-solid fa-paper-plane"></i></button>
                                        <button type="button" class="btn btn-outline-secondary btn-sm"><i class="fas fa-image"></i></button>
                                        <button type="button" class="btn btn-outline-secondary btn-sm"><i class="fa-solid fa-music"></i></button>
                                        <button type="button" class="btn btn-outline-secondary btn-sm"><i class="fas fa-plus"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`,
    
    messageSentTemplate:(messageContent)=>`<div class="d-flex bg-transparent mt-2" >
                                <div class="ps-5 w-100 d-flex" data-name="contentBody">
                                    <div class="ms-auto me-1 p-2 rounded bg-light text-wrap text-break">
                                        ${messageContent}
                                    </div>
                                </div>
                                <div style="width: 40px;">
                                    <div style="width: 40px; height: 40px; background-color: #c6c6c6; border-radius: 50%;"></div>
                                </div>
                            </div>`,

    messageRecTemplate:(messageContent)=>`<div class="d-flex bg-transparent mt-2">
                                            <div style="width: 40px;">
                                                <div style="width: 40px; height: 40px; background-color: #c6c6c6; border-radius: 50%;"></div>
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
        let messagesContainer = thread.querySelector("[data-name='messagesContainer']")
        let messageInput = thread.querySelector("[data-name='messageInput']")
        let tabFriends = thread.querySelector("[data-name='friends']")


        const roomName = "chatroom1";  // Példa szoba neve
        const chatSocket = new WebSocket(`ws://${window.location.host}/ws/chat/${roomName}/`);

        chatSocket.onmessage = async function(event) {
            const data = JSON.parse(event.data);
            const messages = document.getElementById("messages");
            const newMessage = document.createElement("li");
            newMessage.textContent = `${data.username}: ${data.message}`;
            messages.appendChild(newMessage);
        };

        tabFriends.addEventListener('shown.bs.tab', async (event)=>{
            await app_lists.init(thread.querySelector("[data-name='friendsList']"),"friends")
        })

        let tabChats = thread.querySelector("[data-name='friends']")
        tabChats.addEventListener('shown.bs.tab', ()=>{
            console.log('chats')
        })

        let btnSendMsg = thread.querySelector("[data-name='btnSendMessage']")
        btnSendMsg.addEventListener("click", async ()=>{ await sendMessage() })

        async function sendMessage(){
            let message = messageInput.value
            messageInput.value = ""
            if(message !== ""){
                messagesContainer.innerHTML += app_chatter.messageRecTemplate(message)
                chatSocket.send(JSON.stringify({ message: message, username: "{{ request.user.username }}" }));
            }
        }

        await app_lists.init(thread.querySelector("[data-name='friendsList']"),"friends")
    }
}