var app_editor = {
    editor: null,
    bodyTemplate:`<div class="navbar navbar-expand-lg navbar-light bg-light ps-1">
                    <button class="btn btn-secondary btn-sm ms-1" type="button">
                        <i class="fa-solid fa-bars"></i>
                    </button>


                    <a class="btn btn-secondary btn-sm ms-1 dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">File </a>
                    <ul class="dropdown-menu ">
                        <li>
                            <div class="input-group mb-1">
                            <input id="askForFile" type="text" class="form-control form-control-sm" placeholder="Enter/file/path" aria-label="Enter/file/path" aria-describedby="button-addon2">
                            <button class="btn btn-sm btn-outline-secondary" type="button" id="btnOpenFile">Open file</button>
                            </div>
                        </li>
                        <li>
                            <div class="input-group mb-1">
                            <input id="inputAskForFolder" type="text" class="form-control form-control-sm" placeholder="Enter/folder/path" aria-label="Enter folder path" aria-describedby="button-addon2">
                            <button class="btn btn-sm btn-outline-secondary" type="button" id="btnOpenFolder">Open folder</button>
                            </div>
                        </li>
                    </ul>

                    <button class="btn btn-secondary btn-sm ms-1" type="button" id="saveFile">Save</button>
                    <button class="btn btn-secondary btn-sm ms-1" type="button">View</button>
                </div>

                <div style="height: calc(100% - 47px)">
                    <div class="d-flex h-100">
                        <div id="explorer" class="card" style="overflow: auto; resize: horizontal; width: 250px; min-width: 150px; max-width: 450px; ">
                            <ul id="explorerItems"></ul>
                        </div>
                        <div class="w-100 h-100"id="editor"></div>
                        
                    </div>
                </div>`,

    updateExplorer(content, parent){
        if (parent == document.getElementById("explorerItems")){
            parent.innerHTML = ""
        }
        
        for (let item in content){
            console.log(content[item]["type"])
            if (content[item]["type"] == "file"){
                let itemElement = document.createElement("li")
                itemElement.innerHTML = item
                itemElement.setAttribute("data-path", content[item]["path"])
                itemElement.setAttribute("data-type", "file")
                itemElement.setAttribute("data-name", content[item]["name"])
                parent.appendChild(itemElement)
            }
            else if (content[item]["type"] == "folder"){
                let itemElement = document.createElement("li")
                itemElement.innerHTML = item + "+"
                itemElement.setAttribute("data-path", content[item]["path"])
                itemElement.setAttribute("data-type", "folder")
                itemElement.setAttribute("data-already-lodaed", "false")
                itemElement.setAttribute("data-bs-toggle", "collapse")
                itemElement.setAttribute("data-bs-target", String("#collapse" + item))
                itemElement.id = item
                let collapseElement = document.createElement("ul")
                collapseElement.id = "collapse" + item
                /*collapseElement.classList.add("collapse")*/
                itemElement.appendChild(collapseElement)

                parent.appendChild(itemElement)
            }
        }
    },

    async askForFile(path="", name=""){
        let wantedFilePath = document.getElementById("askForFile")
        let wantedFileName
        if (path == ""){
            wantedFilePath = inputAskForFile.value
        } else {
            wantedFilePath = path
        }
        if (name == ""){
            wantedFileName = wantedFilePath.substring(wantedFilePath.lastIndexOf("\\") + 1);
        } else {
            wantedFileName = name
        }
        let resp = await main.exchangeData('/openFileAPI/', { path: wantedFilePath,})
        //let respText = await resp.text()
        
        //editorDiv.setAttribute("data-path", wantedFilePath)
        //editorDiv.setAttribute("data-name", wantedFileName)
        app_editor.editor.setValue(resp, 1)
    },

    async askForFolder(path=""){
        let wantedFolderPath
        if (path == ""){
            wantedFolderPath = document.getElementById("inputAskForFolder").value
        } else {
            wantedFolderPath = path
        }
        
        let resp = await main.exchangeData('/openFolderAPI/', {path: wantedFolderPath})
        app_editor.updateExplorer(resp, document.getElementById("explorerItems"))
    },

    async init(thread){
        main.clearThread(thread)
        thread.innerHTML = app_editor.bodyTemplate
        app_editor.editor = ace.edit("editor");
        app_editor.editor.setTheme("ace/theme/iplastic")
        app_editor.editor.session.setMode("ace/mode/javascript");

        document.getElementById("btnOpenFolder").addEventListener("click", async ()=>{
            await app_editor.askForFolder()
        })

        document.getElementById("explorerItems").addEventListener("click", async (e)=>{
            console.log(e.target)
            if (e.target.getAttribute("data-type") == "file"){
                e.target.parentElement.classList.add("show")
                await app_editor.askForFile(e.target.getAttribute("data-path"), e.target.getAttribute("data-name"))
            } else if (e.target.getAttribute("data-type") == "folder"){
                if(e.target.getAttribute("data-already-lodaed") == "false"){
                    await app_editor.askForFolder(e.target.dataset.path, e.target.getAttribute("data-path"))
                    e.target.setAttribute("data-already-lodaed", "true")
                }
            }
        })
    }
}