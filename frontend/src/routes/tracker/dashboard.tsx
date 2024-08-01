import { For, Show, Suspense, createResource } from "solid-js";
import Body from "../../components/body";
import { A } from "@solidjs/router";
import CredentialUser, { credentialHolder } from "../../components/credential";

export default function Dashboard() {

  const [row, { refetch:rrefecth }] = createResource( totalcurrent);
  const [rowdelay, { refetch:rtotalrefecth }] = createResource( totaldone);
  const [totalpro, { refetch:prefetch }] = createResource( allproject);
  const socket = new WebSocket("ws://localhost:4000");
 
  // message is received
  socket.onmessage = (event) => {
    let res = JSON.parse(JSON.parse(event.data).data.map((charCode:any) => String.fromCharCode(charCode)).join(''));
    if(res.action != undefined || res.updateid != undefined){
      rrefecth()
      rtotalrefecth()
    }
    console.log(res)
    if(res.projadd != undefined || res.projid != undefined ){
      prefetch()
     }
   }
 // socket closed
 socket.addEventListener("close", event => {console.log(event)});
 
 // error handler
 socket.addEventListener("error", event => {console.log(event)});
 
  async function totalcurrent() {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/ticket/tickettotal`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
      );

      return await response.json();

  }
 
  async function totaldone() {

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/ticket/tickettotaldone`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        },
      }
      );

      return await response.json();
  }
  async function allproject() {

    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/project/project`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
      },
    }
    );

    return await response.json();
}
  function ChartProj(){

    const res:any = credentialHolder()
    return <>
      <Show when={res.deptid == 1}>
      <div class="border mt-4">
              <h2 class="fw-bolder">Project</h2>
              <div class="row">
              <For each={totalpro()}>{(data) =>
              
              <div class="col-md-3 mb-3">
                <div class="card  text-dark h-100 ">
                  <A href={'/tracker/'+data.id} class="nav-link">
                    <Suspense fallback={<div class="card-body py-5">loading</div>}>
                    <div class="card-footer d-flex">
                      {data.code}
                      <span class="ms-auto">
                        <i class="bi bi-chevron-right"></i>
                      </span>
                    </div>
                    </Suspense>
                  </A>
                </div>
              </div>
              }</For>
              </div>
            </div>

            <div class="border mt-4">
              <h2 class="fw-bolder">Project</h2>
              <div class="row">
              
              <div class="col-md-3 mb-3">
                <div class="card  text-dark h-100 ">
                  <A href={'/tracker/summary'} class="nav-link">
                 
                    <div class="card-footer d-flex">
                      OverAll Summary
                      <span class="ms-auto">
                        <i class="bi bi-chevron-right"></i>
                      </span>
                    </div>
                   
                  </A>
                </div>
              </div>
             
              </div>
            </div>
            </Show>
    </>
  }
  return (
 
      <CredentialUser>
   <Body>
        <main class="mt-5 pt-3">
          <div class="container-fluid">

            <div class="border">
              <h2 class="fw-bolder">Ticket</h2>
              <div class="row">
              <div class="col-md-3 mb-3">
                  <div class="card bg-primary text-white h-100">
                    <A href="../ticket/current?page=1" class="nav-link">
                      <Suspense fallback={<div class="card-body py-5">loading</div>}>
                        <div class="card-body py-5">{row()}</div>
                      </Suspense>
                      <div class="card-footer d-flex">
                        Current
                        <span class="ms-auto">
                          <i class="bi bi-chevron-right"></i>
                        </span>
                      </div>
                    </A>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="card bg-warning text-dark h-100">
                    <A href="../ticket/done?page=1" class="nav-link">
                      <Suspense fallback={<div class="card-body py-5">loading</div>}>
                        <div class="card-body py-5">{rowdelay()}</div>
                      </Suspense>
                      <div class="card-footer d-flex">
                        Done
                        <span class="ms-auto">
                          <i class="bi bi-chevron-right"></i>
                        </span>
                      </div>
                    </A>
                  </div>
                </div>
              </div>
             
            </div>
           <ChartProj/>
          </div>
        </main>

       </Body>
    </CredentialUser>
  );
}
