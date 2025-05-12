# Create this file at back/management/commands/fix_product_images.py

from django.core.management.base import BaseCommand
from back.models import Product

class Command(BaseCommand):
    help = 'Fix product image paths to use local Next.js public directory paths'

    def handle(self, *args, **options):
        products = Product.objects.all()
        updated_count = 0
        
        for product in products:
            product_id = product.id
            old_path = product.image
            
            # Skip products without image
            if not old_path:
                continue
                
            # Convert backend paths to frontend public paths if needed
            if '/media/' in old_path:
                # Strip /media/ prefix if present
                new_path = old_path.replace('/media/', '/images/')
                product.image = new_path
                product.save()
                updated_count += 1
                self.stdout.write(f"Updated product {product_id}: {old_path} → {new_path}")
            elif not old_path.startswith('/images/'):
                # Ensure path starts with /images/
                filename = old_path.split('/')[-1]
                new_path = f'/images/{filename}'
                product.image = new_path
                product.save()
                updated_count += 1
                self.stdout.write(f"Updated product {product_id}: {old_path} → {new_path}")
        
        self.stdout.write(self.style.SUCCESS(f"Updated {updated_count} products"))

# Create __init__.py files to make this a proper package
# back/management/__init__.py
# back/management/commands/__init__.py