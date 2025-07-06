from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings

class Book(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    genre = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    page_count = models.PositiveIntegerField(null=True, blank=True)
    current_page = models.PositiveIntegerField(null=True, blank=True)
    started_reading = models.DateField(null=True, blank=True)
    finished_reading = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    language = models.CharField(max_length=50, blank=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    cover_image = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

class ReadingSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reading_sessions')
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    pages_read = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def duration(self):
        if self.end_time and self.start_time:
            return self.end_time - self.start_time
        return None

    def __str__(self):
        return f"Session on {self.book.title} by {self.user.username}"
