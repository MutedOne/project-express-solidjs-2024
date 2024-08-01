import { useSearchParams } from "@solidjs/router";
import { For, Show, Suspense, createEffect, createResource, createSignal } from "solid-js";
import RightDesign from "../../components/Rightdesign";
import Body from "../../components/body";
import Paginate from "../../components/paginate";
import { jsPDF } from "jspdf";
import 'jspdf-autotable' 

import "../../components/css/modal.css"
import "../../components/css/print.css"
import { createStore, produce } from "solid-js/store";
import { Portal } from "solid-js/web";
import CredentialUser from "../../components/credential";

type idquery ={
  username:string,
  name:string,
  password:string,
  deptid:number,
  dept:string,
  email:string,
  aa:number,
  ea:number,
  ma:number,
  ua:number,
  status:number,
  id:number
}
const initidquery ={
  username:"",
  name:"",
  password:"",

  deptid:0,
  dept:'',
  email:"",
  aa:0,
  ea:0,
  ma:0,
  ua:0,
  status:0,
  id:0
}

const defaultidquery ={
  username:"",
  name:"",
  password:"",

  deptid:0,
  dept:'',
  email:"",
  aa:0,
  ea:0,
  ma:0,
  ua:0,
  status:0,
  id:0
}
type arrdept = {
  id:number,
  dept:string,
}


export default function Users() {

  const [searchParams] = useSearchParams();

  const [arrdeptid, setarrdeptid] = createSignal<arrdept[]>([]);
  const [alerton, setAlerton] = createSignal(false);
  const [deptchange, setdeptchange] = createSignal(false);
  const [pagech, setpagech] = createSignal(searchParams.page);
  const [idquery, setidquery] = createStore<idquery>(initidquery);
  const pagesearch =()=>{
    let str=''
    str+= '?page='+(searchParams.page==undefined?1:parseInt(searchParams.page))
    console.log(str)
    if(searchParams.username!=undefined ||
      searchParams.name!=undefined ||
      searchParams.aa!=undefined ||
      searchParams.ea!=undefined ||
      searchParams.ma!=undefined ||
      searchParams.ua!=undefined ||searchParams.deptid!=undefined ||
      searchParams.status!=undefined){
        str+="&username="+searchParams.username+'&name='+searchParams.name+'&aa='+searchParams.aa+'&ea='+searchParams.ea+'&ma='+searchParams.ma+'&ua='+searchParams.ua+'&status='+searchParams.status+'&dept='+searchParams.deptid
    }
    return str
  }
  const [user, {  refetch:getUserFetch }] = createResource(pagech,getUser);
  const [row,{refetch:getUserTotalFetch} ] = createResource(pagech,getUserTotal);
  async function getUserTotal() {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/account/accounttotal${pagesearch()}`,{
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
    );
    return await response.json();
  }
  async function getUser() {
  
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/account/account${pagesearch()}`,{
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
           "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
    );
    return await response.json();

  }
  createEffect(() => {
    setpagech(searchParams.page)
  });
  const socket = new WebSocket("ws://localhost:4000"+pagesearch());
  // message is received
  socket.onmessage = (event) => {
    const res = JSON.parse(JSON.parse(event.data).data.map((charCode:any) => String.fromCharCode(charCode)).join(''));

     if(res.useradd != undefined  ){
       getUserFetch()
       getUserTotalFetch()
     }
    
     if(res.userid != undefined){
       if(idquery.id==res.userid){
         tableViewIdquery(res.userid)
       }else{
        getUserFetch()
       }
     }
   };
 
 // socket closed
 socket.addEventListener("close", event => {console.log(event)});
 
 // error handler
 socket.addEventListener("error", event => {console.log(event)});
 
  const tableview =(value:any)=>{
    return <>
        <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Name</th>
                <th scope="col">Department</th>
                <th scope="col">Add</th>
                <th scope="col">Edit</th>
                <th scope="col">Master</th>
                <th scope="col">User</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
            <Suspense fallback={<p>Loading...</p>}>
              <For each={value}>
                {(user) => 
                  <tr>
                    <th scope="row">{user.rn}</th>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>{user.dept}</td>
                    <td>{user.aa}</td>
                    <td>{user.ea}</td>
                    <td>{user.ma}</td>
                    <td>{user.ua}</td>
                    <td>{user.status}</td>
                    <td>
                      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tableviewid" onClick={()=>{tableViewIdquery(user.id),alldept(user.id.toString()),setidquery(defaultidquery),setAlerton(false),setdeptchange(false)}}>
                        View
                      </button>
                    </td>
                  </tr>
                }
              </For>
              </Suspense>
            </tbody>
          </table>
    </>
  }

  const tableViewIdquery =(id:number)=>{
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/getIdUser/${id}`,{
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
      }).then(async (data)=>{
        let res = (await data.json())[0]
        setidquery(res)
     
      })
      
  }
  
  const tableViewId=() =>{
    // console.log(userid().username) dont do something like this in asych signal. it will load first and delay the actual value.dont console.log
    
    return <>
    <Portal>
      <div class="modal fade" id="tableviewid" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit User</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
            </div>
            <div class="modal-body">
            <form id="euser" onSubmit={updateuser}  noValidate class="need-validation">
                  <Show when={alerton()}>
                      <div class="alert alert-warning" role="alert">
                            Username is already exist or account must not be part on a team
                      </div>
                  </Show>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Username</label>
                    <div class="col-sm-10">

                      <input type="text"  class="form-control" value={idquery.username} required onChange={(e)=>{setidquery(produce((vald)=>{vald.username= e.target.value}))}} readOnly/>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                      <input type="text"  class="form-control"  value={idquery.name} required onChange={(e)=>{setidquery(produce((vald)=>{vald.name= e.target.value}))}} />
                    </div>
                  </div>
                  {/* <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Password</label>
                    <div class="col-sm-10">
                      <input type="password"  class="form-control"  value={password()} onChange={(e)=>{setpassword(e.target.value)}}/>
                    </div>
                  </div> */}
                   <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Department</label>
                    <div class="col-sm-10">
                    <input class="form-control" list="accountdept"  placeholder="Type to search..." required autocomplete="off" value={idquery.dept} onChange={(e)=>{setidquery(produce((vald)=>{vald.deptid=arrdeptid().find((z:any) => z.dept == e.target.value)?.id||0; vald.dept=e.target.value}))}}  onKeyUp={(e:any)=>{setdeptchange(true);alldept(e.target.value)}}/>
                        <datalist id="accountdept">
                        <Suspense fallback={<p>loading</p>}>
                            <For each={arrdeptid()}>{(c:{dept:string}) =>
                              <option value={c.dept}/>
                            }</For>
                        </Suspense>
                      </datalist>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Email</label>
                    <div class="col-sm-10">
                      <input type="email"  class="form-control"  value={idquery.email} required onChange={(e)=>{setidquery(produce((vald)=>{vald.email= e.target.value}))}} />
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Add</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example"  value={idquery.aa} required onChange={(e)=>{setidquery(produce((vald)=>{vald.aa= parseInt(e.target.value)}))}} >
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Edit</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.ea} required onChange={(e)=>{setidquery(produce((vald)=>{vald.ea= parseInt(e.target.value)}))}}>
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Master</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.ma} required onChange={(e)=>{setidquery(produce((vald)=>{vald.ma= parseInt(e.target.value)}))}}>
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">User</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.ua} required onChange={(e)=>{setidquery(produce((vald)=>{vald.ua= parseInt(e.target.value)}))}}>
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Status</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.status} required onChange={(e)=>{setidquery(produce((vald)=>{vald.status= parseInt(e.target.value)}))}}>
                      <option selected value={0}>Inactive</option>
                      <option value="1">Active</option>
                    </select>
                    </div>
                  </div>
               
                </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>{setidquery(defaultidquery),setAlerton(false)}}>Close</button>
              <button type="submit" class="btn btn-primary" form="euser">Save</button>
            </div>
          </div>
        </div>
      </div>
      </Portal>
    </>
  }
  const updateuser =async (event:any)=>{
    event?.preventDefault()
  
    const form= event.target
    if(idquery.username==''){
      form[0].classList.add('is-invalid')
      form[0].classList.remove('is-valid')
      return
    }else{
      form[0].classList.remove('is-invalid')
      form[0].classList.add('is-valid')
    }

    if(idquery.name==''){
      form[1].classList.add('is-invalid')
      form[1].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
      form[1].classList.remove('is-invalid')
      form[1].classList.add('is-valid')
    }

    

  
    if(idquery.deptid==0  || idquery.dept==''){

      form[2].classList.add('is-invalid')
      form[2].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
     

      if( deptchange()==true){
        const res =await (await fetch(`${import.meta.env.VITE_API_ENDPOINT}/allteam/${idquery.deptid}`)).json()

        res.forEach((val:any) => {
          if(val.depthead == idquery.id){
            form[2].classList.add('is-invalid')
            form[2].classList.remove('is-valid')
            return
          }
         
          console.log(JSON.parse(val.deptmemberid))
          if(JSON.parse(val.deptmemberid).includes(idquery.id) == true){
            form[2].classList.add('is-invalid')
            form[2].classList.remove('is-valid')
            
            return
          }
        });
      
 
     
      }else{
        form[2].classList.remove('is-invalid')
        form[2].classList.add('is-valid')
      }
    }
    if(idquery.email==''  || idquery.email.search('@') == -1){
      form[3].classList.add('is-invalid')
      form[3].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
      form[3].classList.remove('is-invalid')
      form[3].classList.add('is-valid')
    }
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/updateUser`,{
        method: 'POST',
        body: JSON.stringify({
          idquery:idquery
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }).then(async (data)=>{
        let res = await data.json()

        if(res.status=='ER_DUP_ENTRY'){
          form[0].classList.add('is-invalid')
          form[0].classList.remove('is-valid')
          setAlerton(true)
        }else{
          var myModal = document.getElementById("tableviewid");
          if (myModal) {
              myModal.classList.remove("show");
              myModal.style.display = "none";
          }
          var modalBackdrop = document.querySelector(".modal-backdrop");
          if (modalBackdrop) {
              modalBackdrop.remove();
          }
          setAlerton(false)
          // setcpto('1')
          getUserFetch()
          getUserTotalFetch()
          
          
          socket.send(JSON.stringify({  userid: idquery.id})); 
          console.log(deptchange())
          if(deptchange()==true){
            console.log("newdept")
            socket.send(JSON.stringify({  newdept: idquery.deptid}));
          }
        }
 
      })
  }
  const tableviewrows =(total:any,pagesearch:any)=>{
    return <>
        <Paginate row={total} search={pagesearch} ></Paginate>
    </>
  }
  const alldept = async (dept:string) =>{
    
    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/alldept`,{
      method: 'POST',
      body: JSON.stringify({
        dept:dept
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      
      },
    })
    setarrdeptid(await res.json())
  }
  const createuser =(event:any)=>{
    
    event?.preventDefault()
    const form= event.target
    if(idquery.username==''){
      form[0].classList.add('is-invalid')
      form[0].classList.remove('is-valid')
      return
    }else{
      form[0].classList.remove('is-invalid')
      form[0].classList.add('is-valid')
    }

    if(idquery.name==''){
      form[1].classList.add('is-invalid')
      form[1].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
      form[1].classList.remove('is-invalid')
      form[1].classList.add('is-valid')
    }

    if(idquery.password==''){
      form[2].classList.add('is-invalid')
      form[2].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
      form[2].classList.remove('is-invalid')
      form[2].classList.add('is-valid')
    }
    if(idquery.deptid==0  && idquery.dept==''){
      console.log('deptasd')
      console.log(idquery.deptid)
      form[3].classList.add('is-invalid')
      form[3].classList.remove('is-valid')
      return
      // setalerton(true)
    }else{
      form[3].classList.remove('is-invalid')
      form[3].classList.add('is-valid')
    }
    if(idquery.email=='' || idquery.email.search('@') == -1){
      form[4].classList.add('is-invalid')
      form[4].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
      form[4].classList.remove('is-invalid')
      form[4].classList.add('is-valid')
    }
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/createUser`,{
        method: 'POST',
        body: JSON.stringify({
          idquery:idquery
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }).then(async (data)=>{
        let res = await data.json()

        if(res.status=='ER_DUP_ENTRY'){
          setAlerton(true)
        }else{
          var myModal = document.getElementById("createuser");
  
          if (myModal) {
              myModal.classList.remove("show");
              myModal.style.display = "none";
          }
          var modalBackdrop = document.querySelector(".modal-backdrop");
          if (modalBackdrop) {
              modalBackdrop.remove();
          }
      
           
           
          // setcpto('1')
          getUserFetch()
          getUserTotalFetch()
          
          
          setidquery(defaultidquery)
          socket.send(JSON.stringify({  useradd: "update" })); 
        }
       
      })
  }
  const tablecreate =()=>{
    return <>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createuser" onClick={()=>{alldept(''),setidquery(defaultidquery)}}>
          Create
        </button>

        <Portal>
            <div class="modal fade" id="createuser" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Add new user</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                  </div>
                  <div class="modal-body">
                  <form id="auser" onSubmit={createuser}  noValidate class="need-validation">
                  <Show when={alerton()}>
                      <div class="alert alert-warning" role="alert">
                            Username is already exist
                      </div>
                  </Show>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Username</label>
                    <div class="col-sm-10">

                      <input type="text"  class="form-control" value={idquery.username} required onChange={(e)=>{setidquery(produce((vald)=>{vald.username= e.target.value}))}} />
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                      <input type="text"  class="form-control"  value={idquery.name} required onChange={(e)=>{setidquery(produce((vald)=>{vald.name= e.target.value}))}} />
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Password</label>
                    <div class="col-sm-10">
                      <input type="password"  class="form-control"  value={idquery.password} required onChange={(e)=>{setidquery(produce((vald)=>{vald.password= e.target.value}))}}/>
                    </div>
                  </div>
                   <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Department</label>
                    <div class="col-sm-10">
                    <input class="form-control" list="accountdept"  placeholder="Type to search..." autocomplete="off" required value={idquery.dept} onChange={(e)=>{setidquery(produce((vald)=>{vald.deptid=arrdeptid().find((z:any) => z.dept == e.target.value)?.id||0;}))}}  onKeyUp={(e:any)=>{alldept(e.target.value)}}/>
                        <datalist id="accountdept">
                        <Suspense fallback={<p>loading</p>}>
                            <For each={arrdeptid()}>{(c:{dept:string}) =>
                              <option value={c.dept}/>
                            }</For>
                            </Suspense>
                      </datalist>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Email</label>
                    <div class="col-sm-10">
                      <input type="email"  class="form-control"  value={idquery.email} required onChange={(e)=>{setidquery(produce((vald)=>{vald.email= e.target.value}))}} />
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Add</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example"  value={idquery.aa}  required onChange={(e)=>{setidquery(produce((vald)=>{vald.aa= parseInt(e.target.value)}))}} >
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Edit</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.ea} required onChange={(e)=>{setidquery(produce((vald)=>{vald.ea= parseInt(e.target.value)}))}}>
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Master</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.ma} required onChange={(e)=>{setidquery(produce((vald)=>{vald.ma= parseInt(e.target.value)}))}}>
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">User</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.ua} required onChange={(e)=>{setidquery(produce((vald)=>{vald.ua= parseInt(e.target.value)}))}}>
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Status</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.status} required onChange={(e)=>{setidquery(produce((vald)=>{vald.status= parseInt(e.target.value)}))}}>
                      <option selected value={0}>Inactive</option>
                      <option value="1">Active</option>
                    </select>
                    </div>
                  </div>
               
                </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="createUserclose" >Close</button>
                    <button type="submit" class="btn btn-primary" form="auser">Save</button>
                  </div>
                </div>
              </div>
            </div>
            </Portal>
    </>
  }
  const tablesearch =()=>{
    return <>
             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#searchuser">
              Search
            </button>
            <Portal>
            <div class="modal fade" id="searchuser" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Search</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                  <form>
                  
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Username</label>
                    <div class="col-sm-10">

                      <input type="text"  class="form-control" value={idquery.username} onChange={(e)=>{setidquery(produce((vald)=>{vald.username= e.target.value}))}} />
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                      <input type="text"  class="form-control"  value={idquery.name} onChange={(e)=>{setidquery(produce((vald)=>{vald.name= e.target.value}))}} />
                    </div>
                  </div>
                  {/* <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Password</label>
                    <div class="col-sm-10">
                      <input type="password"  class="form-control"  value={idquery.password} onChange={(e)=>{setidquery(produce((vald)=>{vald.password= e.target.value}))}}/>
                    </div>
                  </div> */}
                   <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Department</label>
                    <div class="col-sm-10">
                    <input class="form-control" list="accountdept"  placeholder="Type to search..." autocomplete="off" value={idquery.dept} onChange={(e)=>{setidquery(produce((vald)=>{vald.deptid=arrdeptid().find((z:any) => z.dept == e.target.value)?.id||0;}))}}  onKeyUp={(e:any)=>{alldept(e.target.value)}}/>
                        <datalist id="accountdept">
                        <Suspense fallback={<p>loading</p>}>
                            <For each={arrdeptid()}>{(c:{dept:string}) =>
                              <option value={c.dept}/>
                            }</For>
                            </Suspense>
                      </datalist>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Add</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example"  value={idquery.aa} onChange={(e)=>{setidquery(produce((vald)=>{vald.aa= parseInt(e.target.value)}))}} >
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Edit</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.ea} onChange={(e)=>{setidquery(produce((vald)=>{vald.ea= parseInt(e.target.value)}))}}>
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Master</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.ma} onChange={(e)=>{setidquery(produce((vald)=>{vald.ma= parseInt(e.target.value)}))}}>
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">User</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.ua} onChange={(e)=>{setidquery(produce((vald)=>{vald.ua= parseInt(e.target.value)}))}}>
                      <option selected value={0}>No</option>
                      <option value="1">Yes</option>
                    </select>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Status</label>
                    <div class="col-sm-10">
                    <select class="form-select" aria-label="Default select example" value={idquery.status} onChange={(e)=>{setidquery(produce((vald)=>{vald.status= parseInt(e.target.value)}))}}>
                      <option selected value={0}>Inactive</option>
                      <option value="1">Active</option>
                    </select>
                    </div>
                  </div>
               
                </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onClick={()=>{ location.href="users?page=1"}}>Reset</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onClick={() => { location.href="users?page=1&username="+idquery.username+'&name='+idquery.name+'&aa='+idquery.aa+'&ea='+idquery.ea+'&ma='+idquery.ma+'&ua='+idquery.ua+'&status='+idquery.status+'&dept='+idquery.dept}} >Search</button>
                  </div>
                </div>
              </div>
            </div>
            </Portal>
    </>
  }
 
  const exportData = async () =>{
    const res = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/account/printUsers`+pagesearch(), {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
    )
    return await res.json()
  }

  const toPrint =async ()=>{
    let res = await exportData()

          var newDiv = document.createElement('div');
          newDiv.className = 'printme'; // Add the CSS class
          var table = document.createElement('table');
          table.className = 'table';
          var thead = document.createElement('thead');
          var tbody = document.createElement('tbody');
          var headerRow = document.createElement('tr');
          var headerColumns = ['Username', 'Name', 'Add', 'Edit', 'Master', 'User','Status'];
          headerColumns.forEach(function(columnText) {
            var headerCell = document.createElement('th');
            headerCell.textContent = columnText;
            headerRow.appendChild(headerCell);
          });
          thead.appendChild(headerRow);
          res.forEach(function(user:any) {
            var dataRow = document.createElement('tr');
          
            user.forEach(function(dataItem:any) {
              var dataCell = document.createElement('td');
              dataCell.textContent = dataItem;
              dataRow.appendChild(dataCell);
            });
            tbody.appendChild(dataRow);
          });

          table.appendChild(thead);
          table.appendChild(tbody);
          newDiv.appendChild(table);
          document.body.appendChild(newDiv);

          window.print()
     
  }
  const toPDF = async () => {
    let res = await exportData()
    // Create a new jsPDF instance
    const doc = new jsPDF();
    const headers = [ 'Username', 'Name', 'Add', 'Edit', 'Master', 'User', 'Status'];
    
    // Create the table using autoTable
    // @ts-ignore
    doc.autoTable({
      head: [headers],
      body: res,
      startY: 20, // Adjust the starting Y position as needed
      autoSize: true,
    });
    const tableWidth = 180; // Adjust the width as needed
    
    // Add the HTML table to the PDF

      doc.html('', {
        x: (doc.internal.pageSize.getWidth() - tableWidth) / 2, // Center the table horizontally
        // @ts-ignore
        y: doc.autoTable.previous.finalY + 10, // Position it below the previous autoTable
        width: tableWidth, // Set the table width
        callback: function (pdf) {
          pdf.save('output.pdf');
        },
      });
  };
  const toCVS = async () =>{
    let res = await exportData()
      
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear(); // Get the current year (4 digits)
      const currentMonth = currentDate.getMonth() + 1; // Get the current month (0-11, so add 1)
      const currentDay = currentDate.getDate(); // Get the current day of the month (1-31)
      const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
      let newarr = []
      newarr.push("Users",'\n','Report of ',formattedDate,'\n')
      newarr.push('Username',',','Name',',','Add',',','Edit',',','Master',',','User',',','Status',',','\n')
      res.forEach((e:any)=> {
        newarr.push(e.join(', '),'\n')
        // Code to be executed for each element
      });
      const url = window.URL.createObjectURL(
        new Blob(newarr),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `ExportUsers.csv`,
      );
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      link.remove();
   
   
  }


  return (
   <>

   <CredentialUser>
   <Body>

   {row.loading? <p>Loading...</p>:(
    <RightDesign csv={toCVS} pdf={toPDF} tableViewId={tableViewId} pageroute={"users"} print={toPrint} tableview={tableview(user())} tablerow={tableviewrows(row(),pagesearch())} tablecreate={tablecreate()} tablesearch={tablesearch}></RightDesign>
    )} 

    </Body>
   </CredentialUser>
      
   </>
      

  );
}
