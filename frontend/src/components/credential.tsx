import { useNavigate } from "@solidjs/router";
import { createContext, createEffect, createResource, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export async function userData() {
   let res= await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/currentLogin`,{
      method: 'Post',
      body: JSON.stringify({
        username: "kardo",
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      },
    }
  );
  return await res.json()
}
export const UserD = createContext();
export  function credentialHolder() {
   return useContext(UserD)
  }
export default function CredentialUser(props:any) {
  const navigate = useNavigate();
    const [userdetail, setuserdetail] = createStore<any>();
    const [udata] = createResource(userData);
    console.log(udata())
    const socket = new WebSocket("ws://localhost:4000");
    // message is received
    socket.onmessage = (event) => {
      let res = JSON.parse(JSON.parse(event.data).data.map((charCode:any) => String.fromCharCode(charCode)).join(''));

      if(res.userid != undefined){
        if(udata()?.id==res.userid){
          sessionStorage.removeItem("sessionId");
           alert("Credential has been updated by the administrator, try to login again")
          navigate("/login");
        }
      }
    };
 
 // socket closed
 socket.addEventListener("close", event => {console.log(event)});
 
 // error handler
 socket.addEventListener("error", event => {console.log(event)});
    createEffect(() => {
        if(udata()?.status=="JsonWebTokenError"){
          return location.href =   `${import.meta.env.VITE_API_ENDPOINT}/404`;
        }
         setuserdetail(udata())
      });

    return <UserD.Provider value={userdetail}>
               {props.children}
           </UserD.Provider>
}