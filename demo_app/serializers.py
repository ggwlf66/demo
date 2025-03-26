from rest_framework import serializers
from .models import *


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ['frinds', 'frind_requests_done', 'frind_requests_received',
                'following', 'follow_request_done', 'follow_requests_received',
                'followed_by', 'recommendations', 'recommended_by']

class NewPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ['post_text_content', 'created_at', 'visibility', 'created_at']