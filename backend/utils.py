from itertools import chain
from pathlib import Path


def getfiles(location, suffixes):
    """
    Get all images in a directory with a specific file type.

    Args:
        location (str): The directory to search for images.
        filetype (str): The file type of the images to search for (e.g., 'jpg', 'png').

    Returns:
        list: A list of image paths.
        :param suffixes:
    """
    location = Path(location)
    if isinstance(location, str):
        suffixes = [suffixes]

    files = list(chain.from_iterable(location.glob(ext) for ext in suffixes))
    return files
