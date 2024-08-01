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
  code:string,
  name:string,
  contact:string,
  id:number
}
const initidquery ={
  code:"",
  name:"",
  contact:"",
  id:0
}
const defaultidquery ={
  code:"",
  name:"",
  contact:"",
  id:0
}

export default function Class() {

  const [searchParams] = useSearchParams();

  const [pagech, setpagech] = createSignal(searchParams.page);
  const [alerton, setAlerton] = createSignal(false);
  const [idquery, setidquery] = createStore<idquery>(initidquery);
  const pagesearch =()=>{
    let str=''
    str+= '?page='+(searchParams.page==undefined?1:parseInt(searchParams.page))
    if(searchParams.code!=undefined||searchParams.name!=undefined||searchParams.contact!=undefined){
      str+='&code='+ (searchParams.code!=undefined?searchParams.code : ''),
      str+='&name='+ (searchParams.name!=undefined?searchParams.name : '')
      str+='&contact='+ (searchParams.contact!=undefined?searchParams.contact : '')
    }
    return str
  }
  createEffect(() => {
    setpagech(searchParams.page)
  });
  async function getProject() {

    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/project/project`+pagesearch(),{
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
    );
    return await response.json();

  }
  async function getProjectTotal() {

    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/project/projecttotal`+pagesearch(),{
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
    );
    return await response.json();

  }
  const [classi, {  refetch:getProjectFetch }] = createResource(pagech,getProject);
  const [row,{refetch:getProjectTotalFetch} ] = createResource(pagech,getProjectTotal);
  const socket = new WebSocket("ws://localhost:4000"+pagesearch());
  const [showt, setshowt] = createSignal(false);
  socket.onmessage = (event) => {
    let res = JSON.parse(JSON.parse(event.data).data.map((charCode:any) => String.fromCharCode(charCode)).join(''));
    
    if(res.projadd != undefined || res.projsub != undefined   ){
      getProjectFetch()
      getProjectTotalFetch()
    }
   
    if(res.projid != undefined){
      let myModal = document.getElementById("tableviewid")
       console.log(myModal)
   
     
      if(idquery.id==res.projid){
        tableViewIdquery(res.projid)
        myModal?.addEventListener("click",()=>{
          
          
          // setcpto('1')
          getProjectFetch()
          getProjectTotalFetch()
          
          
          })
      }else{
        if(showt()==false){
          
          
          // setcpto('1')
          getProjectFetch()
          getProjectTotalFetch()
          
          
        }else{
          myModal?.addEventListener("click",()=>{
            
            
            // setcpto('1')
            getProjectFetch()
            getProjectTotalFetch()
            
            
            })
        }
     
      }

    }
  };


socket.addEventListener("close", event => {console.log(event)});

// error handler
socket.addEventListener("error", event => {console.log(event)});


   
  const tableview =(value:any)=>{
    return <>
        <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col">Contact</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
            <Suspense fallback={<p>Loading...</p>}>
              <For each={value}>
                {(c) => 
                  <tr>
                    <th scope="row">{c.rn}</th>
                    <td>{c.code}</td>
                    <td>{c.name}</td>
                    <td>{c.contact}</td>
                    <td>
                      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tableviewid" onClick={()=>{setshowt(true),tableViewIdquery(c.id)}}>
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
    setidquery(defaultidquery),
    setAlerton(false)
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/getIdProject/${id}`,{
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
      }).then(async (data)=>{
        let res = (await data.json())
        setidquery(res)
     
      })
  }
  
  const tableViewId=() =>{
    // console.log(classid().username) dont do something like this in asych signal. it will load first and delay the actual value.dont console.log
    
    return <>
    <Portal>
      <div class="modal fade" id="tableviewid" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Projects</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
            </div>
            <div class="modal-body">
            <form onSubmit={update} id="epro" class="need-validation" noValidate>
            <Show when={alerton()}>
                <div class="alert alert-warning" role="alert">
                      Code is already exist
                </div>
            </Show>
                  <div class="mb-3 row">
                    <label for="ecode" class="col-sm-2 col-form-label">Code</label>
                    <div class="col-sm-10">

                      <input type="text"  class="form-control" value={idquery.code} onChange={(e)=>{setidquery(produce((vald)=>{vald.code= e.target.value}))}} required/>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="ename" class="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control"  value={idquery.name} onChange={(e)=>{setidquery(produce((vald)=>{vald.name= e.target.value}))}} required/>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="econtact" class="col-sm-2 col-form-label">Contact</label>
                    <div class="col-sm-10">
                      <input type="text"  class="form-control"  value={idquery.contact} onChange={(e)=>{setidquery(produce((vald)=>{vald.contact= e.target.value}))}} required/>
                    </div>
                  </div>
                </form>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-danger" onClick={()=>deleteData(idquery.id)}>Delete</button>
            <button type="submit" class="btn btn-primary" form="epro">Save</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
            </div>
          </div>
        </div>
      </div>
      </Portal>
    </>
  }
  const deleteData =(id:number)=>{
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/deleteProject`,{
        method: 'POST',
        body: JSON.stringify({
          id:id
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }).then(()=>{
        var myModal = document.getElementById("tableviewid");
        if (myModal) {
            myModal.classList.remove("show");
            myModal.style.display = "none";
        }
        var modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
       
       
       // setcpto('1')
       getProjectFetch()
       getProjectTotalFetch()
       
       
       socket.send(JSON.stringify({projsub: "update"})); 
      })
  }
  const update =(event:any)=>{
    event?.preventDefault()
    let form = event.target
    if(idquery.code=='' ){
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
   
    if(idquery.contact==''){

      form[2].classList.add('is-invalid')
      form[2].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
      form[2].classList.remove('is-invalid')
      form[2].classList.add('is-valid')
    }
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/updateProject`,{
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
          return
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
      
          
          
          // setcpto('1')
          getProjectFetch()
          getProjectTotalFetch()
          
          
          socket.send(JSON.stringify({projid: idquery.id})); 
        }
      
      })
  }
  const tableviewrows =(total:any,pagesearch:any)=>{
    return <>
        <Paginate row={total} search={pagesearch} ></Paginate>
    </>
  }
  const create =(event:any)=>{
    event?.preventDefault()
    const form= event.target
    console.log(alerton())
    if(idquery.code=='' ){
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
   
    if(idquery.contact==''){

      form[2].classList.add('is-invalid')
      form[2].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
      form[2].classList.remove('is-invalid')
      form[2].classList.add('is-valid')
    }
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/createProject`,{
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
          form[0].classList.add('is-invalid')
          form[0].classList.remove('is-valid')
          return
        }else{
          var myModal = document.getElementById("create");
  
          if (myModal) {
              myModal.classList.remove("show");
              myModal.style.display = "none";
          }
          var modalBackdrop = document.querySelector(".modal-backdrop");
          if (modalBackdrop) {
              modalBackdrop.remove();
          }
      
          
          
          // setcpto('1')
          getProjectFetch()
          getProjectTotalFetch()
          
          
          socket.send(JSON.stringify({projadd: "update"})); 
        }
       
      })
  }
  const tablecreate =()=>{
    return <>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#create" onClick={()=>{setidquery(defaultidquery),setAlerton(false)}}>
          Create
        </button>

        <Portal>
            <div class="modal fade" id="create" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Add new project</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                  </div>
                  <div class="modal-body">
                  <form onSubmit={create} id="apro" noValidate class="need-validation">
                  <Show when={alerton()}>
                      <div class="alert alert-warning" role="alert">
                            Code is already exist
                      </div>
                  </Show>
                  <div class="mb-3 row">
                    <label  class="col-sm-2 col-form-label">Code</label>
                    <div class="col-sm-10">

                      <input type="text" class="form-control" value={idquery.code} onChange={(e)=>{setidquery(produce((vald)=>{vald.code= e.target.value}))}} required/>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="ename" class="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                      <input type="text"  class="form-control"  value={idquery.name} onChange={(e)=>{setidquery(produce((vald)=>{vald.name= e.target.value}))}} required/>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="econtact" class="col-sm-2 col-form-label">Contact</label>
                    <div class="col-sm-10">
                      <input type="text"   class="form-control"  value={idquery.contact} onChange={(e)=>{setidquery(produce((vald)=>{vald.contact= e.target.value}))}} required/>
                    </div>
                  </div>
                </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="createUserclose" >Close</button>
                    <button type="submit" class="btn btn-primary" form="apro">Save</button>
                  </div>
                </div>
              </div>
            </div>
            </Portal>
    </>
  }
  const tablesearch =()=>{
    return <>
             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#search">
              Search
            </button>

          <Portal>
            <div class="modal fade" id="search" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Search</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                  <form>
                    <div class="mb-3 row">
                      <label for="ecode" class="col-sm-2 col-form-label">Code</label>
                      <div class="col-sm-10">

                        <input type="text"  class="form-control" value={idquery.code} onChange={(e)=>{setidquery(produce((vald)=>{vald.code= e.target.value}))}} required/>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label for="ename" class="col-sm-2 col-form-label">Name</label>
                      <div class="col-sm-10">
                        <input type="text"  class="form-control"  value={idquery.name} onChange={(e)=>{setidquery(produce((vald)=>{vald.name= e.target.value}))}} required/>
                      </div>
                    </div>
                    <div class="mb-3 row">
                      <label for="econtact" class="col-sm-2 col-form-label">Contact</label>
                      <div class="col-sm-10">
                        <input type="text"   class="form-control"  value={idquery.contact} onChange={(e)=>{setidquery(produce((vald)=>{vald.contact= e.target.value}))}} required/>
                      </div>
                    </div>
                  </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onClick={()=>{ location.href="project?page=1"}}>Reset</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onClick={() => { location.href="project?page=1&code="+idquery.code+'&name='+idquery.name+'&contact='+idquery.contact}} >Search</button>
                  </div>
                </div>
              </div>
            </div>
            </Portal>
    </>
  }

  const exportData = async () =>{
  const res = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/project/printProject`+pagesearch(), {
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
          var headerColumns = ['Code', 'Name', 'Contact'];
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
    const headers = ['Code', 'Name', 'Contact'];
    
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
      newarr.push("Project Type Master",'\n','Report of ',formattedDate,'\n')
      newarr.push('Code',',','Name',',','Contact',',','\n')
      res.forEach((e:any)=> {
        newarr.push(e.join(', '),'\n')
        // ttype to be executed for each element
      });
      const url = window.URL.createObjectURL(
        new Blob(newarr),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `ExportProjects.csv`,
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
      <RightDesign csv={toCVS} pdf={toPDF} tableViewId={tableViewId} pageroute={"Project Type Master"} print={toPrint} tableview={tableview(classi())} tablerow={tableviewrows(row(),pagesearch())} tablecreate={tablecreate()} tablesearch={tablesearch}></RightDesign>
    )} 

    </Body>
   </CredentialUser>
      
   </>
      

  );
}
