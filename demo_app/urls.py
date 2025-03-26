from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("", views.home, name="home"),
    path("chat", views.chat, name="chat"),
    path("register", views.register, name="register"),
    path("login/", views.custom_login_view, name="login"),
    path("logout/", views.custom_logout_view, name="logout"),
    path("api_login/", views.api_login, name="api_login"),
    path("api_register/", views.api_register, name="api_register"),
    path('newpost/', views.newPostAPI.as_view(), name='new-post'),
    path('getSelfDetails/', views.getSelfDetails, name='getSelfDetails'),
    path('getUserDetails/', views.getUserDetails, name='getUserDetails'),
    path('search/', views.search, name='search'),
    path('getOneField/', views.getOneField, name='getOneField'),
    path('requestfollow/', views.requestfollow, name='requestfollow'),
    path('acceptFollowRequest/', views.acceptFollowRequest, name='acceptFollowRequest'),
    path('requestfriend/', views.requestfriend, name='requestfriend'),
    path('acceptFriendRequest/', views.acceptFriendRequest, name='acceptFriendRequest'),
    path('recommendUser/', views.recommendUser, name='recommendUser'),
    path('getOneUsersPosts/', views.getOneUsersPosts, name='getOneUsersPosts'),
    path('getOneFieldByList/', views.getOneFieldByList, name='getOneFieldByList'),
    path('getMainThread/', views.getMainThread, name='getMainThread'),
    path('getChatName/', views.getChatName, name='getChatName'),
    path('saveMessage/', views.saveMessage, name='saveMessage'),
    path('getMessages/', views.getMessages, name='getMessages'),
    path('uploadProfilePic/', views.uploadProfilePic, name='uploadProfilePic'),
    path('saveBio/', views.saveBio, name='saveBio'),
    path('unfollow/', views.unfollow, name='unfollow'),
    path('removeFollowRequest/', views.removeFollowRequest, name='removeFollowRequest'),
    path('removeFriendRequest/', views.removeFriendRequest, name='removeFriendRequest'),
    path('unfriend/', views.unfriend, name='unfriend'),
    path('likePost/', views.likePost, name='likePost'),
    path('openFolderAPI/', views.openFolderAPI, name='openFolderAPI'),
    path('openFileAPI/', views.openFileAPI, name='openFileAPI'),
    path('getLikedPosts/', views.getLikedPosts, name='getLikedPosts'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)