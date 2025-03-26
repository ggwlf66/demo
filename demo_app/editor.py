import os

def saveFile(data):
    itemname = data.get('itemname')
    saveFilePath = data.get('path')
    content = data.get('content')
    
    splittedFilePath = saveFilePath.split("\\")
    filePath = ""
    for name in splittedFilePath:
        filePath += name
        if name != splittedFilePath[-1]:
            filePath += "/"
    fileContent = open(filePath, "w")
    fileContent.write(content)
    fileContent.close()
    return "ok"

def openFile(wantedFilePath):
    splittedFilePath = wantedFilePath.split("\\")
    filePath = ""
    for name in splittedFilePath:
        filePath += name
        if name != splittedFilePath[-1]:
            filePath += "/"
    fileContent = open(filePath, "r", encoding='utf-8').read()
    #fileContent = fileContent.replace("  ", "\t")
    return fileContent

def openFolderdata(wantedFolderPath):
    folderContent = {}
    splittedFolderPath = wantedFolderPath.split("\\")
    folderPath = ""

    for name in splittedFolderPath:
        folderPath += name
        if name != splittedFolderPath[-1]:
            folderPath += "/"

    firstFolderList = os.listdir(folderPath)
    for item in firstFolderList:
        currItemPath = folderPath + "/" + item
        if os.path.isdir(currItemPath):
            folderContent[item] = {
                "name": item,
                "type": "folder",
                "path": currItemPath
            }
        elif os.path.isfile(currItemPath):
            folderContent[item] = {
                "name": item,
                "type": "file",
                "path": currItemPath
            }
    return folderContent
