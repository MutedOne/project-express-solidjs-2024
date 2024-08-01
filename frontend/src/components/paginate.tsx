import { createPagination } from "@solid-primitives/pagination";
import { For, Show, Suspense, createEffect } from "solid-js";
import {  useSearchParams } from "@solidjs/router";
type Paginate = {
  row:number
};
export default function Paginate(props:any) {
    
    const [searchParams,setpc] = useSearchParams();

    const [paginationProps, page] = createPagination({ pages: Math.ceil(props.row/20) >=3? Math.ceil(props.row/20):4,initialPage:1,maxPages:Math.ceil(props.row/20) <=3? Math.ceil(props.row/20):4});
    createEffect(() => {
     
        page()
      });
    return (
        <div class="d-flex justify-content-between">
            
             <div>
               <nav class="pagination" aria-label="Page navigation example">
                 <ul class="pagination">
                 <Suspense fallback={<p>Loading...</p>}>
                 <For each={paginationProps()}>{
                    ( val:any) =>   
                     <li class="page-item">
                     
                       <Show when={val.page <=Math.ceil(props.row/20) && val.page >0}> 
                       {/* <A class="page-link" href={`?page=${val.page}${props.search}`} {...val}   /> */}
                       <button class="page-link" onClick={()=>setpc({page:val.page})}> {val.children}</button>
                       </Show>
                    
                       </li>
                   }</For>
                 </Suspense>
              
                 </ul>

               </nav>
             </div>
             <div >
               <button type="button" class="btn border-primary position-relative">
                   <input id="paginate" class="text-end border-0" style={{width:"3em"}} value={searchParams.page== null?1:searchParams.page} onChange={(e)=> location.href='?page='+e.target.value+props.search}/>
                 of   {Math.ceil(props.row/20)}
           
                   
               </button>
             </div>
             
           </div> 
    )
}