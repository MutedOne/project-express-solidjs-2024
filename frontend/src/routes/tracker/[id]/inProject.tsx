import { For, Show,  createResource } from "solid-js";
import Body from "../../../components/body";
import CredentialUser from "../../../components/credential";
import { useParams } from "@solidjs/router";
import { onMount } from 'solid-js'
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { Pie } from 'solid-chartjs'
import 'chart.js/auto';

async function thisProject(id:string) {
  
    const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/getIdProject/${id}`,{
            headers:{
                "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
            }
        })

  return  response.json();
  }
  async function thisProjectDeep(id:string) {

    const response = await (await fetch(`${import.meta.env.VITE_API_ENDPOINT}/getIdProjectDeep/${id}`,{
        headers:{
            "Authorization": `Bearer ${sessionStorage.getItem('sessionId')}`
        }
    })).json()
     
  return  response;
  }
  const MyChart = (val:any) => {
    /**
     * You must register optional elements before using the chart,
     * otherwise you will have the most primitive UI
     */
    onMount(() => {
        Chart.register(Title, Tooltip, Legend, Colors)
    })

    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        
    }


    const toPercentage={
        Complete:0,
        Pending:0,
        InProgress:0,
        NotStarted:0,
        Skipped:0
        
    }
    const cd={
        Complete:0,
        Pending:0,
        InProgress:0,
        NotStarted:0,
        Skipped:0,
        ticket:0
    }
   
    val.data.forEach((currentdata:any)=>{
        cd.Complete+=parseInt(currentdata.Complete)
        cd.InProgress+=parseInt(currentdata.InProgress)
        cd.Pending+=parseInt(currentdata.Pending)
        cd.NotStarted+=parseInt(currentdata.NotStarted)
        cd.Skipped+=parseInt(currentdata.Skipped)
        cd.ticket+=parseInt(currentdata.ticket)
    })
  
    toPercentage.Complete+=parseFloat(((cd.Complete/cd.ticket) *100).toFixed(2))
    toPercentage.InProgress+=parseFloat(((cd.InProgress/cd.ticket) *100).toFixed(2))
    toPercentage.Pending+=parseFloat(((cd.Pending/cd.ticket) *100).toFixed(2))
    toPercentage.NotStarted+=parseFloat(((cd.NotStarted/cd.ticket) *100).toFixed(2))
    toPercentage.Skipped=parseFloat(((cd.Skipped/cd.ticket) *100).toFixed(2))

    return (
        <>
        <Show when={val.data[0].ticket >0} fallback={<p>No data</p>}>
        <div>
                    <Pie data={{
                        labels: Object.keys(toPercentage),
                        datasets: [
                            {
                                label: 'Tickets',
                                data: Object.values(toPercentage),
                            },
                        ],
                        }} options={chartOptions} width={500} height={500} />
                </div>
                 <Rowdata data={val.data}/>
        </Show>
            
        </>
 
    )
}
const Rowdata = (val:any) => {
    return (
        <div>
           <table class="table">
            <thead>
                <tr>
                <For each={Object.keys(val.data[0])}>{(data) =>
                    <th >{data}</th>
                }</For>
                </tr>
                
            </thead>
            <tbody>
            <For each={val.data}>{(data) =>
                    <tr>
                        <Show when={data.code != undefined}>
                            <td>{data.code}</td>
                        </Show>
                     
                        <td>{data.ticket}</td>
                        <td>{data.Complete}</td>
                        <td>{data.InProgress}</td>
                        <td>{data.Pending}</td>
                        <td>{data.NotStarted}</td>
                        <td>{data.Skipped}</td>
                    </tr>
            }</For>
              
            </tbody>
            </table>
        </div>
    )

}
export default function inProj(){
    const params = useParams();
    const [data,{refetch:proref}] = createResource(params.id,thisProject)
    const [datadeep,{refetch:prodeep}] = createResource(params.id,thisProjectDeep)

    const socket = new WebSocket("ws://localhost:4000");
    socket.onmessage = (event) => {
    let res = JSON.parse(JSON.parse(event.data).data.map((charCode:any) => String.fromCharCode(charCode)).join(''));
   
    if(res.projid != undefined){
    

      if(params.id==res.projid){
        console.log("reload")
        proref()
        prodeep()
      }

    }
  };

    return (
 
        <CredentialUser>
     <Body>
          <main class="mt-5 pt-3">
            <div class="container-fluid">

            {
                params.id!='summary'?
                data.loading?<p>..loading</p>:
                <div>
                    <p>Code: {data()?.code}</p>
                </div>:<div>Total Summary</div>
            }
            {
                datadeep.loading?(datadeep()==undefined?<p>No data</p>:<p>..loading</p>):
                    <MyChart data={datadeep()}/> 
            }
            </div>
          </main>
  
         </Body>
      </CredentialUser>
    );
}