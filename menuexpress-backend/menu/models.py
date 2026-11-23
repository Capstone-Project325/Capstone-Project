from django.db import models

# Create your models here.

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    image = models.URLField(blank=True)
    is_available = models.BooleanField(default=True)
    ingredients = models.JSONField(
        null=True,
        blank=True,
        default=list,
        help_text="List of ingredient strings.",
    )
    allergens = models.JSONField(
        null=True,
        blank=True,
        default=None,
        help_text="List of allergen identifiers; null means unverified, and an empty list means verified none.",
    )

    def __str__(self):
        return self.name
