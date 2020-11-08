from django.contrib import admin

from .models import Post, Comment

class PostAdmin(admin.ModelAdmin):
	fields = []

class CommentAdmin(admin.ModelAdmin):
	fields = []


admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)