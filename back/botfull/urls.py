from django.conf.urls import url
from .views import ChatterBotView, ChatterBotAppView


urlpatterns = [
    url(
    	r'^$',
    	ChatterBotAppView.as_view(),
    	name='main'
    ),
    url(
        r'^api$',
        ChatterBotView.as_view(),
        name='chatterbot',
    )
]
