#!/usr/bin/env python3

# the exif package has bugs so we use exiftool directly.

import sys
import subprocess

def get_lat_lon_and_date_from_exiftool(image_path):
    cmd = ["exiftool", "-GPSLatitude", "-GPSLongitude", "-DateTimeOriginal", "-n", "-s3", image_path]
    result = subprocess.check_output(cmd).decode("utf-8").strip().split("\n")

    if len(result) < 3:
        raise ValueError("Could not extract all required data from the image.")

    lat = float(result[0].strip())
    lon = float(result[1].strip())
    creation_date = result[2].strip()

    return lat, lon, creation_date

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script_name.py path_to_image.jpg")
        sys.exit(1)

    image_path = sys.argv[1]
    lat, lon, creation_date = get_lat_lon_and_date_from_exiftool(image_path)
    print(f"Latitude: {lat}, Longitude: {lon}, Creation Date: {creation_date}")

import exif
import sys

def get_date_from_exif(image_path):
    """Extracts date from the image EXIF data."""
    with open(image_path, 'rb') as img_file:
        img_exif = exif.Image(img_file)
        if not img_exif.has_exif:
            raise ValueError("Image has no EXIF data.")

        date = img_exif.datetime_original

    return date

def get_decimal_from_dms(dms, ref):
    """Converts degrees, minutes, and seconds notation to decimal."""
    degrees, minutes, seconds = dms
    latlon = degrees + (minutes / 60.0) + (seconds / 3600.0)
    if ref in ['S', 'W']:
        latlon = -latlon
    return latlon

def get_lat_lon_from_exif(image_path):
    """Extracts latitude and longitude from the image EXIF data."""
    with open(image_path, 'rb') as img_file:
        img_exif = exif.Image(img_file)
        if not img_exif.has_exif:
            raise ValueError("Image has no EXIF data.")

        lat = get_decimal_from_dms(img_exif.gps_latitude, img_exif.gps_latitude_ref)
        lon = get_decimal_from_dms(img_exif.gps_longitude, img_exif.gps_longitude_ref)

    return lat, lon

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script_name.py path_to_image.jpg")
        sys.exit(1)

    image_path = sys.argv[1]
    lat, lon = get_lat_lon_from_exif(image_path)
    print(f"Latitude: {lat}, Longitude: {lon}")
    date = get_date_from_exif(image_path)
    print(f"Date: {date}")