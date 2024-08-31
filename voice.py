import requests

def translate_text(text, source_language, target_language):
    api_url = "https://translation.googleapis.com/language/translate/v2"
    api_key = "YOUR_API_KEY"
    params = {
        "q": text,
        "source": source_language,
        "target": target_language,
        "key": api_key
    }
    response = requests.get(api_url, params=params)
    translation = response.json()["data"]["translations"][0]["translatedText"]
    return translation

# Example usage
text = "Hello, how are you?"
source_language = "en"
target_language = "es"
translated_text = translate_text(text, source_language, target_language)
print(translated_text)  # Output: Hola, ¿cómo estás?mkdir my_flask_app