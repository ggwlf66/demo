from django.shortcuts import render, HttpResponse, render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from .forms import RegisterForm
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from .serializers import * 
from .utils import crop_to_square
from .editor import *


@login_required
def home(request):
    return render(request, 'base.html')


def chat(request):
    return render(request, 'chat.html')

@api_view(['POST'])
def getSelfDetails(request):
    userid = request.user.id
    userdetails = list(UserDetails.objects.filter(user_id=userid).values())
    return JsonResponse({"userdetails": userdetails})

@api_view(['POST'])
def getUserDetails(request):
    #TODO add priv check (user relationships)
    userid = request.data.get("user_id")
    myId = request.user.id
    userdetails = list(UserDetails.objects.filter(user_id=userid).values())
    userdetails2 = UserDetails.objects.filter(user_id=userid).values()
    isMyFriend = myId in userdetails2[0]["friends"]
    iFollow = myId in userdetails2[0]["followed_by"]
    iRequestedToFollow = myId in userdetails2[0]["follow_requests_received"]
    iRequestedFriend = myId in userdetails2[0]["friend_requests_received"]
    iRecommend = myId in userdetails2[0]["recommended_by"]
    return JsonResponse({"userdetails": userdetails, "isMyFriend": isMyFriend,
                        "iFollow":iFollow, "iRequestedToFollow":iRequestedToFollow,
                        "iRequestedFriend": iRequestedFriend, "iRecommend": iRecommend})

@api_view(['POST'])
def getOneField(request):
    if request.data.get("user_id"):
        userid = request.data.get("user_id")
    else:
        userid = request.user.id
    fieldata = list(UserDetails.objects.filter(user_id=userid).values(f"{request.data.get("field_name")}"))
    return JsonResponse({"fieldata": fieldata})

@api_view(['POST'])
def getOneFieldByList(request):
    useridList = request.data.get("list")
    fieldata = list(UserDetails.objects.filter(user_id__in=useridList).values())
    return JsonResponse({"fieldata": fieldata})


@api_view(['POST'])
def getOneUsersPosts(request):
    if request.data.get("user_id"):
        userid = request.data.get("user_id")
    else:
        userid = request.user.id
    posts = list(Posts.objects.filter(user_id=userid).values().order_by("-created_at"))
    userdetails = list(UserDetails.objects.filter(user_id=userid).values())
    return JsonResponse({"posts": posts, "userdetails": userdetails})

@api_view(['POST'])
def getMainThread(request): #todo rename or not
    userid = request.user.id
    followedUserIdList = UserDetails.objects.filter(user_id=userid).values("following")
    posts, usersdetails = [], []
    if len(followedUserIdList) > 0:
        posts = list(Posts.objects.filter(user_id__in=followedUserIdList[0]["following"]).values().order_by("-created_at"))
        usersdetails = list(UserDetails.objects.filter(user_id__in=followedUserIdList[0]["following"]).values())
    return JsonResponse({"posts": posts, "userdetails": usersdetails})

@api_view(['POST'])
def getLikedPosts(request):
    likedPostsIdList = UserDetails.objects.get(user_id=request.user.id).likes
    likedPosts = list(Posts.objects.filter(id__in=likedPostsIdList).values())
    likedPostsCreatorId = Posts.objects.filter(id__in=likedPostsIdList).values("user_id")
    likedPostsCreatorDetails = list(UserDetails.objects.filter(user_id__in=likedPostsCreatorId).values())
    return JsonResponse({"posts": likedPosts, "userdetails":likedPostsCreatorDetails})

@api_view(['POST'])
def requestfollow(request):
    #check relationship
    if request.user.id != request.data.get('user_id'): # dont follow yourself
        userfrom = request.user.id
        userto = User.objects.get(id=request.data.get('user_id'))
        userfromdetails = UserDetails.objects.get(user=request.user)

        if request.data.get('user_id') not in userfromdetails.follow_request_done:
            usertodetails = UserDetails.objects.get(user=userto)
            usertodetails.follow_requests_received.append(userfrom)
            usertodetails.save()

            userfromdetails.follow_request_done.append(request.data.get('user_id'))
            userfromdetails.save()

            return JsonResponse({"request status": "follow request done"})
    else:
        return JsonResponse({"request status": "no no no"})

@api_view(['POST'])
def unfollow(request):
    userfrom = request.user.id
    usertoid = int(request.data.get('user_id'))
    userto = User.objects.get(id=usertoid)
    userfromdetails = UserDetails.objects.get(user=request.user)

    if usertoid in userfromdetails.following:
        usertodetails = UserDetails.objects.get(user=userto)
        usertodetails.followed_by.remove(userfrom)
        userfromdetails.following.remove(usertoid)
        usertodetails.save()
        userfromdetails.save()

    return JsonResponse({"request status": "stopped following"})

@api_view(['POST'])
def removeFollowRequest(request):
    userfrom = request.user.id
    userto = User.objects.get(id=request.data.get('user_id'))
    usertoid = int(request.data.get('user_id'))
    userfromdetails = UserDetails.objects.get(user=request.user)

    if usertoid in userfromdetails.follow_request_done:
        usertodetails = UserDetails.objects.get(user=userto)
        usertodetails.follow_requests_received.remove(userfrom)
        userfromdetails.follow_request_done.remove(usertoid)
        usertodetails.save()
        userfromdetails.save()

    return JsonResponse({"request status": "follow request removed"})

@api_view(['POST'])
def unfriend(request):
    userfrom = request.user.id
    usertoid = int(request.data.get('user_id'))
    userto = User.objects.get(id=usertoid)
    userfromdetails = UserDetails.objects.get(user=request.user)

    if usertoid in userfromdetails.friends:
        usertodetails = UserDetails.objects.get(user=userto)
        usertodetails.friends.remove(userfrom)
        userfromdetails.friends.remove(usertoid)
        usertodetails.save()
        userfromdetails.save()

    return JsonResponse({"request status": "stopped following"})

@api_view(['POST'])
def removeFriendRequest(request):
    userfrom = request.user.id
    userto = User.objects.get(id=request.data.get('user_id'))
    usertoid = int(request.data.get('user_id'))
    userfromdetails = UserDetails.objects.get(user=request.user)

    if usertoid in userfromdetails.friend_requests_done:
        usertodetails = UserDetails.objects.get(user=userto)
        usertodetails.friend_requests_received.remove(userfrom)
        userfromdetails.friend_requests_done.remove(usertoid)
        usertodetails.save()
        userfromdetails.save()

    return JsonResponse({"request status": "follow request removed"})


@api_view(['POST'])
def acceptFollowRequest(request):
    recUser = request.user.id
    senderUser = User.objects.get(id=request.data.get('user_id'))
    
    recUserdetails = UserDetails.objects.get(user=request.user)
    recUserdetails.follow_requests_received.remove(request.data.get('user_id'))
    recUserdetails.followed_by.append(request.data.get('user_id'))
    recUserdetails.save()

    senderUserdetails = UserDetails.objects.get(user=senderUser)
    senderUserdetails.follow_request_done.remove(recUser)
    senderUserdetails.following.append(recUser)
    senderUserdetails.save()
    return JsonResponse({"request status": f"started following {senderUserdetails.user_name}"})

@api_view(['POST'])
def requestfriend(request):
    #check relationship
    if request.user.id != request.data.get('user_id'):
        userfrom = request.user.id
        userto = User.objects.get(id=request.data.get('user_id'))
        usertoid = request.data.get('user_id')
        userfromdetails = UserDetails.objects.get(user=request.user)
        if usertoid not in userfromdetails.friend_requests_done:
            usertodetails = UserDetails.objects.get(user=userto)
            usertodetails.friend_requests_received.append(userfrom)
            usertodetails.save()
            
            userfromdetails.friend_requests_done.append(usertoid)
            userfromdetails.save()
            return JsonResponse({"request status": "friend request done"})
    else:
        return JsonResponse({"request status": "no no no"})


@api_view(['POST'])
def acceptFriendRequest(request):
    userfrom = request.user.id
    userto = User.objects.get(id=request.data.get('user_id'))

    usertodetails = UserDetails.objects.get(user=userto)
    usertodetails.friend_requests_done.remove(userfrom)
    usertodetails.friends.append(userfrom)
    usertodetails.save()

    userfromdetails = UserDetails.objects.get(user=request.user)
    userfromdetails.friend_requests_received.remove(request.data.get('user_id'))
    userfromdetails.friends.append(request.data.get('user_id'))
    userfromdetails.save()

    return JsonResponse({"request status": f"started following {usertodetails.user_name}"})

@api_view(['POST'])
def recommendUser(request):
    #check relationship
    if request.user.id != request.data.get('user_id'):
        userfrom = request.user.id
        userto = User.objects.get(id=request.data.get('user_id'))
        usertodetails = UserDetails.objects.get(user=userto)
        usertodetails.recommended_by.append(userfrom)
        usertodetails.save()
        userfromdetails = UserDetails.objects.get(user=request.user)
        userfromdetails.recommendations.append(request.data.get('user_id'))
        userfromdetails.save()
        return JsonResponse({"request status": "friend request done"})
    else:
        return JsonResponse({"request status": "no no no"})

@api_view(['POST'])
def search(request):
    #check relationship
    searchedexpression = request.data.get("searchedexpression")
    resultList = User.objects.filter(username__icontains=searchedexpression).values("id")
    resultItemList = []
    if len(resultList) > 0:
        for i in range(len(resultList)):
            userid = resultList[i]['id']
            resultItemList.append(list(UserDetails.objects.filter(user_id=userid).values()))
    else:
        userinfo = 'not found'
    return JsonResponse({"userdata": resultItemList})


# if not logged in returns login page else redirects home
def custom_login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    return render(request, "login.html")

# process login request from js 
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    if request.content_type != "application/json":
        return Response({"error": "Csak JSON formátum engedélyezett!"}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)
        return Response({"token": token.key, "redirect": "/"})
    else:
        return Response({"error": "Hibás bejelentkezési adatok!"}, status=400)

# process logout request from js 
def custom_logout_view(request):
    logout(request)
    return redirect("login")

# process login request from js 
@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    if request.content_type != "application/json":
        return Response({"error": "Csak JSON formátum engedélyezett!"}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

    username = request.data.get("username")
    password = request.data.get("password")
    password_conf = request.data.get("password_conf")
    if password != password_conf:
        return Response({"error": "password != confirm password!"})
    else:
        user = User.objects.create_user(username=username,  password=password)
        #user = authenticate(username=username, password=password)
        UserDetails.objects.create(user=user)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            login(request, user)
            return Response({"token": token.key, "redirect": "/"})
        else:
            return Response({"error": "Hibás bejelentkezési adatok!"}, status=400)


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data["password"])  # Jelszó titkosítása
            user.save()

            UserDetails.objects.create(user=user)

            login(request, user)  # Automatikus bejelentkezés
            return redirect("home")  # Átirányítás pl. a főoldalra
    else:
        form = RegisterForm()
    return render(request, "register.html", {"form": form})

class newPostAPI(CreateAPIView):
    serializer_class = NewPostSerializer
    permission_classes = [IsAuthenticated]  # Csak bejelentkezett felhasználók hozhatnak létre új profilt

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Automatikusan beállítja a bejelentkezett usert

@login_required
@api_view(['POST'])
def getChatName(request):
    user2 = User.objects.get(id=request.data.get('user_id'))
    
    # get chatrooms name or create new record
    chat_room, created = ChatRoom.objects.get_or_create(
        user1=min(request.user, user2, key=lambda u: u.id),
        user2=max(request.user, user2, key=lambda u: u.id)
    )

    return Response({"room_name": chat_room.get_room_name()})

@login_required
@api_view(['POST'])
def saveMessage(request):
    message = Message(room=ChatRoom.objects.get(room_name=request.data.get('room')),
                    sender=request.user, content=request.data.get('message'))
    message.save()
    return Response({"status": "ok"})

@login_required
@api_view(['POST'])
def getMessages(request):
    messages = Message.objects.filter(room=ChatRoom.objects.get(room_name=request.data.get('room'))).values().order_by("timestamp")
    return Response({"messages":messages})

"""@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def user_images(request):
    if request.method == "GET":
        images = UserDetails.objects.filter(user=request.user)
        image_list = [
            {"id": img.id, "image_url": img.image.url, "uploaded_at": img.uploaded_at}
            for img in images
        ]
        return JsonResponse(image_list, safe=False)

    elif request.method == "POST":
        if "image" not in request.FILES:
            return JsonResponse({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        image = request.FILES["image"]
        user_image = UserDetails.objects.create(user=request.user, image=image)
        return JsonResponse(
            {"id": user_image.id, "image_url": user_image.image.url, "uploaded_at": user_image.uploaded_at},
            status=status.HTTP_201_CREATED
        )"""

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def uploadImage(request):
    if "image" not in request.FILES:
        return JsonResponse({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

    image = request.FILES["image"]
    user_image = UserDetails.objects.create(user=request.user, image=image)
    return JsonResponse(
        {"id": user_image.id, "image_url": user_image.image.url, "uploaded_at": user_image.uploaded_at},
        status=status.HTTP_201_CREATED
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def _uploadProfilePic(request):
    user = UserDetails.objects.get(user_id=request.user.id)
    user.profile_picture = request.FILES["image"]
    crop_to_square(user.profile_picture)
    user.save()
    
    return Response({"status": "ok"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def uploadProfilePic(request):
    user = UserDetails.objects.get(user_id=request.user.id)
    image = request.FILES["image"]
    cropped_image = crop_to_square(image)

    user.profile_picture = cropped_image
    user.save()

    return Response({"status": "ok"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def saveBio(request):
    user = UserDetails.objects.get(user_id=request.user.id)
    user.bio = request.data.get("bio_text")
    user.save()
    return Response({"status": "ok"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def likePost(request):
    postid = int(request.data.get("post_id"))
    post = Posts.objects.get(id=postid)
    me = UserDetails.objects.get(user_id=request.user.id)

    if request.user.id not in post.liked_by:
        post.liked_by.append(request.user.id)
        post.save()
        me.likes.append(postid)
        me.save()
        return Response({"status": "liked"})
    else:
        post.liked_by.remove(request.user.id)
        post.save()
        me.likes.remove(postid)
        me.save()
        return Response({"status": "likeremoved"})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def openFolderAPI(request):
    path = request.data.get("path")
    folderContent = openFolderdata(path)
    return Response(folderContent)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def openFileAPI(request):
    path = request.data.get("path")
    fileContent = openFile(path)
    return Response(fileContent)

