import sys
import subprocess

def get_lat_lon_from_exiftool(image_path):
    cmd = ["exiftool", "-GPSLatitude", "-GPSLongitude", "-n", "-s3", image_path]
    result = subprocess.check_output(cmd).decode("utf-8").strip().split("\n")

    if len(result) < 2:
        raise ValueError("Could not extract GPS data from the image.")

    lat = float(result[0].strip())
    lon = float(result[1].strip())

    return lat, lon

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script_name.py path_to_image.jpg")
        sys.exit(1)

    image_path = sys.argv[1]
    lat, lon = get_lat_lon_from_exiftool(image_path)
    print(f"Latitude: {lat}, Longitude: {lon}")
