from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO

def crop_to_square(image_file):
    # Open the image using Pillow
    image = Image.open(image_file)
    
    # Get the current width and height of the image
    width, height = image.size

    # Calculate the size of the square
    if width > height:
        # Crop the sides if the image is wider than it is tall
        left = (width - height) / 2
        top = 0
        right = left + height
        bottom = height
    else:
        # Crop the top and bottom if the image is taller than it is wide
        top = (height - width) / 2
        left = 0
        right = width
        bottom = top + width
    
    # Crop the image to a square
    image = image.crop((left, top, right, bottom))
    
    # Save the cropped image to a BytesIO object (memory buffer)
    img_io = BytesIO()
    image.save(img_io, format='JPEG')  # Save in JPEG format
    img_io.seek(0)

    # Convert the in-memory image into an InMemoryUploadedFile to save it to the model
    image_name = image_file.name  # Keep the original image name
    image_file = InMemoryUploadedFile(img_io, None, image_name, 'image/jpeg', img_io.tell(), None)
    
    return image_file