from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from back.views import login_view, product_list, product_detail, register_view ,add_to_cart , get_cart_items , checkout , product_lookup , get_order_confirmation , remove_cart_item , get_user_orders, admin_dashboard_stats, admin_products_list, admin_orders_list, admin_users_list
from django.conf import settings
from django.conf.urls.static import static


def home(request):
    return JsonResponse({"message": "Django backend is running "})

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('login/', login_view),
    path('products/allproducts/', product_list),
    path('products/', product_list),
    path('products/<int:id>/', product_detail),
    path('register/', register_view),
    path('add-to-cart/', add_to_cart),
    path('cart/<int:user_id>/', get_cart_items),
    path('checkout/', checkout, name='checkout'),
    path('product/lookup/', product_lookup),
    path('order/<int:order_id>/confirmation/', get_order_confirmation),
    path('cart/<int:user_id>/remove/<int:item_id>/', remove_cart_item),
    path('orders/', get_user_orders),
    path('api/admin/stats/', admin_dashboard_stats, name='admin_dashboard_stats'),
    path('api/admin/products/', admin_products_list, name='admin_products_list'),
    path('api/admin/orders/', admin_orders_list, name='admin_orders_list'),
    path('api/admin/users/', admin_users_list, name='admin_users_list'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
