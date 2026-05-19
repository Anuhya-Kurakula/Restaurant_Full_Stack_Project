import qrcode
from io import BytesIO
from django.http import HttpResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt

from .models import MenuItem, Order
from .serializers import MenuItemSerializer, OrderSerializer


# ✅ HOME
def home(request):
    return HttpResponse("Backend is Running 🚀")


# ✅ MENU
@api_view(['GET'])
def menu_list(request):
    items = MenuItem.objects.all()
    serializer = MenuItemSerializer(items, many=True)
    return Response(serializer.data)


# ✅ CREATE ORDER (IMPORTANT FIXED)
@csrf_exempt
@api_view(['POST'])
def create_order(request):

    serializer = OrderSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Order placed successfully"}, status=201)

    return Response(serializer.errors, status=400)


# ✅ GET ALL ORDERS
@api_view(['GET'])
def order_list(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# ✅ UPDATE ORDER STATUS
@api_view(['PATCH'])
def update_order(request, id):
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    order.status = request.data.get("status", order.status)

    if order.status == "Pending":
        order.estimated_time = 15
    elif order.status == "Preparing":
        order.estimated_time = 10
    elif order.status == "Done":
        order.estimated_time = 0

    order.save()
    return Response({"message": "Updated"})


# ✅ ORDER STATUS
@api_view(['GET'])
def get_order_status(request):
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# ✅ QR CODE GENERATOR
@api_view(['GET'])
def generate_qr(request, table):

    url = f"https://your-frontend.vercel.app/menu/{table}"

    img = qrcode.make(url)

    buffer = BytesIO()
    img.save(buffer, format="PNG")

    return HttpResponse(buffer.getvalue(), content_type="image/png")