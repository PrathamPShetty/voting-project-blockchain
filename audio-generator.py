from gtts import gTTS
from pydub import AudioSegment

# Text to convert to speech
text = "Please vote for your respective candidates."

# Generate speech using gTTS (Google Text-to-Speech)
tts = gTTS(text, lang="en")

# Save as MP3 first
tts.save("vote.mp3")

# Convert MP3 to WAV
audio = AudioSegment.from_mp3("vote.mp3")
audio.export("login.wav", format="wav")

print("Audio file 'welcome.wav' has been generated successfully.")
