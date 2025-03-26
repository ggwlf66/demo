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

    myusername: '',
    myuserid: '',

    clearThread(thread){
        thread.innerHTML = "";
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
            await main.exchangeData("/newpost/", {
                post_text_content: document.getElementById('txtAreaNewPost').value,
                visibility: 'public' // Ha nincs kép, null-t adunk meg
            })
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
        await app_chatter.init(document.getElementById('main_thread_content'))
    }
}

main.init();