from langchain_cerebras import ChatCerebras
from langchain_groq import ChatGroq
from .config import settings

chat = ChatCerebras(
    model="llama3.1-8b",
    api_key=settings.cerebras_api_key,
)

groq_chat = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=settings.groq_api_key,
)

def create_prompt(context: str, question: str) -> str:
    print("--- context  ---", context)
    return f"""You have to answer user question with given context.  
Here is users question: {question}.
{
    f"\nHere is context to answer user's question:\n{context}\n"
    if context and context.strip()
    else ""
}
Answer the user's question based on context given if context is empty still answer question based on your knowledge.
Dont write table / code / graph or anything in answer. just write answer in text format.
"""


async def call_llm(prompt: str) -> str:
    if settings.llm_provider == "cerebras":
        response = await chat.ainvoke(prompt)
    else:
        response = await groq_chat.ainvoke(prompt)
    return response.content
