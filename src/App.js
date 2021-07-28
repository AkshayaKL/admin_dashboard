import Dashboard from "./components/admindashboard.component";
import "./App.css";

export function App() {
  return (
    
    <div id = "dashboard" style={{'height':'100%'}}>
 
    <Dashboard totalPages={10} style={{'height':'100%', }}/>
    </div>
  );
}
