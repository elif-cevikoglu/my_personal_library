from django_filters.rest_framework import DjangoFilterBackend
from .filters import BookFilter
from .models import Book, ReadingSession
from .serializers import BookSerializer, ReadingSessionSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics, permissions, viewsets, status, filters
from django.utils import timezone

class BookListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'author']
    ordering_fields = ['title', 'created_at']

    def get_queryset(self):
        queryset = Book.objects.filter(user=self.request.user)

        is_read = self.request.query_params.get('is_read')
        if is_read in ['true', 'false']:
            queryset = queryset.filter(is_read=(is_read == 'true'))

        genre = self.request.query_params.get('genre')
        if genre:
            queryset = queryset.filter(genre__iexact=genre)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Book.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

class ReadingSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ReadingSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ReadingSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def start(self, request):
        book_id = request.data.get('book')
        if not book_id:
            return Response({"error": "book ID required"}, status=400)
        try:
            book = Book.objects.get(id=book_id, user=request.user)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=404)

        session = ReadingSession.objects.create(user=request.user, book=book)
        return Response(ReadingSessionSerializer(session).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def end(self, request, pk=None):
        session = self.get_object()
        session.end_time = timezone.now()
        session.pages_read = request.data.get('pages_read')
        session.notes = request.data.get('notes', '')
        session.save()
        return Response(ReadingSessionSerializer(session).data)