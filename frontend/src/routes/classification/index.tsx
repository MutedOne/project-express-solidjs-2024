import { useSearchParams } from "@solidjs/router";
import { For,  Show,  Suspense, createEffect, createResource, createSignal } from "solid-js";
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
  description:string,
  id:number
}
const initidquery ={
  code:"",
  description:"",
  id:0
}
const defaultidquery ={
  code:"",
  description:"",
  id:0
}

export default function Class() {
  const [alerton, setAlerton] = createSignal(false);
  const [idquery, setidquery] = createStore<idquery>(initidquery);
  const [searchParams] = useSearchParams();
  const [pagech, setpagech] = createSignal(searchParams.page);
  const pagesearch =()=>{
 
    let str=''
    str+= '?page='+(searchParams.page==undefined?1:parseInt(searchParams.page))
    if(searchParams.code!=undefined||searchParams.desc!=undefined){
     str+='&desc='+ (searchParams.desc!=undefined? searchParams.desc : ''),
     str+='&code='+ (searchParams.code!=undefined?searchParams.code : '')
   }
    return str
  }
  createEffect(()=>{
    setpagech(searchParams.page)
  })

  async function getClass() {

    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/class/class`+pagesearch(),{
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
      }
    );
    return await response.json();
}
  async function getClassTotal() {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/class/classtotal`+pagesearch(),{
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
      }
    );
    return await response.json();
  }
  const [classi, {  refetch:getClassFetch }] = createResource(pagech,getClass);
  const [row,{refetch:getClassTotalFetch} ] = createResource(pagech,getClassTotal);
  const [showt, setshowt] = createSignal(false);


  const socket = new WebSocket(`ws://localhost:4000`+pagesearch());
  socket.onmessage = (event) => {
    let res = JSON.parse(JSON.parse(event.data).data.map((charCode:any) => String.fromCharCode(charCode)).join(''));
    
    if(res.classadd != undefined || res.classsub != undefined){
      getClassFetch()
      getClassTotalFetch()
    }
   
    if(res.classid != undefined){
      let myModal = document.getElementById("tableviewid")
       console.log(myModal)
   
     
      if(idquery.id==res.classid){
        tableViewIdquery(res.classid)
        myModal?.addEventListener("click",()=>{
          getClassFetch()
          getClassTotalFetch()
          })
      }else{
        if(showt()==false){
          getClassFetch()
          getClassTotalFetch()
        }else{
          myModal?.addEventListener("click",()=>{
            getClassFetch()
            getClassTotalFetch()
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
                <th scope="col">Description</th>
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
                    <td>{c.description}</td>
                    <td>
                      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tableviewid" onClick={()=>{tableViewIdquery(c.id),setidquery(defaultidquery),setAlerton(false),setshowt(true)}}>
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
      `${import.meta.env.VITE_API_ENDPOINT}/getIdClass/${id}`,{
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
      }).then(async (data)=>{
        let res = (await data.json())[0]
        setidquery(res)
      })
  }
  
  const tableViewId=() =>{
    
    return <>
    <Portal>
      <div class="modal fade" id="tableviewid" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Classification</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div class="modal-body">
            <form id="clasupdate" onSubmit={update} class="need-validation" noValidate>
                    <Show when={alerton()}>
                      <div class="alert alert-warning" role="alert">
                        Code is already exist
                      </div>
                    </Show>
                  <div class="mb-3 row">
                    <label for="upcode" class="col-sm-2 col-form-label">Code</label>
                    <div class="col-sm-10">

                      <input type="text"  class="form-control" value={idquery.code} onChange={(e)=>{setidquery(produce((vald)=>{vald.code= e.target.value}))}}  required/>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="updesc" class="col-sm-2 col-form-label">Description</label>
                    <div class="col-sm-10">
                      <input type="text"  class="form-control"  value={idquery.description} onChange={(e)=>{setidquery(produce((vald)=>{vald.description= e.target.value}))}}  required/>
                    </div>
                  </div>
                </form>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-danger" onClick={()=>deleteData(idquery.id)}>Delete</button>
            <button type="submit" class="btn btn-primary" form="clasupdate">Save</button>
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
      `${import.meta.env.VITE_API_ENDPOINT}/deleteClass`,{
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
       
       getClassFetch()
       getClassTotalFetch()
       socket.send(JSON.stringify({classsub: "update"})); 
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

    if(idquery.description==''){
      form[1].classList.add('is-invalid')
      form[1].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
      form[1].classList.remove('is-invalid')
      form[1].classList.add('is-valid')
    }
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/updateClass`,{
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
          var myModal = document.getElementById("tableviewid");
          if (myModal) {
              myModal.classList.remove("show");
              myModal.style.display = "none";
          }
          var modalBackdrop = document.querySelector(".modal-backdrop");
          if (modalBackdrop) {
              modalBackdrop.remove();
          }
          getClassFetch()
          getClassTotalFetch()
          socket.send(JSON.stringify({classid: idquery.id})); 
        }
       
      })
  }
  const tableviewrows =(total:any,pagesearch:any)=>{
    return <>
        <Paginate row={total}  search={pagesearch} ></Paginate>
    </>
  }
  const create =(event:any)=>{
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

    if(idquery.description==''){
      form[1].classList.add('is-invalid')
      form[1].classList.remove('is-valid')
      // setalerton(true)
      return
    }else{
      form[1].classList.remove('is-invalid')
      form[1].classList.add('is-valid')
    }
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/createClass`,{
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
          getClassFetch()
          getClassTotalFetch()

          socket.send(JSON.stringify({classadd: "update"})); 
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
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Add new Classification</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                  </div>
                  <div class="modal-body">
                    <Show when={alerton()}>
                      <div class="alert alert-warning" role="alert">
                        Code is already exist
                      </div>
                    </Show>
                  <form id="clascreate" onSubmit={create} class="need-validation" noValidate>
                  
                  <div class="mb-3 row">
                    <label for="upcode" class="col-sm-2 col-form-label">Code</label>
                    <div class="col-sm-10">

                      <input type="text" class="form-control" value={idquery.code} onChange={(e)=>{setidquery(produce((vald)=>{vald.code= e.target.value}))}}  required/>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="updesc" class="col-sm-2 col-form-label">Description</label>
                    <div class="col-sm-10">
                      <input type="text"  class="form-control"  value={idquery.description} onChange={(e)=>{setidquery(produce((vald)=>{vald.description= e.target.value}))}}  required/>
                    </div>
                  </div>
                </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="createUserclose">Close</button>
                    <button type="submit" class="btn btn-primary" form="clascreate" >Create</button>
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
                    <label for="upcode" class="col-sm-2 col-form-label">Code</label>
                    <div class="col-sm-10">

                      <input type="text"  class="form-control" value={idquery.code} onChange={(e)=>{setidquery(produce((vald)=>{vald.code= e.target.value}))}}  required/>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <label for="updesc" class="col-sm-2 col-form-label">Description</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control"  value={idquery.description} onChange={(e)=>{setidquery(produce((vald)=>{vald.description= e.target.value}))}}  required/>
                    </div>
                  </div>
                </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onClick={()=>{ location.href="classification?page=1"}}>Reset</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>setidquery(defaultidquery)}>Close</button>
                    <button type="button" class="btn btn-primary" onClick={() => { location.href="classification?page=1&desc="+idquery.description+'&code='+idquery.code}} >Search</button>
                  </div>
                </div>
              </div>
            </div>
            </Portal>
    </>
  }

  const exportData = async () =>{
  const res = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/class/printClass${pagesearch()}`, {
        method: 'GET',
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
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
          var headerColumns = ['Code', 'Description'];
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
    const headers = [ 'Code', 'Description'];
    
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
      newarr.push("Classification",'\n','Report of ',formattedDate,'\n')
      newarr.push('Code',',','Description',',','\n')
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
      <RightDesign csv={toCVS} pdf={toPDF} tableViewId={tableViewId} pageroute={"classification code master"} print={toPrint} tableview={tableview(classi())} tablerow={tableviewrows(row(),pagesearch())} tablecreate={tablecreate()} tablesearch={tablesearch}></RightDesign>
    )} 

    </Body>
   </CredentialUser>
      
   </>
      

  );
}
