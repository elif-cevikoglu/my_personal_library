import django_filters
from .models import Book

class BookFilter(django_filters.FilterSet):
    is_read = django_filters.BooleanFilter(field_name='is_read')
    genre = django_filters.CharFilter(field_name='genre', lookup_expr='iexact')

    class Meta:
        model = Book
        fields = ['is_read', 'genre']
