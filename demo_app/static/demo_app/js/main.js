var main = {
    threads_counter: 0,
    thread_ids: {},
    main_thread: document.getElementById('main_thread'),
    threads_container: document.getElementById('threads_container'),
    btn_addNew: document.getElementById('addNew'),

    btnViewOwnProfile: document.getElementById('btnViewOwnProfile'),
    btnSearch: document.getElementById('btnSearch'),
    btnHome: document.getElementById('btnHome'),
    btnLikes: document.getElementById('btnLikes'),
    btnChatter: document.getElementById('btnChatter'),
    btnEditor: document.getElementById('btnEditor'),
    myusername: '',
    myuserid: '',

    clearThread(thread){
        thread.innerHTML = "";
    },

    templates:{
        thread_inner_template: `<div class="dss_thread_nav d-flex">
                        <div class="d-flex ms-auto">
                            <div class="dropdown me-2">
                                <span type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-ellipsis"></i></span>  
                                <ul class="dropdown-menu dropdown-menu-end" data-name="navAppsDropDown">
                                    <li><a class="dropdown-item" data-name="app_poster">Feed</a></li>
                                    <li><a class="dropdown-item" data-name="app_search">Search</a></li>
                                    <li><a class="dropdown-item" data-name="app_chatter">Chats</a></li>
                                    <li><a class="dropdown-item" data-name="app_likes">Liked</a></li>
                                    <li><a class="dropdown-item" data-name="app_profile">Profile</a></li>
                                </ul>
                            </div>
                            <button type="button" class="btn-close ms-auto" data-name="closeThread" aria-label="Close"></button>
                        </div>
                        
                    </div>
                    <div class="dss_thread_inner" data-name="thread_content" data-name="thread_inner">
                        <div class="d-flex justify-content-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>`,
        
        
    },

    adjustItemsAlignment() {
        const dss_main = document.querySelector(".dss_main");
        const dss_threads_container = document.querySelector(".dss_threads_container");
    
        // Ha az items szélesebb, mint a content, akkor balra igazítás
        if (dss_threads_container.scrollWidth > dss_main.clientWidth - 140) {
            dss_threads_container.style.justifyContent = "flex-start";
        } else {
            dss_threads_container.style.justifyContent = "center";
        }
    },

    getCSRFToken() {
        const cookieValue = document.cookie
            .split("; ")
            .find(row => row.startsWith("csrftoken="))
            ?.split("=")[1];
        return cookieValue || "";
    },

    async exchangeData(url, obj) {
        let data = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json", "X-CSRFToken": main.getCSRFToken()},
            body: JSON.stringify(obj)})
        return await data.json()
    },

    async init(){
        
        window.addEventListener("load", main.adjustItemsAlignment);
        window.addEventListener("resize", main.adjustItemsAlignment);

        document.getElementById('btnPost').addEventListener('click', async function(){
            let newPostTextarea = document.getElementById('txtAreaNewPost')
            await main.exchangeData("/newpost/", {
                post_text_content: newPostTextarea.value,
                visibility: 'public' // Ha nincs kép, null-t adunk meg
            })
            newPostTextarea.value = ""
        })
        
        btnViewOwnProfile.addEventListener('click', async function(){
            await app_profile.init(document.getElementById('main_thread_content'), true)//TODO
        })

        this.btnSearch.addEventListener('click', async function(){
            await app_search.init(document.getElementById('main_thread_content'))//TODO
        })
        this.btnHome.addEventListener('click', async function(){
            await app_poster.init(document.getElementById('main_thread_content'))
        })
        this.btnLikes.addEventListener('click', async function(){
            await app_likes.init(document.getElementById('main_thread_content'))
        })
        this.btnChatter.addEventListener('click', async function(){
            await app_chatter.init(document.getElementById('main_thread_content'))
        })
        this.btnEditor.addEventListener('click', async function(){
            let container = document.getElementById('main_thread_content')
            main.main_thread.classList.add("dss_wide")
            await app_editor.init(container)
            document.getElementById("toggle_width").checked = true
        })
        async function addThread(event){
            let newFeed = document.createElement("div")
            newFeed.classList.add("dss_main_thread")
            newFeed.innerHTML += main.templates.thread_inner_template
            threads_container.appendChild(newFeed)
            await window[event.target.dataset.name].init(newFeed.querySelector("[data-name='thread_content']"))
            newFeed.querySelector("[data-name='closeThread']").addEventListener("click", ()=>{
                newFeed.remove()
                main.adjustItemsAlignment()
            })
            newFeed.querySelector("[data-name='navAppsDropDown']").addEventListener("click", async (event)=>{
                await window[event.target.dataset.name].init(newFeed.querySelector("[data-name='thread_content']"))
            })
            main.adjustItemsAlignment()
        }
        document.getElementById("addThreadDropDown").addEventListener("click", async (event)=>{
            await addThread(event)
        })

        //i love js <3
        document.getElementById("toggle_width").addEventListener("change", ()=>{
            main.main_thread.classList[document.getElementById("toggle_width").checked?"add":"remove"]("dss_wide")
        })

        await app_poster.init(document.getElementById('main_thread_content'))
    }
}

main.init();