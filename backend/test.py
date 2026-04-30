import requests
from pathlib import Path


API_URL = "http://localhost:8000"


def upload_file(company_id: str, file_path: str):
    """Upload a document to the chatbot system."""

    file_path = Path(file_path)

    with open(file_path, "rb") as f:
        files = {"file": (file_path.name, f)}

        response = requests.post(
            f"{API_URL}/upload/{company_id}",
            files=files
        )

    response.raise_for_status()

    return response.json()


def query_chat(company_id: str, message: str):
    """Ask a question to the chatbot."""

    payload = {
        "company_id": company_id,
        "message": message
    }

    response = requests.post(
        f"{API_URL}/chat",
        json=payload
    )

    response.raise_for_status()

    return response.json()["answer"]


if __name__ == "__main__":

    company_id = "company_4"

    # upload document
    # result = upload_file(company_id, "refund_policy.txt")
    # print(result)

    # ask question
    answer = query_chat(
        company_id,
        # "What is the refund policy?"
        "Tell me about llms and rag"
    )

    # print("Answer:", answer)
    for id, chunk in enumerate(answer):
        print(f"----CHUNK{id}----")
        print(chunk)
        print("----CHUNK ended----")