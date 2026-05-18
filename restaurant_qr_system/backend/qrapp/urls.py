from django.urls import path
from . import views

urlpatterns = [

    path('', views.home),

    path('menu/', views.menu_list),

    path('order/', views.create_order),

    path('orders/', views.order_list),

    path('orders/<int:id>/', views.update_order),  # 🔥 NEW

    path('qr/<int:table>/', views.generate_qr),
    
    path('order-status/', views.get_order_status),
]