from django.db import models


# 🍽 MENU ITEMS
class MenuItem(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    cost = models.IntegerField()
    image = models.URLField(blank=True, null=True)  # store image URL

    def __str__(self):
        return self.name


# 🛒 ORDERS (MULTIPLE ITEMS SUPPORT)
class Order(models.Model):
    table_number = models.IntegerField()
    items = models.TextField()   # stores "Pizza x2, Burger x1"
    total = models.IntegerField()

    status = models.CharField(
        max_length=20,
        default="Pending"   # Pending / Preparing / Done
    )

    estimated_time = models.IntegerField(default=15)  # ⏱ ETA in minutes

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Table {self.table_number} - ₹{self.total} ({self.status})"