import { useSearchParams } from "@solidjs/router";
import { For, Show, Suspense, createEffect, createResource, createSignal } from "solid-js";
import RightDesign from "../../components/Rightdesign";
import Body from "../../components/body";
import Paginate from "../../components/paginate";
import { jsPDF } from "jspdf";
import 'jspdf-autotable' 
import CredentialUser, { credentialHolder } from "../../components/credential";
import "../../components/css/modal.css"
import "../../components/css/print.css"
import { createStore, produce, reconcile } from "solid-js/store";
import { Portal } from "solid-js/web";



const currentDate = new Date();
const currentYear = currentDate.getFullYear(); // Get the current year (4 digits)
const currentMonth = currentDate.getMonth() + 1; // Get the current month (0-11, so add 1)
const currentDay = currentDate.getDate(); // Get the current day of the month (1-31)
const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;



type idquery ={
  proid:number,
  pproid:string,
  ticketno:string,
  date:string,
  envid:number,
   eenvid:string,
   ticketsearch:number,
   tticketsearch:string,
  eventid:number,
  eeventid:string,
  rp:string,
  module:string,
  app:string,
  classid:number,
  cclassid:string,
  issue:string,
  skipped:boolean,
  reoccur:boolean,
  rreoccur:string,
  note:string,
  status:string,
  devstat:string,
  devcharge:string,
  timeline:string,
  devact:string,
  devnotes:string,
  dateend:string,
  datecomp:string,
  qaname:string,
  devname:string,
  id:number,
  appseq: { 
    dept: string[];
    name: string[];
    ddept:string[],
    nname:string[] ,
    action:string[],
    note:string[],
    status:string[],
    date:string[],
    depthead:any[] ,
  }
}
const initidquery ={
  proid:0,
  pproid:"",
  ticketno:"",
  date: '',
  envid:0,
  eventid:0,
  ticketsearch:0,
  tticketsearch:'',
  eenvid:'',
  eeventid:'',
  rp:'',
  module:'',
  app:'',
  cclassid:'',
  classid:0,
  issue:'',
  skipped:false,
  reoccur:false,
  rreoccur:"",
  note:'',
  status:'',
  devstat:'',
  devcharge:'',
  timeline:'',
  devact:'',
  devnotes:'',
  dateend:'',
  datecomp:'',
  qaname:'',
  devname:'',
  id:0,
  appseq: {
    dept:[] as string[],
    name:[] as string[],
    ddept:[] as string[],
    nname:[] as string[],
    action:[] as string[],
    note:[] as string[],
    status:[] as string[],
    date:[] as string[],
    depthead:[] as any,
  }
  
}
const defaultidquery ={
  proid:0,
  pproid:"",
  ticketno:"",
  date:'',
  envid:0,
  eenvid:'',
  ticketsearch:0,
  tticketsearch:'',
  eventid:0,
  eeventid:'',
  rp:'',
  module:'',
  app:'',
  cclassid:'',
  classid:0,
  issue:'',
  skipped:false,
  reoccur:false,
  rreoccur:"",
  note:'',
  status:'',
  devstat:'',
  devcharge:'',
  timeline:'',
  devact:'',
  devnotes:'',
  dateend:'',
  datecomp:'',
  qaname:'',
  devname:'',
  id:0,
  appseq: {
    dept:[] as string[],
    name:[] as string[],
    ddept:[] as string[],
    nname:[] as string[],
    action:[] as string[],
    note:[] as string[],
    status:[] as string[],
    date:[] as string[],
    depthead:[] as any,
  }
  
}
type arr={
  code:string,
  id:number
}
type arr2={
  ttype:string,
  id:number
}
const arr=[{
  code:'',
  id:0
}]
const arr2=[{
  ttype:'',
  id:0
}]


export default function Ticket() {

  const [searchParams] = useSearchParams();
  const [pagech, setpagech] = createSignal(searchParams.page);
  const [classi, setsha] = createSignal();
  const [showocc, setshowocc] = createSignal(false);
  const URlparms =()=>{
   
    let str=''
    str+= '?page='+(searchParams.page==undefined?1:parseInt(searchParams.page))
    if(searchParams.ticketno!=undefined||searchParams.proid!=undefined||searchParams.date!=undefined
      ||searchParams.envId!=undefined||searchParams.eventId!=undefined||searchParams.rp!=undefined
      ||searchParams.module!=undefined||searchParams.app!=undefined||searchParams.classId!=undefined
      ||searchParams.issue!=undefined||searchParams.note!=undefined||searchParams.status!=undefined
      ||searchParams.devstat!=undefined||searchParams.devcharge!=undefined||searchParams.timeline!=undefined
      ||searchParams.devact!=undefined||searchParams.devnotes!=undefined){
  
      str+='&proid='+ (searchParams.proid!=undefined?searchParams.proid : ''),
      str+='&ticketno='+ (searchParams.ticketno!=undefined?searchParams.ticketno : '')
      str+='&date='+ (searchParams.date!=undefined?searchParams.date : '')
      str+='&envId='+ (searchParams.envId!=undefined?searchParams.envId : '')
      str+='&eventId='+ (searchParams.eventId!=undefined?searchParams.eventId : '')
      str+='&rp='+ (searchParams.rp!=undefined?searchParams.rp : '')
      str+='&module='+ (searchParams.module!=undefined?searchParams.module : '')
      str+='&app='+ (searchParams.app!=undefined?searchParams.app : '')
      str+='&classId='+ (searchParams.classId!=undefined?searchParams.classId : '')
      str+='&issue='+ (searchParams.issue!=undefined?searchParams.issue : '')
      str+='&note='+ (searchParams.note!=undefined?searchParams.note : '')
      str+='&status='+ (searchParams.status!=undefined?searchParams.status : '')
      str+='&devstat='+ (searchParams.devstat!=undefined?searchParams.devstat : '')
      str+='&devcharge='+ (searchParams.devcharge!=undefined?searchParams.devcharge : '')
      str+='&timeline='+ (searchParams.timeline!=undefined?searchParams.timeline : '')
      str+='&devact='+ (searchParams.devact!=undefined?searchParams.devact : '')
      str+='&devnotes='+ (searchParams.devnotes!=undefined?searchParams.devnotes : '')
    }
      return str
    }
  const [classidas, {  refetch:getTicketFetch }] = createResource(pagech,getTicket);
  const [row,{refetch:getTicketTotalFetch} ] = createResource(pagech,getTicketTotal);
  async function getTicketTotal() {


    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/ticket/tickettotal`+URlparms(),{
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
    );
    return await response.json();
  
  }
  
  async function getTicket() {
  
   
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/ticket/ticket`+URlparms(),{
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
    setsha(classidas)
  });
  const [showt, setshowt] = createSignal(false);

  const socket = new WebSocket("ws://localhost:4000"+URlparms());
 // message is received
 socket.onmessage = (event) => {
    let res = JSON.parse(JSON.parse(event.data).data.map((charCode:any) => String.fromCharCode(charCode)).join(''));
    let myModal = document.getElementById("tableviewid")
    if(res.action != undefined){
      
      
      // setcpto('1')
      getTicketFetch()
      getTicketTotalFetch()
      
      
    }
    if(res.updateid != undefined){
      if(idquery.id==res.updateid){
        tableViewIdquery(res.updateid)
        myModal?.addEventListener("click",()=>{
          
          
          // setcpto('1')
          getTicketFetch()
          getTicketTotalFetch()
          
          
        })
      }else{

        if(showt()==false){
          
          
          // setcpto('1')
          getTicketFetch()
          getTicketTotalFetch()
          
          
        }else{
          myModal?.addEventListener("click",()=>{
            
            
            // setcpto('1')
            getTicketFetch()
            getTicketTotalFetch()
            
            
          })
        }
  
      }
    }
  };

// socket closed
socket.addEventListener("close", event => {console.log(event)});

// error handler
socket.addEventListener("error", event => {console.log(event)});

  // Create a formatter with the specified options
  const formatter = new Intl.DateTimeFormat('en-US', {timeZone: 'Asia/Manila'});
  const [alerton, setalerton] = createSignal(false);
  const [needsave, setneedsave] = createSignal(false);
  const [arrproid, setarrproid] = createSignal<arr[]>(arr);
  const [arrenvid, setarrenvid] = createSignal<arr2[]>(arr2);
  const [arreventid, seteventid] = createSignal<arr2[]>(arr2);
  const [arrclassid, setclassid] = createSignal<arr[]>(arr);
  const [arruserid, setarruserid] = createSignal<any>([]);
  const [arrdeptid, setarrdeptid] = createSignal<any>([]);
  const [arrticketid, setarrticketid] = createSignal<any>([]);
  const [idquery, setidquery] = createStore<idquery>(initidquery);
  const allproid = async (code:string) =>{
    
    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/allproid`,{
      method: 'POST',
      body: JSON.stringify({
        code:code
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      },
    })
    setarrproid(await res.json())
  }
  const allenvid = async (ttype:string) =>{
  
    const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/allenvid`,{
      method: 'POST',
      body: JSON.stringify({
        ttype:ttype
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      },
    })
    setarrenvid(await res.json())
  }
  const alleventid = async (ttype:string) =>{
 
    const res =await fetch(`${import.meta.env.VITE_API_ENDPOINT}/alleventid`,{
      method: 'POST',
      body: JSON.stringify({
        ttype:ttype
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      },
    })
    seteventid(await res.json())
  }
  const allclassid = async (code:string) =>{
    const res =await fetch(`${import.meta.env.VITE_API_ENDPOINT}/allclassid`,{
      method: 'POST',
      body: JSON.stringify({
        code:code
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      },
    })
    setclassid(await res.json())
  }
  const allticketid = async (ticket:string) =>{
    const res =await fetch(`${import.meta.env.VITE_API_ENDPOINT}/allticketid`,{
      method: 'POST',
      body: JSON.stringify({
        ticketno:ticket
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      },
    })
    setarrticketid(await res.json())
  }
  const alldeptid = async (dept:string) =>{
 
    const res =await fetch(`${import.meta.env.VITE_API_ENDPOINT}/alldeptid`,{
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
  const alluserid = async (name:string,deptid:string) =>{
 
    const res =await fetch(`${import.meta.env.VITE_API_ENDPOINT}/alluseridticket`,{
      method: 'POST',
      body: JSON.stringify({
        name:name,
        deptid:parseInt(deptid)
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      },
    })
    setarruserid(await res.json())
  }
  const addappseq = ()=>{
  
    setidquery(
      produce((pdata) => {
        pdata.appseq.action.push('')
        pdata.appseq.note.push('')
        pdata.appseq.status.push('')
        pdata.appseq.nname.push('')
        pdata.appseq.ddept.push('')
        pdata.appseq.name.push('')
        pdata.appseq.dept.push('')
        pdata.appseq.depthead.push('')
      })
    )
console.log(idquery.appseq)

  }
  const tableview =(value:any)=>{
    return <>
        <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Project</th>
                <th scope="col">Ticket No.</th>
                <th scope="col">Date</th>
                <th scope="col">Issue</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
            <Suspense fallback={<p>Loading...</p>}>
              <For each={value}>
                {(c) => 
                  <tr>
                    <th scope="row">{c.rn}</th>
                    <td>{c.proid}</td>
                    <td>{c.ticketno}</td>
                    <td>{formatter.format(new Date(c.date))}</td>
                    <td>{c.issue}</td>
                    <td>
                      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tableviewid" onClick={()=>{setshowt(true),tableViewIdquery(c.id);}}>
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
    console.log(id)
    setneedsave(false)
    alldeptid('')
    alluserid('','0')
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/getIdTicket/${id}`,{
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
      }).then(async (data)=>{
        let res = (await data.json())[0]
        // @ts-ignore
        let ndate = formatter.format(new Date(res.date )).replaceAll("/", "-")
        const [ month, day,year] = ndate.split(/\D/);
        // @ts-ignore
        let edate = formatter.format(new Date(res.dateend )).replaceAll("/", "-")
        const [ month2, day2,year2] = edate.split(/\D/);

        res.date = `${year}-${month.length==1?`0${month}`:month}-${day.length==1?`0${day}`:day}`;
        res.dateend = `${year2}-${month2.length==1?`0${month2}`:month2}-${day2.length==1?`0${day2}`:day2}`;


        if(res.started == undefined && res.reoccur == undefined){
          res.status="Pending"
        }else  if(res.started != undefined && res.reoccur == undefined){
          res.status="InProgress"
        }else  if(res.started != undefined && res.reoccur != undefined){
          res.status="Reoccured"
        }else  if(res.started == undefined && res.reoccur != undefined){
          res.status="Reoccured"
        }
        if(res.reoccur!=undefined){
          setshowocc(true)
        }
        setidquery(res)
        
      }).then(()=>{

        tableViewIdqueryApprover(id)
        tableViewIdHead(id)
      })
      
  }
  const tableViewIdHead =(id:number)=>{   
  
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/getIdTicketHead/${id}`,{
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
      }).then(async (data)=>{
         
         let res = (await data.json())
        
        if(res.length >0){
          setidquery(produce((prev)=>{
            prev.appseq.depthead =  res;
          }))
     
        }
     
      })
  }
  const tableViewIdqueryApprover =(id:number)=>{
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/getIdTicketApp/${id}`,{
        headers:{
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
      }).then(async (data)=>{
        let res = (await data.json())[0]

        if(res!=undefined){
       
          let arrdate: string[]=[]
          if(res.date!=null){
            JSON.parse(res.date).forEach((e:any)=>{
              // @ts-ignore
              let ndate = formatter.format(new Date(e )).replaceAll("/", "-")
              let [ month, day,year] = ndate.split(/\D/);
              arrdate.push(`${year}-${month.length==1?`0${month}`:month}-${day.length==1?`0${day}`:day}`)
            })
          }
      
          setidquery(produce((prev)=>{
            prev.appseq.dept =  JSON.parse(res.deptid);
            prev.appseq.name = JSON.parse(res.userid);
            prev.appseq.ddept = JSON.parse(res.ddeptid);
            prev.appseq.nname = JSON.parse(res.uuserid);
         
            prev.appseq.action = res.action == null?[]:JSON.parse(res.action);
            prev.appseq.note =  res.note == null?[]:JSON.parse(res.note);
            prev.appseq.date = arrdate;
          }))
       
        }
     
      })
      
  }
  const approvebtn = (key:number) =>{

    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/getIdTicketApprove`,{
        method: 'POST',
        body: JSON.stringify({
          idquery:idquery,
          key:key
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }).then(()=>{
        tableViewIdquery(idquery.id)
        socket.send(JSON.stringify({  updateid: idquery.id }));
        var myModal = document.getElementById("tableviewid");
        if (myModal) {
            myModal.classList.remove("show");
            myModal.style.display = "none";
        }
        var modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
      })
  }
  const closebtn = () =>{
    setidquery(reconcile(defaultidquery));
  }
  const skipped=()=>{
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/getIdTicketSkipped`,{
        method: 'POST',
        body: JSON.stringify({
          idquery:idquery
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }).then(()=>{
       
        getTicketFetch()
        getTicketTotalFetch()
        socket.send(JSON.stringify({  updateid: idquery.id }));
        var myModal = document.getElementById("tableviewid");
        if (myModal) {
            myModal.classList.remove("show");
            myModal.style.display = "none";
        }
        var modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
      })
  }
  const tableViewId=() =>{
    // console.log(classid().username) dont do something like this in asych signal. it will load first and delay the actual value.dont console.log
    const [cred, setcred] = createSignal<any>();
   
    setcred( credentialHolder())
    return <Portal>
      <div class="modal fade" id="tableviewid" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content" style={{width:"40rem"}}>
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Edit Ticket</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closebtn}></button>
            </div>
            <div class="modal-body">
           
            <form id="eticket" onSubmit={update} class="need-validation" noValidate>
           
            <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label border"> 
                        <input type="checkbox" onChange={skipped}/> Skipped &nbsp;&nbsp;&nbsp;
                       </label>
                        <label  class="col-sm-3 col-form-label border"> 
                        <input type="checkbox" checked={showocc()} onChange={(e)=>{setshowocc(e.target.checked);showocc()==false?setidquery(produce((vald)=>vald.ticketsearch=0)):''}} /> Reoccur</label>
                        <div class="col-sm-6">
                         
                          <Show when={showocc()==true}>
                              <input class="form-control" list="arrticketid" required placeholder="Search ticket #" value={idquery.rreoccur} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.ticketsearch=arrticketid().find((z:any) => z.ticketno == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{allticketid(e.target.value)}} />
                              <datalist id="arrticketid">                                                                        
                                <Suspense fallback={<p>loading</p>}>
                                <For each={arrticketid()}>{(c:{ticketno:string}) =>
                                  <option value={c.ticketno}/>
                                }</For>
                                </Suspense>
                              </datalist>
                       
                          </Show>
                         
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Ticket No.</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.ticketno} readOnly/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Date requested</label>
                        <div class="col-sm-9">

                          <input type="date"  class="form-control" value={idquery.date} readOnly/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                          <label  class="col-sm-3 col-form-label">Date Estimate End</label>
                          <div class="col-sm-9">
                            <input type="date"  class="form-control" value={idquery.dateend} onChange={(e)=>{setidquery(produce((vald)=>{vald.dateend= e.target.value}))}} onkeyup={()=>setneedsave(true)}/>
                          </div>
                        </div>
                    <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Project</label>
                        <div class="col-sm-9">
                          <input class="form-control " list="arrproid"  placeholder="Type to search..."  required value={idquery.pproid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.proid=arrproid().find((z:any) => z.code == e.target.value)?.id||0;}))}}  onKeyUp={(e:any)=>{allproid(e.target.value);setneedsave(true);}}/>
                          <datalist id="arrproid">
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arrproid()}>{(c:{code:string}) =>
                              <option value={c.code}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
              
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Environment</label>
                        <div class="col-sm-9">

                          <input class="form-control" list="arrenvid" required  placeholder="Type to search..." value={idquery.eenvid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.envid=arrenvid().find((z:any) => z.ttype == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{setneedsave(true);allenvid(e.target.value)}}/>
                          <datalist id="arrenvid">
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arrenvid()}>{(c:{ttype:string}) =>
                              <option value={c.ttype}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Event</label>
                        <div class="col-sm-9">
                          <input class="form-control" list="arreventid" required  placeholder="Type to search..." value={idquery.eeventid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.eventid=arreventid().find((z:any) => z.ttype == e.target.value)?.id||0;}))}}  onKeyUp={(e:any)=>{setneedsave(true);alleventid(e.target.value)}} />
                                                                                                                                             
                          <datalist id="arreventid">
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arreventid()}>{(c:{ttype:string}) =>
                              <option value={c.ttype}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Res person</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.rp} onChange={(e)=>{setidquery(produce((vald)=>{vald.rp= e.target.value}))}} onkeyup={()=>setneedsave(true)}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Module</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.module} onChange={(e)=>{setidquery(produce((vald)=>{vald.module= e.target.value}))}} onkeyup={()=>setneedsave(true)}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Application</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.app} onChange={(e)=>{setidquery(produce((vald)=>{vald.app= e.target.value}))}} onkeyup={()=>setneedsave(true)}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Classification</label>
                        <div class="col-sm-9">
                          <input class="form-control" list="arrclassid" required placeholder="Type to search..."  value={idquery.cclassid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.classid=arrclassid().find((z:any) => z.code == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{setneedsave(true);allclassid(e.target.value)}} />
                          <datalist id="arrclassid">                                                                        
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arrclassid()}>{(c:{code:string}) =>
                              <option value={c.code}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Issue</label>
                        <div class="col-sm-9">
                          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={idquery.issue} onChange={(e)=>{setidquery(produce((vald)=>{vald.issue= e.target.value}))}} onkeyup={()=>setneedsave(true)}></textarea>
                       
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Status</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.status} readOnly/>
                        </div>
                      </div>
                      <For each={idquery.appseq?.ddept}>{(_app, i) =>
                            <Show when={(idquery.appseq.date == undefined? 0 == i() :idquery.appseq.date.length >= i()) || cred()?.ea ==1 }>
                           
                           
                             <div class="border p-2">
                                <div class="mb-3 row">
                                  <label class="col-sm-3 col-form-label">Department</label>
                                  <div class="col-sm-9">
                                    <input class="form-control" readOnly={i()==0?true:false} list={`appdept${i()}`} required placeholder="Type to search..."  autocomplete="off" value={idquery.appseq?.ddept?.length >0?idquery.appseq.ddept[i()]:''} onChange={(e)=>{setneedsave(true);setidquery(produce((vald)=>{vald.appseq.nname[i()]='';vald.appseq.name[i()]='';vald.appseq.ddept[i()]=e.target.value;vald.appseq.dept[i()]=arrdeptid().find((z:any) => z.dept == e.target.value)?.id;alluserid('',idquery.appseq.dept[i()]);}))}} onKeyUp={(e:any)=>{alldeptid(e.target.value)}}/>
                                    <datalist id={`appdept${i()}`}>
                                    <Suspense fallback={<p>loading</p>}>
                                    <For each={arrdeptid()}>{(c:{dept:string}) =>
                                      <option value={c.dept}/>
                                    }</For>
                                    </Suspense>
                                    </datalist>
                                  </div>
                                </div>
                                
                                <div class="mb-3 row">
                                    <label class="col-sm-3 col-form-label">Name</label>
                                    <div class="col-sm-9">
                                      <input class="form-control" list={`appname${i()}`} readOnly={i()==0?true:false} required  placeholder="Type to search..."  autocomplete="off" value={idquery.appseq?.nname?.length>0?idquery.appseq.nname[i()]:''} onChange={(e)=>{setneedsave(true);setidquery(produce((vald)=>{vald.appseq.nname[i()]=e.target.value;vald.appseq.name[i()]=arruserid().find((z:any) => z.name == e.target.value)?.id;}))}} onKeyUp={(e:any)=>{alluserid(e.target.value,idquery.appseq.dept[i()])}}/>
                                      <datalist id={`appname${i()}`}>
                                        <Suspense fallback={<p>loading</p>}>
                                        <For each={arruserid()}>{(c:{name:string}) =>
                                          <option value={c.name}/>
                                        }</For>
                                      </Suspense>
                                      </datalist>
                                    </div>
                                </div>
                                <Show when={ idquery.appseq?.date != undefined && idquery.appseq?.date[i()] }>
                                <div class="mb-3 row">
                                  <label  class="col-sm-3 col-form-label">Head</label>
                                  <div class="col-sm-9">
                                    <input type="text" class="form-control"  readOnly value={idquery.appseq?.depthead?.length >0?idquery.appseq?.depthead[i()].name:''} />
                                  </div>
                                </div>
                               
                                <div class="mb-3 row">
                                  <label  class="col-sm-3 col-form-label">Action</label>
                                  <div class="col-sm-9">
                                    <textarea class="form-control" required rows="3" value={idquery.appseq?.action?.length >0?idquery.appseq?.action[i()]:''} onChange={(e)=>{setneedsave(true);setidquery(produce((vald)=>{vald.appseq.action[i()]=e.target.value}))}}></textarea>
                                  </div>
                                </div>
                                <div class="mb-3 row">
                                  <label  class="col-sm-3 col-form-label">Notes</label>
                                  <div class="col-sm-9">
                                    <textarea class="form-control"  required rows="3" value={idquery.appseq?.note?.length >0?idquery.appseq?.note[i()]:''} onChange={(e)=>{setneedsave(true);setidquery(produce((vald)=>{vald.appseq.note[i()]=e.target.value}))}}></textarea>
                                  </div>
                                </div>
                               
                                  <div class="mb-3 row">
                                    <label  class="col-sm-3 col-form-label">Approve Date</label>
                                    <div class="col-sm-9">
                                    <input type="date"  class="form-control" value={idquery.appseq.date[i()]}/>
                                    </div>
                                  </div>
                                </Show>
                          
                                <Show when={idquery.appseq.name[i()]== cred()?.id && (idquery.appseq.date == undefined? '0' :idquery.appseq.date[i()]==undefined) && needsave()==false }>
                                 {/* <button type="button" class="btn btn-primary" onClick={()=>approvebtn(i())}>Approve</button>   */}
                                 <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#comments">
                                  Approve
                                </button>
                                <Addcomment val={i()}/>
                                
                                </Show>
                             
                             </div>
                    
                             </Show>
                             
                        }</For>
                 
                         <Show when={cred()?.ea ==1 && idquery.appseq.date[0]==undefined }>
                           <button type="button" class="btn btn-primary" onClick={()=>addappseq()}>Add approver</button>  
                         </Show>
                
                    </form>
            </div>
            <div class="modal-footer">
          
            <Show when={cred()?.ea ==1  && idquery.appseq.date[0]==undefined }>
              <button type="button" class="btn btn-danger" onClick={()=>deleteData(idquery)}>Delete</button>
              <button type="submit" class="btn btn-primary"  form="eticket">Save</button>
            </Show>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={closebtn}>Close</button>
            </div>
          </div>
        </div>
      </div>

    </Portal>
  }
  const deleteData =(idquery:idquery)=>{

    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/deleteTicket`,{
        method: 'POST',
        body: JSON.stringify({
          id:idquery.id
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
       getTicketFetch()
       getTicketTotalFetch()
       
       
       socket.send(JSON.stringify({  action: "update" })); 
      })
  }
  const update =(event:any)=>{
  
    event.preventDefault();
    const form= event.target

    setalerton(false)
    if(idquery.dateend==''){
      form[2].classList.add('is-invalid')
      form[2].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[2].classList.remove('is-invalid')
      form[2].classList.add('is-valid')
    }
    
    if(idquery.proid==0){
      form[3].classList.add('is-invalid')
      form[3].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[3].classList.remove('is-invalid')
      form[3].classList.add('is-valid')
    }
  
    if(idquery.envid==0){
      form[4].classList.add('is-invalid')
      form[4].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[4].classList.remove('is-invalid')
      form[4].classList.add('is-valid')
    }
    if(idquery.eventid==0){
      form[5].classList.add('is-invalid')
      form[5].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[5].classList.remove('is-invalid')
      form[5].classList.add('is-valid')
    }
    if(idquery.classid==0){
      form[9].classList.add('is-invalid')
      form[9].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[9].classList.remove('is-invalid')
      form[9].classList.add('is-valid')
    }
   
    if(form.length>14){

      const lengthform = 12
      idquery.appseq.dept.forEach((data,index)=>{
        if(index == 0){
          if(data==''){
            form[index + lengthform].classList.add('is-invalid')
            form[index + lengthform].classList.remove('is-valid')
            setalerton(true)
          }else{
            form[index + lengthform].classList.remove('is-invalid')
            form[index + lengthform].classList.add('is-valid')
          }
        }else{
          if(data==''){
            form[index*2 + lengthform+0].classList.add('is-invalid')
            form[index*2 + lengthform+0].classList.remove('is-valid')
            setalerton(true)
          }else{
            form[index*2 + lengthform+0].classList.remove('is-invalid')
            form[index*2 + lengthform+0].classList.add('is-valid')
          }
        }
      })
      idquery.appseq.name.forEach((data,index)=>{
        if(index == 0){
          if(data==''){
            form[index + lengthform+1].classList.add('is-invalid')
            form[index + lengthform+1].classList.remove('is-valid')
            setalerton(true)
          }else{
            form[index + lengthform+1].classList.remove('is-invalid')
            form[index + lengthform+1].classList.add('is-valid')
          }
        }else{
          if(data==''){
            form[index*2 + lengthform+1].classList.add('is-invalid')
            form[index*2 + lengthform+1].classList.remove('is-valid')
            setalerton(true)
          }else{
            form[index*2 + lengthform+1].classList.remove('is-invalid')
            form[index*2 + lengthform+1].classList.add('is-valid')
          }
        }
      })

 
    }



   if(alerton()==false){
    setneedsave(false);
    
    fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/updateTicket`,{
        method: 'POST',
        body: JSON.stringify({
          idquery:idquery
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
          getTicketFetch()
          getTicketTotalFetch()
          
          
   
          socket.send(JSON.stringify({  updateid: idquery.id })); 
          
      })
   }
  
  }
  const tableviewrows =(total:any,URlparms:any)=>{
    return <>
        <Paginate row={total}  search={URlparms} ></Paginate>
    </>
  }
  
  const create =(event:any)=>{
    event.preventDefault();
    const form= event.target
    setalerton(false)
    if(idquery.dateend==''){
      form[1].classList.add('is-invalid')
      form[1].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[1].classList.remove('is-invalid')
      form[1].classList.add('is-valid')
    }
    
    if(idquery.proid==0){
      form[2].classList.add('is-invalid')
      form[2].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[2].classList.remove('is-invalid')
      form[2].classList.add('is-valid')
    }
  
    if(idquery.envid==0){
      form[3].classList.add('is-invalid')
      form[3].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[3].classList.remove('is-invalid')
      form[3].classList.add('is-valid')
    }
    if(idquery.eventid==0){
      form[4].classList.add('is-invalid')
      form[4].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[4].classList.remove('is-invalid')
      form[4].classList.add('is-valid')
    }
    if(idquery.classid==0){
      form[8].classList.add('is-invalid')
      form[8].classList.remove('is-valid')
      setalerton(true)
    }else{
      form[8].classList.remove('is-invalid')
      form[8].classList.add('is-valid')
    }
  
    if(form.length>12){
  
      const lengthform = 10
      idquery.appseq.dept.forEach((data,index)=>{
        if(index == 0){
          if(data==''){
            form[index + lengthform].classList.add('is-invalid')
            form[index + lengthform].classList.remove('is-valid')
            setalerton(true)
          }else{
            form[index + lengthform].classList.remove('is-invalid')
            form[index + lengthform].classList.add('is-valid')
          }
        }else{
          if(data==''){
            form[index + lengthform+1].classList.add('is-invalid')
            form[index + lengthform+1].classList.remove('is-valid')
            setalerton(true)
          }else{
            form[index + lengthform+1].classList.remove('is-invalid')
            form[index + lengthform+1].classList.add('is-valid')
          }
        }
      })
      idquery.appseq.name.forEach((data,index)=>{
        if(index == 0){
          if(data==''){
            form[index + lengthform+1].classList.add('is-invalid')
            form[index + lengthform+1].classList.remove('is-valid')
            setalerton(true)
          }else{
            form[index + lengthform+1].classList.remove('is-invalid')
            form[index + lengthform+1].classList.add('is-valid')
          }
        }else{
          if(data==''){
            form[index + lengthform+2].classList.add('is-invalid')
            form[index + lengthform+2].classList.remove('is-valid')
            setalerton(true)
          }else{
            form[index + lengthform+2].classList.remove('is-invalid')
            form[index + lengthform+2].classList.add('is-valid')
          }
        }
      })
    }
  
    if(alerton()==false){

      fetch(
            `${import.meta.env.VITE_API_ENDPOINT}/createTicket`,{
              method: 'POST',
              body: JSON.stringify({
                idquery:idquery
              }),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
              },
            }).then(()=>{
            
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
                getTicketFetch()
                getTicketTotalFetch()
                
                
                socket.send(JSON.stringify({action: "update"})); 
            })
    }
    
  }

  const tablecreate =()=>{
    const [cred, setcred] = createSignal<any>();
    setcred( credentialHolder())
    //arrdeptid()[0]
  
    return <>
         <Show when={cred()?.aa ==1} fallback={<div ></div>}>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#create" onClick={()=>{
            setidquery(reconcile(defaultidquery))
         
            alluserid('','0'),
            alldeptid(''),
            allproid(''),
            allclassid(''),
            allenvid(''),
            alleventid(''),
            allticketid('')
            setidquery(
              produce((pdata) => {
                //[...pdata] i want not to change previuos values something spead operator
        
                pdata.appseq.action.push('')
                pdata.appseq.note.push('')
                pdata.appseq.status.push('')
                pdata.appseq.nname.push(cred()?.name)
                pdata.appseq.ddept.push(cred()?.dept)
                pdata.appseq.name.push(cred()?.id)
                pdata.appseq.dept.push(cred()?.deptid)
              })
            )
        }}>
            Create
          </button>
         </Show>
   

         <Portal>
            <div class="modal fade" id="create" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content" style={{width:"40rem"}}>
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Add new Ticket</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closebtn}></button>
                  </div>
                  <div class="modal-body">
                  <form id="aticket" onSubmit={create}  noValidate class="need-validation">
                      <div class="mb-3 row">
                          <label  class="col-sm-3 col-form-label">Date</label>
                          <div class="col-sm-9">
                            <input type="date"  class="form-control" value={formattedDate} readOnly/>
                          </div>
                        </div>
                        <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Date Estimate End</label>
                          <div class="col-sm-9">
                            <input type="date"  class="form-control" value={idquery.dateend?.slice(0, 10)} required onChange={(e)=>{setidquery(produce((vald)=>{vald.dateend= e.target.value}))}}/>
                          </div>
                        </div>
                    <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Project</label>
                        <div class="col-sm-9">
                          <input class='form-control'   list="arrproid" required placeholder="Type to search..."   value={idquery.pproid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.proid=arrproid().find((z:any) => z.code == e.target.value)?.id||0;}))}}  onKeyUp={(e:any)=>{allproid(e.target.value)}}/>
                          <datalist id="arrproid">
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arrproid()}>{(c:{code:string}) =>
                              <option value={c.code}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
              
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Environment</label>
                        <div class="col-sm-9">

                          <input class="form-control" list="arrenvid" required  placeholder="Type to search..." value={idquery.eenvid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.envid=arrenvid().find((z:any) => z.ttype == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{allenvid(e.target.value)}}/>
                          <datalist id="arrenvid">
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arrenvid()}>{(c:{ttype:string}) =>
                              <option value={c.ttype}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Event</label>
                        <div class="col-sm-9">
                          <input class="form-control" list="arreventid" required  placeholder="Type to search..." value={idquery.eeventid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.eventid=arreventid().find((z:any) => z.ttype == e.target.value)?.id||0;}))}}  onKeyUp={(e:any)=>{alleventid(e.target.value)}} />
                                                                                                                                             
                          <datalist id="arreventid">
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arreventid()}>{(c:{ttype:string}) =>
                              <option value={c.ttype}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Res person</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.rp} onChange={(e)=>{setidquery(produce((vald)=>{vald.rp= e.target.value}))}}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Module</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.module} onChange={(e)=>{setidquery(produce((vald)=>{vald.module= e.target.value}))}}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Application</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.app} onChange={(e)=>{setidquery(produce((vald)=>{vald.app= e.target.value}))}}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Classification</label>
                        <div class="col-sm-9">
                          <input class="form-control" list="arrclassid" required placeholder="Type to search..."  value={idquery.cclassid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.classid=arrclassid().find((z:any) => z.code == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{allclassid(e.target.value)}} />
                          <datalist id="arrclassid">                                                                        
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arrclassid()}>{(c:{code:string}) =>
                              <option value={c.code}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Issue</label>
                        <div class="col-sm-9">
                          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={idquery.issue} onChange={(e)=>{setidquery(produce((vald)=>{vald.issue= e.target.value}))}}></textarea>
                       
                        </div>
                      </div>
              
                      <For each={idquery.appseq?.ddept}>{(_app, i) =>
                            <Show when={(idquery.appseq.date == undefined? 0 == i() :idquery.appseq.date.length >= i()) || cred()?.ea ==1 }>
                           
                           
                             <div class="border p-2">
                                <div class="mb-3 row">
                                  <label class="col-sm-3 col-form-label">Department</label>
                                  <div class="col-sm-9">
                                    <input class="form-control" readOnly={i()==0?true:false} list={`appdept`+i()} id={`appdep1t`+i()} required placeholder="Type to search..."  autocomplete="off" value={idquery.appseq?.ddept?.length >0?idquery.appseq.ddept[i()]:''} onChange={(e)=>{setneedsave(true);setidquery(produce((vald)=>{vald.appseq.ddept[i()]=e.target.value;vald.appseq.nname[i()]='';vald.appseq.dept[i()]=arrdeptid().find((z:any) => z.dept == e.target.value)?.id||''}));alluserid('',idquery.appseq.dept[i()]);}} onKeyUp={(e:any)=>{alldeptid(e.target.value);}}/>
                                    <datalist id={`appdept`+i()}>
                                    <Suspense fallback={<p>loading</p>}>
                                    <For each={arrdeptid()}>{(c:{dept:string}) =>
                                      <option value={c.dept}/>
                                    }</For>
                                    </Suspense>
                                    </datalist>
                                  </div>
                                </div>
                                <div class="mb-3 row">
                                    <label class="col-sm-3 col-form-label">Name</label>
                                    <div class="col-sm-9">
                                      <input class="form-control" list={`appname`+i()} id={`appname1`+i()} readOnly={i()==0?true:false} required placeholder="Type to search..."  autocomplete="off" value={idquery.appseq?.nname?.length>0?idquery.appseq.nname[i()]:''} onChange={(e)=>{setneedsave(true);setidquery(produce((vald)=>{vald.appseq.nname[i()]=e.target.value;vald.appseq.name[i()]=arruserid().find((z:any) => z.name == e.target.value)?.id||'';}))}} onKeyUp={(e:any)=>{alluserid(e.target.value,idquery.appseq.dept[i()])}}/>
                                      <datalist id={`appname`+i()}>
                                        <Suspense fallback={<p>loading</p>}>
                                        <For each={arruserid()}>{(c:{name:string}) =>
                                          <option value={c.name}/>
                                        }</For>
                                      </Suspense>
                                      </datalist>
                                    </div>
                                </div>
                               
                          
                                <Show when={idquery.appseq.name[i()]== cred()?.id && (idquery.appseq.date == undefined? '0' :idquery.appseq.date[i()]==undefined) && needsave()==false}>
                                 {/* <button type="button" class="btn btn-primary" onClick={()=>approvebtn(i())}>Approve</button>   */}
                                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#comments">
                                    Approve
                                  </button>
                                  <Addcomment val={i()}/>
                                </Show>
                             
                             </div>
                             </Show>
                        }</For>
                    <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label"> <input type="checkbox" checked={showocc()} onChange={(e)=>{setshowocc(e.target.checked)}} /> Reoccur</label>
                        <div class="col-sm-9">
                         
                          <Show when={showocc()==true}>
                              <input class="form-control" list="arrticketid" required placeholder="Search ticket #" autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.ticketsearch=arrticketid().find((z:any) => z.ticketno == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{allticketid(e.target.value)}} />
                              <datalist id="arrticketid">                                                                        
                                <Suspense fallback={<p>loading</p>}>
                                <For each={arrticketid()}>{(c:{ticketno:string}) =>
                                  <option value={c.ticketno}/>
                                }</For>
                                </Suspense>
                              </datalist>
                       
                          </Show>
                         
                        </div>
                      </div>
                        <button type="button" class="btn btn-primary" onClick={()=>addappseq()}>Add approver</button>  
                     
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="createUserclose" onClick={closebtn}>Close</button>
                    <button type="submit" class="btn btn-primary"  form="aticket">Save</button>
                  </div>
                </div>
              </div>
            </div>
            </Portal>
           
    </>
  }
  const Addcomment = (data:any)=>{
  
   
    return <>
    <Portal>
    <div class="modal fade" id="comments" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3 row">
                <label  class="col-sm-3 col-form-label">Action</label>
                  <div class="col-sm-9">
                   
                    <input type="text"  class="form-control" onChange={(e)=>{setidquery(produce((vald)=>{vald.appseq.action[data.val]= e.target.value}))}}/>
                   
                    
                  </div>
              </div>
              <div class="mb-3 row">
                <label  class="col-sm-3 col-form-label">Note</label>
                  <div class="col-sm-9">
                    <input type="text"  class="form-control"   onChange={(e)=>{setidquery(produce((vald)=>{vald.appseq.note[data.val]= e.target.value}))}}/>
                  </div>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" onClick={()=>approvebtn(parseInt(data.val))}>Understood</button>
            <button class="btn btn-primary" data-bs-target="#create" data-bs-toggle="modal" >Back to first</button>
          </div>
        </div>
      </div>
    </div>
    </Portal>
    </>
  }
  const filterPro = ()=>{
    return <>

    <input  list="arrproid"  placeholder="Type to search..." value={idquery.pproid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.proid=arrproid().find((z:any) => z.code == e.target.value)?.id||0;location.href='current?page=1&proid='+idquery.proid}))}}  onKeyUp={(e:any)=>{allproid(e.target.value)}}/>
    <datalist id="arrproid">
      <Suspense fallback={<p>loading</p>}>
          <For each={arrproid()}>{(c:{code:string}) =>
            <option value={c.code}/>
         }</For>
      </Suspense>
    </datalist>
 
    </>
  }
  const tablesearch =()=>{
    return <>
             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#search" >
              Search
            </button>

            <Portal>
            <div class="modal fade" id="search" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
              <div class="modal-dialog" >
                <div class="modal-content"  style={{width:"40rem"}}>
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Search</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closebtn}></button>
                  </div>
                  <div class="modal-body" >
                  <form >
                    <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Project</label>
                        <div class="col-sm-9">
                          <input class="form-control" list="arrproid"  placeholder="Type to search..." value={idquery.pproid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.proid=arrproid().find((z:any) => z.code == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{allproid(e.target.value)}}/>
                          <datalist id="arrproid">
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arrproid()}>{(c:{code:string}) =>
                              <option value={c.code}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Ticket No.</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.ticketno} onChange={(e)=>{setidquery(produce((vald)=>{vald.ticketno= e.target.value}))}} />
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Date</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.date} onChange={(e)=>{setidquery(produce((vald)=>{vald.date= e.target.value}))}}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Environment</label>
                        <div class="col-sm-9">

                          <input class="form-control" list="arrenvid"  placeholder="Type to search..." value={idquery.eenvid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.envid=arrenvid().find((z:any) => z.ttype == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{allenvid(e.target.value)}}/>
                          <datalist id="arrenvid">
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arrenvid()}>{(c:{ttype:string}) =>
                              <option value={c.ttype}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Event</label>
                        <div class="col-sm-9">
                          <input class="form-control" list="arreventid"  placeholder="Type to search..." value={idquery.eeventid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.eventid=arreventid().find((z:any) => z.ttype == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{alleventid(e.target.value)}} />
                                                                                                                                             
                          <datalist id="arreventid">
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arreventid()}>{(c:{ttype:string}) =>
                              <option value={c.ttype}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Res person</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.rp} onChange={(e)=>{setidquery(produce((vald)=>{vald.rp= e.target.value}))}}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Module</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.module} onChange={(e)=>{setidquery(produce((vald)=>{vald.module= e.target.value}))}}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Application</label>
                        <div class="col-sm-9">

                          <input type="text"  class="form-control" value={idquery.app} onChange={(e)=>{setidquery(produce((vald)=>{vald.app= e.target.value}))}}/>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Classification</label>
                        <div class="col-sm-9">
                          <input class="form-control" list="arrclassid"  placeholder="Type to search..."  value={idquery.cclassid} autocomplete="off" onChange={(e)=>{setidquery(produce((vald)=>{vald.classid=arrclassid().find((z:any) => z.code == e.target.value)?.id||0;}))}} onKeyUp={(e:any)=>{allclassid(e.target.value)}}/>
                          <datalist id="arrclassid">                                                                        
                            <Suspense fallback={<p>loading</p>}>
                            <For each={arrclassid()}>{(c:{code:string}) =>
                              <option value={c.code}/>
                            }</For>
                            </Suspense>
                          </datalist>
                        </div>
                      </div>
                      <div class="mb-3 row">
                        <label  class="col-sm-3 col-form-label">Issue</label>
                        <div class="col-sm-9">
                          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={idquery.issue} onChange={(e)=>{setidquery(produce((vald)=>{vald.issue= e.target.value}))}}></textarea>
                        </div>
                      </div>
                     
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onClick={()=>{ location.href="current?page=1"}}>Reset</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={closebtn}>Close</button>
                    <button type="button" class="btn btn-primary" onClick={() => { location.href="current?page=1&proid="+idquery.proid+'&ticketno='+idquery.ticketno
                  +'&date='+idquery.date+'&envId='+idquery.envid+'&eventId='+idquery.eventid+'&rp='+idquery.rp+'&module='+idquery.module+'&app='+idquery.app+'&classId='+idquery.classid
                  +'&issue='+idquery.issue
                  }} >Search</button>
                  </div>
                </div>
              </div>
            </div>
            </Portal>
    </>
  }
 
  const exportData = async () =>{
  
  const res = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/ticket/printTicket${URlparms()}`, {
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
          var headerColumns = ['Project', 'Ticket No.', 'Date', 'Issue', 'Status'];
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
    const headers = ['Project', 'Ticket No.', 'Date', 'Issue', 'Status'];
    
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
      
 
      let newarr = []
      newarr.push("Project Type Master",'\n','Report of ',formattedDate,'\n')
      newarr.push('Project',',','Ticket No.',',','Date',',','Issue',',','Status',',','\n')
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
        `ExportProject.csv`,
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
      <RightDesign csv={toCVS} pdf={toPDF} tableViewId={tableViewId} pageroute={"Ticket"} print={toPrint} tableview={tableview(classi())}  tablerow={tableviewrows(row(),URlparms())} tablecreate={tablecreate()} tablesearch={tablesearch} filtersearch={filterPro}></RightDesign>
    )} 
    </Body>
   </CredentialUser>
   </>
  );
}
