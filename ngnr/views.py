# decorator for indicating a view requires a user to be logged in to view.
from django.contrib.auth.decorators import login_required
# import plugin to handle user authentication and admin
from django.contrib.auth.forms import AdminPasswordChangeForm, PasswordChangeForm, UserCreationForm, AuthenticationForm
from django.contrib.auth import update_session_auth_hash, login, logout, authenticate
# shows popups and other messages 
from django.contrib import messages
# standard libraries for handling requests and returning views
from django.shortcuts import render, redirect
# standard django user model
from django.contrib.auth.models import User
# plugin for authenticating with github, twitter, fb.
from social_django.models import UserSocialAuth



# user self service admin view
@login_required
def settings(request):
    user = request.user

    # log in with github
    try:
        github_login = user.social_auth.get(provider='github')
    except UserSocialAuth.DoesNotExist:
        github_login = None

    # log in with twitter
    try:
        twitter_login = user.social_auth.get(provider='twitter')
    except UserSocialAuth.DoesNotExist:
        twitter_login = None

    # log in with fb.
    try:
        facebook_login = user.social_auth.get(provider='facebook')
    except UserSocialAuth.DoesNotExist:
        facebook_login = None

    can_disconnect = (user.social_auth.count() >
                      1 or user.has_usable_password())

    # return proper url for authenticating
    return render(request, 'settings.html', {
        'github_login': github_login,
        'twitter_login': twitter_login,
        'facebook_login': facebook_login,
        'can_disconnect': can_disconnect
    })
    
# user creation view    
def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            user = authenticate(
                username=form.cleaned_data.get('username'),
                password=form.cleaned_data.get('password1')
            )
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

# user self service password change view
@login_required
def password(request):
    if request.user.has_usable_password():
        PasswordForm = PasswordChangeForm
    else:
        PasswordForm = AdminPasswordChangeForm

    if request.method == 'POST':
        form = PasswordForm(request.user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            messages.success(
                request, 'Your password was successfully updated!')
            return redirect('password')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = PasswordForm(request.user)
    return render(request, 'password.html', {'form': form})

# log out view
def logout(request):
    logout(request)
    return redirect('/')
    
# self service view for removing a user    
def deluser(request, user):
    try:
        user = User.objects.get(username = user)
        user.delete()
        messages.success(request, "Sorry to see you go!")
    except User.DoesNotExist:
        messages.error(request, "Hmm, that user doesn't exist.")
        return redirect('/')
    except Exception as e:
        return render(request, 'home.html', {'err':e.message})
    return redirect('/')