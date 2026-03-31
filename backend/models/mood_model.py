import random

def analyze_image(base64_image):
    # Mock model
    emotions = ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral']
    primary_emotion = random.choice(emotions)
    return {
        "primary_emotion": primary_emotion,
        "confidences": {e: round(random.uniform(0.1, 0.9), 2) for e in emotions}
    }
