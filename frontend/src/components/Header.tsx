import { useNavigate } from "@solidjs/router";
import { credentialHolder } from "./credential";
import { createSignal } from "solid-js";
// import { UserD } from "./body";
// import { useContext } from "solid-js";

export default function Header(props:any) {
  const [ucred,setucred] = createSignal<any>();
  setucred(credentialHolder())
  const navigate = useNavigate();
    const logout =()=>{
      sessionStorage.removeItem("sessionId");
      navigate("/login");
    }
    return (
      <>
  
  <nav class="navbar navbar-expand-lg navbar-dark  fixed-top no-printme" style={{"background-color":"#aa00ff"}}>
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          aria-controls="offcanvasExample"
        >
          <span class="navbar-toggler-icon" data-bs-target="#sidebar"></span>
        </button>
        <a
          class="navbar-brand me-auto ms-lg-0 ms-3 text-uppercase fw-bold"
          href="#"
          >
             <img src="/Bootstrap_logo.png" alt="Logo" width="30" height="24" class="d-inline-block align-text-top "/>
              S2
          </a>
          
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#topNavBar"
          aria-controls="topNavBar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="topNavBar">
          <form class="d-flex ms-auto my-3 my-lg-0">
            <div class="input-group">
             
           
            </div>
          </form>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle ms-2"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-fill"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li> 
                <div class="card" style="width: 18rem;">
                  <img class="card-img-top" src={'${import.meta.env.VITE_API_ENDPOINT}/public/account/'+props.userdetail?.id+'.png'} alt="Card image cap" onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src="/profile.png";
                    }} />
                  <div class="card-body">
                    <h5 class="card-title">{ucred()?.name}</h5>
                    {/* <p class="card-subtitle">{ucred?.rolename}</p>
                    <p class="card-subtitle">{ucred?.departmentname}</p> */}
                    <button type="button" class="btn btn-primary" onclick={logout}>Logout</button>
                  </div>
                </div>
                 
                </li>
               
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
      </>
      
    );
  }