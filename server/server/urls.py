"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from jobofferanalyzer.views import FactorAPIView, UserAPIView, LoginAPIView, JobOfferAnalysisAPIView, SignUpAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', LoginAPIView.as_view()),
    path('api/auth/signup/', SignUpAPIView.as_view()),
    path('api/users/', UserAPIView.as_view()),
    path('api/factors/', FactorAPIView.as_view()),
    path('api/jobofferanalysis/', JobOfferAnalysisAPIView.as_view()),
]
