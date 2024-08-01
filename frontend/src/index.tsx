/* @refresh reload */
import { render } from 'solid-js/web'
import { Route, Router } from "@solidjs/router";
const Login = lazy(() => import("./routes/login"));
const Tracker = lazy(() => import("./routes/tracker/dashboard"));
const TrackerProject = lazy(() => import("./routes/tracker/[id]/inProject"));
const Users = lazy(() => import("./routes/users/index"));
const Classification = lazy(() => import("./routes/classification/index"));
const Events = lazy(() => import("./routes/events/index"));
const Environment = lazy(() => import("./routes/environment/index"));
const Action = lazy(() => import("./routes/action/index"));
const Project = lazy(() => import("./routes/project/index"));
const Ticket = lazy(() => import("./routes/ticket/current"));
const DoneTicket = lazy(() => import("./routes/ticket/done"));
const Department = lazy(() => import("./routes/department/index"));
const Nopage = lazy(() => import("./routes/404"));
const root = document.getElementById('root')
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { lazy } from 'solid-js';

render(() => (
    <Router>
     
               <Route path="/login" component={Login} />
               <Route path="/" component={Login} />
               <Route path="/tracker">
                  <Route path="/" component={Tracker} />
                  <Route path="/:id" component={TrackerProject} />
               </Route>
               <Route path="/users">
                  <Route path="/" component={Users} />
               </Route>
               <Route path="/classification">
                  <Route path="/" component={Classification} />
               </Route>
               <Route path="/events">
                  <Route path="/" component={Events} />
               </Route>
               <Route path="/environment">
                  <Route path="/" component={Environment} />
               </Route>
               <Route path="/action">
                  <Route path="/" component={Action} />
               </Route>
               <Route path="/project">
                  <Route path="/" component={Project} />
               </Route>
               <Route path="/ticket">
                  <Route path="/current" component={Ticket} />
               <Route path="/done" component={DoneTicket} />
               </Route>
               <Route path="/department">
                  <Route path="/" component={Department} />
               </Route>

               <Route path="*" component={Nopage} />
 
    </Router>
), root!)
