import "./css/Sidemenu.css";

import "../components/css/dashboard.css"
import { A } from "@solidjs/router";
// import { useContext } from "solid-js";
// import { UserD } from "./body";
export default function Sidenav() {
  // const context = useContext(UserD);
  // console.log(context)
    return (
        <>
       <div
      class="offcanvas offcanvas-start sidebar-nav bg-white "
      tabindex="-1"
      id="sidebar"
    >
      <div class="offcanvas-body p-0 no-printme">
        <nav class="navbar-dark">
          <ul class="navbar-nav">
        
            <li>
              <A href="/tracker" class="nav-link px-3 text-secondary text-secondaryactive text-secondary">
                <span class="me-2"><i class="bi bi-speedometer2"></i></span>
                <span>TRACKER</span>
              </A>
            </li>
            <li>
                <a href="/classification?page=1" class="nav-link px-3 text-secondary">
                  <span class="me-2"><i class="bi bi-graph-up"></i></span>
                  <span>CLASSIFICATION</span>
                </a>
            </li>
            <li>
                <a href="/events?page=1" class="nav-link px-3 text-secondary">
                  <span class="me-2"><i class="bi bi-graph-up"></i></span>
                  <span>EVENTS</span>
                </a>
            </li>
            <li>
                <a href="/environment?page=1" class="nav-link px-3 text-secondary">
                  <span class="me-2"><i class="bi bi-graph-up"></i></span>
                  <span>ENVIRONMENT</span>
                </a>
            </li>
            <li>
                <a href="/action?page=1" class="nav-link px-3 text-secondary">
                  <span class="me-2"><i class="bi bi-graph-up"></i></span>
                  <span>ACTION</span>
                </a>
            </li>
            <li>
                <a href="/project?page=1" class="nav-link px-3 text-secondary">
                  <span class="me-2"><i class="bi bi-graph-up"></i></span>
                  <span>PROJECT</span>
                </a>
            </li>
            {/* <li>
                <a href="/ticket" class="nav-link px-3 text-secondary">
                  <span class="me-2"><i class="bi bi-graph-up"></i></span>
                  <span>TICKET</span>
                </a>
            </li> */}
             <li>
              <a
                class="nav-link px-3 text-secondary text-secondarysidebar-link text-secondary"
                data-bs-toggle="collapse"
                href="#layouts"
              >
                <span class="me-2"><i class="bi bi-layout-split"></i></span>
                <span>TICKET</span>
                <span class="ms-auto">
                  <span class="right-icon">
                    <i class="bi bi-chevron-down"></i>
                  </span>
                </span>
              </a>
              <div class="collapse show" id="layouts">
                <ul class="navbar-nav ps-3 ">
                  <li>
                    <a href="/ticket/current?page=1" class="nav-link px-3 text-secondary">
                      <span class="me-2 "
                        ><i class="bi bi-speedometer2"></i></span>
                      <span>Current</span>
                    </a>
                  </li>
                  <li>
                    <a href="/ticket/done?page=1" class="nav-link px-3 text-secondary">
                      <span class="me-2 "
                        ><i class="bi bi-speedometer2"></i></span>
                      <span>Done</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
                <a href="/addproject?page=1" class="nav-link px-3 text-secondary">
                  <span class="me-2"><i class="bi bi-graph-up"></i></span>
                  <span></span>
                </a>
            </li>
            <li>
                <a href="/users?page=1" class="nav-link px-3 text-secondary">
                  <span class="me-2"><i class="bi bi-graph-up"></i></span>
                  <span>USERS</span>
                </a>
            </li>
            <li>
                <a href="/department?page=1" class="nav-link px-3 text-secondary">
                  <span class="me-2"><i class="bi bi-graph-up"></i></span>
                  <span>DEPARTMENT</span>
                </a>
            </li>
           
          </ul>
        </nav>
      </div>
    </div>
        </>
       

);
}