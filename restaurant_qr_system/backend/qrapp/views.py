import qrcode
from io import BytesIO
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import MenuItem, Order
from .serializers import MenuItemSerializer, OrderSerializer


# ✅ HOME PAGE
def home(request):
    return HttpResponse("Backend is Running 🚀")


# ✅ GET MENU ITEMS
@api_view(['GET'])
def menu_list(request):
    items = MenuItem.objects.all()
    serializer = MenuItemSerializer(items, many=True)
    return Response(serializer.data)


# ✅ CREATE ORDER
@api_view(['POST'])
def create_order(request):

    items = request.data.get("items")
    total = request.data.get("total")
    table_number = request.data.get("table_number")

    order = Order.objects.create(
        items=items,
        total=total,
        table_number=table_number
    )

    return Response({"message": "Order placed"}, status=201)

# ✅ GET ALL ORDERS (optional for admin view)
@api_view(['GET'])
def order_list(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# ✅ GENERATE QR CODE (table-based)
@api_view(['GET'])
def generate_qr(request, table):

    # frontend menu link
    url = f"http://localhost:3000/menu/{table}"

    img = qrcode.make(url)

    buffer = BytesIO()
    img.save(buffer, format="PNG")

    return HttpResponse(buffer.getvalue(), content_type="image/png")
@api_view(['PATCH'])
def update_order(request, id):
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    new_status = request.data.get("status", order.status)

    order.status = new_status

    # 🔥 UPDATE ETA
    if new_status == "Pending":
        order.estimated_time = 15
    elif new_status == "Preparing":
        order.estimated_time = 10
    elif new_status == "Done":
        order.estimated_time = 0

    order.save()

    return Response({"message": "Updated"})
@api_view(['GET'])
def get_order_status(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)