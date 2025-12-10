import sys
import json
from textblob import TextBlob

# 1. Receive text from Node.js (passed as the first argument)
# sys.argv[0] is the script name, sys.argv[1] is the data
try:
    input_text = sys.argv[1]
except IndexError:
    # Fallback if no text is provided
    input_text = ""

# 2. Analyze the text
blob = TextBlob(input_text)
polarity = blob.sentiment.polarity  # Score between -1.0 and 1.0

# 3. Determine the "Mood" Label
if polarity > 0.5:
    mood = "Excited/Happy 🤩"
elif polarity > 0:
    mood = "Positive 🙂"
elif polarity == 0:
    mood = "Neutral 😐"
elif polarity > -0.5:
    mood = "Negative 😕"
else:
    mood = "Angry/Sad 😡"

# 4. Prepare the result dictionary
result = {
    "mood": mood,
    "score": round(polarity, 2),
    "keywords": list(blob.noun_phrases) # Extracts key nouns
}

# 5. Print JSON to stdout (This is how Node.js reads the data)
print(json.dumps(result))