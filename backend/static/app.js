const usersEl=document.getElementById("users");
const searchEl=document.getElementById("user-search");
const emptyEl=document.getElementById("empty");
const activeEl=document.getElementById("active-chat");
const nameEl=document.getElementById("chat-name");
const messagesEl=document.getElementById("messages");
const form=document.getElementById("message-form");
const input=document.getElementById("message-input");
let users=[], selected=null, socket=null;

async function loadUsers(){
  const r=await fetch("/api/users/");
  const data=await r.json();
  users=data.users; renderUsers();
}
function renderUsers(){
  const q=searchEl.value.toLowerCase();
  usersEl.innerHTML="";
  users.filter(u=>u.username.toLowerCase().includes(q)).forEach(u=>{
    const el=document.createElement("div");
    el.className="user"+(selected?.id===u.id?" active":"");
    el.textContent=u.username;
    el.onclick=()=>selectUser(u);
    usersEl.appendChild(el);
  });
}
async function selectUser(user){
  selected=user; renderUsers();
  emptyEl.classList.add("hidden"); activeEl.classList.remove("hidden");
  nameEl.textContent=user.username;
  messagesEl.innerHTML="";
  const r=await fetch(`/api/messages/${user.id}/`);
  const data=await r.json();
  data.messages.forEach(addMessage);
  messagesEl.scrollTop=messagesEl.scrollHeight;
  if(socket) socket.close();
  socket=new WebSocket(`${location.protocol==="https:"?"wss":"ws"}://${location.host}/ws/chat/${user.id}/`);
  socket.onmessage=e=>{addMessage(JSON.parse(e.data));messagesEl.scrollTop=messagesEl.scrollHeight};
}
function addMessage(m){
  const wrap=document.createElement("div");
  wrap.className="bubble "+(m.sender_id===CURRENT_USER_ID?"mine":"");
  const text=document.createElement("div"); text.textContent=m.message||m.content;
  const time=document.createElement("div"); time.className="time"; time.textContent=m.timestamp||"";
  wrap.append(text,time); messagesEl.appendChild(wrap);
}
form.addEventListener("submit",e=>{
  e.preventDefault();
  const message=input.value.trim();
  if(!message||!socket||socket.readyState!==WebSocket.OPEN)return;
  socket.send(JSON.stringify({message})); input.value=""; input.focus();
});
searchEl.addEventListener("input",renderUsers);
loadUsers();
