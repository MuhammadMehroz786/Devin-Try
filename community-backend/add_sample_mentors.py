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

def add_sample_mentors(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    sample_mentors = [
        {
            "name": "Sarah Chen",
            "bio": "Senior Software Engineer at Google with 8+ years of experience in full-stack development. Passionate about mentoring junior developers and helping them navigate their career paths.",
            "expertise": "Software Engineering, Full-Stack Development, Career Growth",
            "profile_pic": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            "available_slots": "5"
        },
        {
            "name": "Marcus Johnson",
            "bio": "Data Science Lead at Netflix, specializing in machine learning and analytics. Former startup founder with experience in building data-driven products from scratch.",
            "expertise": "Data Science, Machine Learning, Analytics, Startups",
            "profile_pic": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            "available_slots": "3"
        },
        {
            "name": "Emily Rodriguez",
            "bio": "Product Manager at Airbnb with expertise in user experience and product strategy. Previously worked at early-stage startups and helped scale products from 0 to millions of users.",
            "expertise": "Product Management, UX Strategy, Growth, Startups",
            "profile_pic": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            "available_slots": "2"
        },
        {
            "name": "David Kim",
            "bio": "Senior UX Designer at Figma with 10+ years in design. Expert in design systems, user research, and creating intuitive digital experiences. Mentor to 50+ designers.",
            "expertise": "UX Design, Design Systems, User Research, Prototyping",
            "profile_pic": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            "available_slots": "4"
        },
        {
            "name": "Lisa Thompson",
            "bio": "Marketing Director at Stripe, specializing in growth marketing and brand strategy. Former consultant who helped 100+ companies scale their marketing efforts.",
            "expertise": "Growth Marketing, Brand Strategy, Digital Marketing, Analytics",
            "profile_pic": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
            "available_slots": "1"
        },
        {
            "name": "Alex Patel",
            "bio": "Serial entrepreneur and investor. Founded 3 successful startups, 2 exits. Currently partner at Sequoia Capital. Passionate about helping first-time founders.",
            "expertise": "Entrepreneurship, Venture Capital, Fundraising, Strategy",
            "profile_pic": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            "available_slots": "0"
        }
    ]
    
    for mentor in sample_mentors:
        response = requests.post(f"{API_URL}/mentors", json=mentor, headers=headers)
        if response.status_code == 200:
            print(f"Added mentor: {mentor['name']} - {mentor['expertise']}")
        else:
            print(f"Failed to add mentor: {mentor['name']} - {response.text}")

if __name__ == "__main__":
    try:
        print("Getting authentication token...")
        token = get_auth_token()
        print("Token obtained successfully!")
        
        print("\nAdding sample mentors...")
        add_sample_mentors(token)
        
        print("\nSample mentors added successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
