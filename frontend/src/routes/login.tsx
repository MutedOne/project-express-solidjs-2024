
import {  Show, createSignal } from "solid-js";

import "../components/css/login.css"
import md5 from 'md5'
import { useNavigate } from "@solidjs/router";
import { createStore, produce } from "solid-js/store";
  type idquery ={
    username:string,
    password:string,
  }
  const initidquery ={
    username:"",
    password:"",
  }
export default function Login(){
    const [idquery,setidquery] = createStore<idquery>(initidquery);
    const [alert,setalert] = createSignal('')
    const navigate = useNavigate();

    const Checkdetails = (event:Event) =>{   
        
        event.preventDefault()
        fetch(
            `${import.meta.env.VITE_API_ENDPOINT}/login`,{
              method: 'POST',
              body: JSON.stringify({
                password: md5(idquery.password),
                username: idquery.username
              }),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            }
          ).then( async (data) => { 

            const res=await data.json()
                if(res.cstatus == 'No Account'){
                    // propmpt something
                    // return navigate("/login")
                    setalert('noaccount')
                }else if(res.cstatus == 'Account is not active'){
                    setalert('notactive')
                    // return navigate("/login")
                }else if(res.cstatus == 'passdif'){
                    setalert('passdif')
                    // return navigate("/login")
                }else{
                    sessionStorage.setItem("sessionId", res.token);
                    
                    return navigate("/tracker")
                }
               
            }
          )
        
    }  

 
    
    return (
        <>
        <div class=" m-0 d-none d-md-block "  style={{width:"100vw"}} >
            <div class="row p-0 m-0">
            <div class="col-6 bg-info overflow-hidden p-0 vh-100" style={{
                "background-image":`url("/task-management.jpg")`,
                "background-position":`center`,
                "background-repeat":`no-repeat`,
                "background-size":`cover`,
                "background-color":`rgba(0,0,0,5)`
            }} >
              
            
              </div>
              <div class="col-6 p-0">
            
            <div class="d-flex justify-content-center align-items-center vh-100 flex-column bg-light" >
            <div class="text-center mb-4">
                <img src="/Bootstrap_logo.png" class="rounded" alt="..." style={{width:"120px"}}/>
            </div>
                <form class="forml" id="loginus" onSubmit={Checkdetails}>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Username</label>
                        <input type="text" class="form-control" id="exampleInputEmail1" required aria-describedby="emailHelp" onChange={(e)=>{setidquery(produce((data)=>{data.username=e.target.value}))}}/>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" required onChange={(e)=>{setidquery(produce((data)=>{data.password=e.target.value}))}}/>
                        <div id="emailHelp" class="form-text text-center">Account will be given by Admin only</div>
                    </div>
                    <Show when={alert()=='noaccount'}>
                        <div class="alert alert-danger" role="alert">
                           No account
                        </div>
                    </Show>
                    <Show when={alert()=='notactive'}>
                        <div class="alert alert-warning" role="alert">
                            This account is not active
                        </div>
                    </Show>
                    <Show when={alert()=='passdif'}>
                        <div class="alert alert-warning" role="alert">
                            Incorrect password
                        </div>
                    </Show>
                </form>
              
                <button type="submit" class="btn btn-primary px-5" form="loginus" >Login</button>
          
              
            </div>
            </div>
            </div>
          
           
        </div>
        <div class=" m-0 d-none d-sm-block d-md-none " >
            <div class=" bg-info overflow-hidden p-0" style={{
                "background-image":`url("/task-management.jpg")`,
                "background-position":`center`,
                "background-repeat":`no-repeat`,
                "background-size":`cover`,
                "background-color":`rgba(0,0,0,4)`
            
            }} >
              
               <div style={{width:"100%",height:"100%","background-color":`rgba(0, 0, 0, 0.5)`}} >
                <div class="d-flex justify-content-center align-items-center vh-100 flex-column " >
                  
                        <form class="forml bg-light p-4 rounded">
                            <div class="text-center mb-4">
                                <img src="/Bootstrap_logo.png" class="rounded imglogo" alt="..." />
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Username</label>
                                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e)=>{idquery.username=e.target.value}}/>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Password</label>
                                <input type="text" class="form-control" id="exampleInputPassword1" onChange={(e)=>{idquery.password=e.target.value}}/>
                                <div id="emailHelp" class="form-text text-center">Account will be given by Admin only</div>
                            </div>
                        
                            <button type="submit" class="btn btn-primary text-center " onClick={Checkdetails}>Login</button>
                        
                        </form>

                    </div>
               </div>
            </div>
        
        </div>


     
   

        </>
        

               
       
       
    )
}