from django.db import models
from markupfield.fields import MarkupField
from django.contrib.auth.models import User



class Post(models.Model):

	created = models.DateTimeField()
	updated = models.DateTimeField(auto_now_add=True)
	published = models.BooleanField(default=False)
	title = models.CharField(max_length=255)
	author = models.ForeignKey(User, on_delete=models.CASCADE)
	content = MarkupField(default_markup_type='markdown')

	def __str__(self):
		return self.title


class Comment(models.Model):
	
	post = models.ForeignKey('Post', on_delete=models.CASCADE)
	created = models.DateTimeField()
	updated = models.DateTimeField()
	approved = models.BooleanField(default=False)
	author = models.ForeignKey(User, on_delete=models.CASCADE)
	title = models.CharField(max_length=255)
	content = MarkupField(default_markup_type='markdown')
	ups = models.IntegerField()
	downs = models.IntegerField()

	def __str__(self):
		return self.title