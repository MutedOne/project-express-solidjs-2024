
import Header from "./Header";
import Sidenav from "./Sidenav";
import "../components/css/dashboard.css"


type BodyProps = {
  children: any
};
    
export default function Body(props:BodyProps) {
 
    return (
      <>
          <Header userdetail={''}/>
            <Sidenav />
          {props.children} 
      </>
    )
}