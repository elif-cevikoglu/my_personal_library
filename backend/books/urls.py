from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import BookListCreateAPIView, BookRetrieveUpdateDestroyAPIView, ReadingSessionViewSet

router = DefaultRouter()
router.register(r'reading-sessions', ReadingSessionViewSet, basename='reading-session')

urlpatterns = [
    path('books/', BookListCreateAPIView.as_view(), name='api-book-list-create'),
    path('books/<int:pk>/', BookRetrieveUpdateDestroyAPIView.as_view(), name='api-book-rud'),
    path('', include(router.urls)),
]
