from django.db import models
from django.contrib.auth.models import User

def user_directory_path(instance, filename):
    return f"user_{instance.user.id}/{filename}"

class UserDetails(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=255, default="")
    bio = models.CharField(max_length=255, default="")
    profile_picture = models.ImageField(upload_to=user_directory_path, default='default/defaultprofpic.jpg')
    friends = models.JSONField(default=list)
    friend_requests_done = models.JSONField(default=list)
    friend_requests_received = models.JSONField(default=list)

    following = models.JSONField(default=list)
    follow_request_done = models.JSONField(default=list)
    follow_requests_received = models.JSONField(default=list)
    followed_by = models.JSONField(default=list)

    recommendations = models.JSONField(default=list)
    recommended_by = models.JSONField(default=list)

    likes = models.JSONField(default=list)

    def save(self, *args, **kwargs):
        #Automatikusan beállítja a user_name mezőt a mentés előtt.
        if self.user:  
            self.user_name = self.user.username  # Beállítjuk a felhasználónév mezőt
        super().save(*args, **kwargs)


class Posts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post_text_content = models.CharField(max_length=255)
    #gallery = models.ImageField(upload_to='uploads/')  # 🔹 Kép mentése
    visibility = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    liked_by = models.JSONField(default=list)
    shared_by = models.JSONField(default=list)
    recommended_by = models.JSONField(default=list)
    comments = models.JSONField(default=list)

class ChatRoom(models.Model):
    user1 = models.ForeignKey(User, related_name="chatrooms_user1", on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name="chatrooms_user2", on_delete=models.CASCADE)
    room_name = models.CharField(max_length=255, default="")

    def save(self, *args, **kwargs): 
        self.room_name = self.get_room_name()
        super().save(*args, **kwargs)

    def get_room_name(self):
        """Egyedi szoba azonosító generálása"""
        return f"chat_{min(self.user1.id, self.user2.id)}_{max(self.user1.id, self.user2.id)}"
    
    

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)