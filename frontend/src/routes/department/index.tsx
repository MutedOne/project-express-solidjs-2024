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
  dept:string,
  id:number,
  head:any[]
  team:any[]
}
const initidquery ={
  dept:"",
  id:0,
  head:[],
  team:[]
}

type gteam =[{
  depthead:number,
  deptmemberid:string
}]

const initgteam ={
  depthead:0,
  deptmemberid:'[]'
}
export default function Class() {

  const [searchParams] = useSearchParams();
  const [pagech, setpagech] = createSignal(searchParams.page);
  const [arruserid, setarruserid] = createSignal<any>([]);
  const [idquery, setidquery] = createStore<idquery>(initidquery);
  const [team2, setteam2] = createStore<gteam>([initgteam]);
  const pagesearch =()=>{
    let str=''
    str+= '?page='+(searchParams.page==undefined?1:parseInt(searchParams.page))
    if(searchParams.ttype!=undefined||searchParams.dept!=undefined){
  
      str+='&dept='+ (searchParams.dept!=undefined? searchParams.dept : '')
    }
    return str
  }
  const [classi, {  refetch:getDepartmentFetch }] = createResource(pagech,getDepartment);
  const [row,{refetch:getDepartmentTotalFetch} ] = createResource(pagech,getDepartmentTotal);
  async function getDepartmentTotal() {

    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/department/departmenttotal`+pagesearch(),{
        method: 'GET',

        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
    );
    return await response.json();

  }
  async function getDepartment() {
    
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/department/department`+pagesearch(),{
        method: 'GET',

        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
    );
    return await response.json();


  }
  const [alerton, setAlerton] = createSignal(false);
  const [showt, setshowt] = createSignal(false);
  createEffect(() => {
    setpagech(searchParams.page)
    
  });
  const socket = new WebSocket("ws://localhost:4000"+pagesearch());
  socket.onmessage = (event) => {
    let res = JSON.parse(JSON.parse(event.data).data.map((charCode:any) => String.fromCharCode(charCode)).join(''));
    
    if(res.deptadd != undefined  ){
      
      
      // setcpto('1')
      getDepartmentFetch()
      getDepartmentTotalFetch()
      
      
    }

    if(res.newdept != undefined){
      if(idquery.id==res.newdept){
        console.log(res.newdept)
        console.log("inside")
    
        alluserid(res.newdept)
      }
    }
    if(res.deptid != undefined){
      let myModal = document.getElementById("tableviewid")
     
   
      if(idquery.id==res.deptid){
        tableViewIdquery(res.deptid)
        allteam(res.deptid)
        alluserid(res.deptid)
        console.log(" open")  
        myModal?.addEventListener("click",()=>{
          
          
          // setcpto('1')
          getDepartmentFetch()
          getDepartmentTotalFetch()
          
          
          })
      }else{
        console.log(myModal)
        if( showt()==false){
          console.log("not open")  
          
          
          // setcpto('1')
          getDepartmentFetch()
          getDepartmentTotalFetch()
          
          
        }else{
          console.log(" open but diff id")  
          myModal?.addEventListener("click",()=>{
            
            
            // setcpto('1')
            getDepartmentFetch()
            getDepartmentTotalFetch()
            
            
            })
        }
      }

    }
  };


socket.addEventListener("close", event => {console.log(event)});

// error handler
socket.addEventListener("error", event => {console.log(event)});
   
  const alluserid = async (id:number) =>{
    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/alluserid/${id}`,{
      headers:{
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      }
    })
    setarruserid(await res.json())
  }
  const allteam= async (id:number) =>{
    
    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/allteam/${id}`,{
      headers:{
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      }
    })
    setteam2(await res.json())
  }
  const tableview =(value:any)=>{
    return <>
        <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Department</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
            <Suspense fallback={<p>Loading...</p>}>
              <For each={value}>
                {(c) => 
                  <tr>
                    <th scope="row">{c.rn}</th>
                    <td>{c.dept}</td>
                    <td>
                      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tableviewid" onClick={()=>{setAlerton(false);tableViewIdquery(c.id),alluserid(c.id),allteam(c.id)}}>
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
      `${import.meta.env.VITE_API_ENDPOINT}/getIdDept/${id}`,{
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
      }).then(async (data)=>{
        let res = (await data.json())[0]
        setidquery(res)
      }) 
  }
  const addmember = (index:number) =>{

    setteam2(produce((data)=>{
      let arrtest=[];
          arrtest = (JSON.parse(data[index].deptmemberid))
         arrtest.push(0)
       data[index].deptmemberid = JSON.stringify(arrtest)
    })) 
   
  }
  const changemember = (index:number,value:any,position:number) =>{
    
    const res =arruserid().find((e:any)=>e.name == value)?.id||0
    setteam2(produce((data)=>{
      let arrtest=[];
          arrtest = (JSON.parse(data[index].deptmemberid))
         arrtest[position] = res
       data[index].deptmemberid = JSON.stringify(arrtest)
    })) 
  }
  const addHead = () =>{
 
    setteam2(produce((data)=>{
      data.push({
        depthead: 0,
        deptmemberid:'[]',
      })
    })) 
  }
 
  const tableViewId=() =>{
    return <>
    <Portal>
      <div class="modal fade" id="tableviewid" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Departments</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <form id="updatedept" onSubmit={update}  class="need-validation" noValidate>
                  <Show when={alerton()}>
                      <div class="alert alert-warning" role="alert">
                            Department is already exist
                      </div>
                  </Show>
                  <div class="mb-3 row">
                    <label for="edept" class="col-sm-2 col-form-label">Department</label>
                    <div class="col-sm-10">
                      <input type="text" id="edept" class="form-control"  value={idquery.dept} onChange={(e)=>{setidquery(produce((data)=>{ data.dept=e.target.value}))}}/>
                    </div>
                  </div>
                  <For each={team2}>{(val1, i1) =>
                      <>
                      <div class="mb-3 row">
                      <label    class="form-label">Team Head</label>
                      <input class="form-control" list="addteamHead" placeholder="Type to search..." autocomplete="off" value={val1.depthead ==0?'':arruserid().find((e:any)=>e.id == val1.depthead)?.name} onChange={(c)=>setteam2(produce((data)=>{ data[i1()].depthead=arruserid().find((e:any)=>e.name == c.target.value)?.id||0 }))} />
                            <datalist id="addteamHead" >
                            <Suspense fallback={<p>loading</p>}>
                                  <For each={arruserid()}>{(c:{name:string}) =>
                                    <option value={c.name}/>
                                  }</For>
                              </Suspense>
                            </datalist>
                            <label class="form-label">Team Member</label>
                            <For each={JSON.parse(team2[i1()]?.deptmemberid)}>{(val2,i2) =>
                                  <>
                                  <input class="form-control" list={`${i1()}addteammember${i2()}`} placeholder="Type to search..." autocomplete="off"  value={val2==0?'':arruserid().find((e:any)=>e.id == val2)?.name} onChange={(e)=>{changemember(i1(),e.target.value,i2())}}/>
                                  <datalist id={`${i1()}addteammember${i2()}`}>
                                    <Suspense fallback={<p>loading</p>}>
                                          <For each={arruserid()}>{(c:{name:string}) =>
                                            <option value={c.name}/>
                                          }</For>
                                    </Suspense>
                                  </datalist>
                                  </>
                            }</For>
                              <button type="button" class="btn btn-warning" onClick={()=>addmember(i1())}>Add member</button>  
                      </div>
                      </>
                    }</For>
                  <Show when={arruserid().length>0}>
                  <button type="button" class="btn btn-warning" onClick={()=>{addHead()}}>Add team</button>
                  </Show>
                
                  
              </form>
            </div>
            <div class="modal-footer">
          
            <button type="submit" form="updatedept" class="btn btn-primary" >Save</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      </Portal>
    </>
  }
 
  const update =(event:any)=>{
    event?.preventDefault()
    const form= event.target
   
    if(idquery.dept=='' ){
      form[0].classList.add('is-invalid')
      form[0].classList.remove('is-valid')
      setshowt(true)
    }else{
      form[0].classList.remove('is-invalid')
      form[0].classList.add('is-valid')
    }
   
     if(team2.length>0){
      let count = 0;
      let arr=[]
    
      team2.forEach((data)=>{
       
        if(data.depthead==0 ){
          form[count+=1].classList.add('is-invalid')
          form[count+=1].classList.remove('is-valid')
          setshowt(true)
        }else{
          form[count+=1].classList.remove('is-invalid')
          form[count+=1].classList.add('is-valid')
        }
      
      
        arr =JSON.parse(data.deptmemberid)
        console.log(arr)
        arr.forEach((data2:number)=>{

          console.log(data2)
          console.log(count)
          if(data2==0){
            form[count].classList.add('is-invalid')
            form[count].classList.remove('is-valid')
            setshowt(true)
      
          }else{
            form[count].classList.remove('is-invalid')
            form[count].classList.add('is-valid')
          }
          count++
         
        })
      })
     }
     if(showt()==false){
      fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/updateDept`,{
          method: 'POST',
          body: JSON.stringify({
            dept:idquery.dept,
            id:idquery.id,
            team:team2
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
        
             
             
            // setcpto('1')
            getDepartmentFetch()
            getDepartmentTotalFetch()
            
            
            socket.send(JSON.stringify({deptid: idquery.id})); 
          }
         
        })
     }
   
  }
  const tableviewrows =(total:any,pagesearch:any)=>{
    return <>
        <Paginate row={total} search={pagesearch} ></Paginate>
    </>
  }
  const create =(idquery:idquery)=>{
    event?.preventDefault()
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/createDept`,{
        method: 'POST',
        body: JSON.stringify({
          dept:idquery.dept
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
          var myModal = document.getElementById("create");
  
          if (myModal) {
              myModal.classList.remove("show");
              myModal.style.display = "none";
          }
          var modalBackdrop = document.querySelector(".modal-backdrop");
          if (modalBackdrop) {
              modalBackdrop.remove();
          }
          getDepartmentFetch()
          getDepartmentTotalFetch()
          
          
          socket.send(JSON.stringify({deptadd: "update"})); 
        }
        
      })
  }
  const tablecreate =()=>{
    return <>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#create">
          Create
        </button>

        <Portal>
            <div class="modal fade" id="create" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Add new user</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>{setAlerton(false)}}></button>
                  </div>
                  <div class="modal-body">
                  <form>
                  <Show when={alerton()}>
                      <div class="alert alert-warning" role="alert">
                            Department is already exist
                      </div>
                  </Show>
                  <div class="mb-3 row">
                    <label for="adept" class="col-sm-2 col-form-label">Department</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control"  value={idquery.dept} onChange={(e)=>{setidquery(produce((data)=>{ data.dept=e.target.value}))}}/>
                    </div>
                  </div>
                </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="createUserclose" onClick={()=>{setAlerton(false)}}>Close</button>
                    <button type="button" class="btn btn-primary" onClick={()=>create(idquery)}>Save</button>
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
                    <label for="sdept" class="col-sm-2 col-form-label">Department</label>
                    <div class="col-sm-10">
                      <input type="text" id="sdept" class="form-control"  value={idquery.dept} onChange={(e)=>{setidquery(produce((data)=>{ data.dept=e.target.value}))}}/>
                    </div>
                  </div>
                </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onClick={()=>{ location.href="Department?page=1"}}>Reset</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onClick={() => { location.href="Department?page=1&dept="+idquery.dept}} >Search</button>
                  </div>
                </div>
              </div>
            </div>
            </Portal>
    </>
  }

  const exportData = async () =>{
  const res = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/department/printDept`+pagesearch(), {
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
          var headerColumns = ['Department'];
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
    const headers = [ 'Department'];
    
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
      newarr.push("Department Type Master",'\n','Report of ',formattedDate,'\n')
      newarr.push('Department',',','\n')
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
        `ExportDepartments.csv`,
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
      <RightDesign csv={toCVS} pdf={toPDF} tableViewId={tableViewId} pageroute={"Department"} print={toPrint} tableview={tableview(classi())} tablerow={tableviewrows(row(),pagesearch())} tablecreate={tablecreate()} tablesearch={tablesearch}></RightDesign>
    )} 

    </Body>
   </CredentialUser>
      
   </>
      

  );
}
