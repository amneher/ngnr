from django.shortcuts import render, get_object_or_404
from .models import *


def recent(request):
	posts = Post.objects.filter(published=True).order_by('created')

	return render(request, 'blog_home.html', {'posts': posts})

def post_detail(request, post_id):
	post = Post.objects.get_object_or_404(id=post_id)
	comments = Comment.objects.filter(approved=True, post=post.id)
	
	return render(request, 'detail.html', {'post': post, 'comments':comments})

