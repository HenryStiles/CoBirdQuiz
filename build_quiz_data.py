import os

# Set the path to your image directory
image_directory = './assets/images'

# Filter out the list of images (only considering jpg, png, gif, and jpeg for this example).  Store complete path.
image_files = [os.path.join(image_directory, f) for f in os.listdir(image_directory) if f.endswith(('.jpg', '.png', '.gif', '.jpeg'))]

# for each image file strip the extension and directory leaving just the base file name.
image_names = [os.path.splitext(os.path.basename(f))[0] for f in image_files]

with open('BirdQuizData.js', 'w') as js_file:
    indent1 = " " * 4
    indent2 = " " * 8
    js_file.write("const birdQuizData =\n")
    js_file.write("[\n")
    for f, i in zip(image_files, image_names):
        js_file.write(indent1 + "{\n")
        js_file.write(indent2)
        js_file.write(f"image:\"{f}\",\n")
        js_file.write(indent2)
        js_file.write(f"answer:\"{i}\",\n")
        js_file.write(indent1 + "},\n")
    js_file.write("];\n")

# write the file to screen
with open('BirdQuizData.js', 'r') as js_file:
    print(js_file.read())