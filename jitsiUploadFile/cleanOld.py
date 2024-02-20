import os
import shutil
import datetime

def delete_old_files(folder_path, days_threshold):
    threshold_date = datetime.datetime.now() - datetime.timedelta(days=days_threshold)
    
    for root, dirs, files in os.walk(folder_path, topdown=False):
        if root == folder_path:  # Skip the specified folder
            continue
        
        for file_name in files:
            file_path = os.path.join(root, file_name)
            # Get the last modified timestamp of the file
            modified_time = datetime.datetime.fromtimestamp(os.path.getmtime(file_path))
            # Compare with the threshold date
            if modified_time < threshold_date:
                print(f"Deleting file: {file_path}")
                os.remove(file_path)
        
        # Check if the directory is empty after deleting files
        if not os.listdir(root):
            print(f"Deleting empty folder: {root}")
            os.rmdir(root)

# Define the folder path to clean
folder_to_clean = '/usr/share/jitsi-meet/uploads'
# Define the threshold for deletion (in days)
days_threshold = 7

# Call the function to delete old files and empty folders
delete_old_files(folder_to_clean, days_threshold)

