import requests
import json

API_URL = "http://localhost:8000"

def get_auth_token():
    login_data = {
        "email": "admin@example.com",
        "password": "admin123"
    }
    
    response = requests.post(f"{API_URL}/auth/login", json=login_data)
    
    if response.status_code == 200:
        return response.json()["access_token"]
    
    register_data = {
        "email": "admin@example.com",
        "password": "admin123",
        "full_name": "Admin User",
        "role": "admin"
    }
    
    response = requests.post(f"{API_URL}/auth/register", json=register_data)
    if response.status_code == 200:
        response = requests.post(f"{API_URL}/auth/login", json=login_data)
        return response.json()["access_token"]
    
    raise Exception("Failed to get auth token")

def add_sample_internships(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    sample_internships = [
        {
            "title": "Software Engineering Intern",
            "company": "Google",
            "location": "Mountain View, CA",
            "stipend": "$8,000/month",
            "duration": "3 months",
            "apply_link": "https://careers.google.com/jobs"
        },
        {
            "title": "Frontend Developer Intern",
            "company": "Meta",
            "location": "Remote",
            "stipend": "$7,500/month",
            "duration": "4 months",
            "apply_link": "https://www.metacareers.com/jobs"
        },
        {
            "title": "Data Science Intern",
            "company": "Microsoft",
            "location": "Seattle, WA",
            "stipend": "$7,000/month",
            "duration": "6 months",
            "apply_link": "https://careers.microsoft.com"
        },
        {
            "title": "Mobile App Development Intern",
            "company": "Apple",
            "location": "Cupertino, CA",
            "stipend": "$8,500/month",
            "duration": "3 months",
            "apply_link": "https://jobs.apple.com"
        },
        {
            "title": "Backend Engineering Intern",
            "company": "Netflix",
            "location": "Los Gatos, CA",
            "stipend": "$7,800/month",
            "duration": "4 months",
            "apply_link": "https://jobs.netflix.com"
        },
        {
            "title": "DevOps Intern",
            "company": "Amazon",
            "location": "Remote",
            "stipend": "$6,500/month",
            "duration": "5 months",
            "apply_link": "https://amazon.jobs"
        },
        {
            "title": "UI/UX Design Intern",
            "company": "Figma",
            "location": "San Francisco, CA",
            "stipend": "$6,000/month",
            "duration": "3 months",
            "apply_link": "https://www.figma.com/careers"
        },
        {
            "title": "Machine Learning Intern",
            "company": "OpenAI",
            "location": "San Francisco, CA",
            "stipend": "$9,000/month",
            "duration": "6 months",
            "apply_link": "https://openai.com/careers"
        }
    ]
    
    for internship in sample_internships:
        response = requests.post(f"{API_URL}/internships", json=internship, headers=headers)
        if response.status_code == 200:
            print(f"Added internship: {internship['title']} at {internship['company']}")
        else:
            print(f"Failed to add internship: {internship['title']} - {response.text}")

def add_sample_hackathons(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    sample_hackathons = [
        {
            "name": "TechCrunch Disrupt Hackathon",
            "organizer": "TechCrunch",
            "theme": "AI & Machine Learning",
            "deadline": "2025-08-15T23:59:59",
            "register_link": "https://techcrunch.com/events/disrupt",
            "description": "Build the next big AI application in 48 hours"
        },
        {
            "name": "NASA Space Apps Challenge",
            "organizer": "NASA",
            "theme": "Space Technology",
            "deadline": "2025-09-01T23:59:59",
            "register_link": "https://www.spaceappschallenge.org",
            "description": "Solve challenges related to space exploration and Earth science"
        },
        {
            "name": "Global Game Jam",
            "organizer": "Global Game Jam Organization",
            "theme": "Game Development",
            "deadline": "2025-08-30T23:59:59",
            "register_link": "https://globalgamejam.org",
            "description": "Create innovative games in a weekend-long event"
        },
        {
            "name": "Climate Change Hackathon",
            "organizer": "Climate Tech Alliance",
            "theme": "Sustainability & Climate",
            "deadline": "2025-09-15T23:59:59",
            "register_link": "https://climatetech.org/hackathon",
            "description": "Develop solutions to combat climate change"
        }
    ]
    
    for hackathon in sample_hackathons:
        response = requests.post(f"{API_URL}/hackathons", json=hackathon, headers=headers)
        if response.status_code == 200:
            print(f"Added hackathon: {hackathon['name']}")
        else:
            print(f"Failed to add hackathon: {hackathon['name']} - {response.text}")

if __name__ == "__main__":
    try:
        print("Getting authentication token...")
        token = get_auth_token()
        print("Token obtained successfully!")
        
        print("\nAdding sample internships...")
        add_sample_internships(token)
        
        print("\nAdding sample hackathons...")
        add_sample_hackathons(token)
        
        print("\nSample data added successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
