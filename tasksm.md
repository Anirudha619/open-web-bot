Create db scema for below in db.md file:


- add chatbot:

input (auth, )
auth --get--> company
add chatbot (system prompt, logo, name, doc)
ingest doc

- query: (chatbot id, prompt)

validate and query vector db


add auth
add db
add route : add_chatbot, query 


so compnay will login or signin.
then dont have to fcreate org or somthign they can just create chatbot

we might or might not need to store company email here (i think supabase has it not sure lets use standard pratice)
company : 
id, 

chatbot:
id, name, system prompt, logo, name, doc_id of object storage

coversattion:
id, chatbot_id, user_ip, role, message, create_at


