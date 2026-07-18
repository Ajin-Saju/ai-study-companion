import time
import webbrowser
import os
from PIL import ImageGrab

def capture_page(url, output_path, delay=5):
    print(f"Opening: {url}")
    webbrowser.open(url)
    print(f"Waiting {delay} seconds for page to load and render...")
    time.sleep(delay)
    
    # Grab the primary screen
    screenshot = ImageGrab.grab()
    screenshot.save(output_path)
    print(f"Successfully saved screenshot to: {output_path}")
    print("-" * 50)

def main():
    report_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Screenshots will be saved in: {report_dir}")
    
    # Wait a bit before starting to let the user know
    print("Starting screenshot capture script...")
    print("Please keep your default web browser in focus and on the main screen.")
    time.sleep(3)
    
    # 1. Landing Page
    capture_page("http://localhost:3000", os.path.join(report_dir, "landing_page.png"))
    
    # 2. Dashboard Page
    capture_page("http://localhost:3000/dashboard", os.path.join(report_dir, "dashboard.png"))
    
    # 3. Study Page (Document 1)
    capture_page("http://localhost:3000/study/1", os.path.join(report_dir, "study_page.png"))
    
    print("All screenshots captured! Feel free to close the opened browser tabs.")

if __name__ == "__main__":
    main()
