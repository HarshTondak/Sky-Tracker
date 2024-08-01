import Header from "../../components/header";
import "./style.css";
import AddFlights from "../../components/addFlights";
import "react-loading-skeleton/dist/skeleton.css";
import CreateNotifications from "../../components/createNotifications";

export default function Profile() {
  return (
    <div className="profile">
      <Header />
      <div className="adminInputs">
        <AddFlights />
        <CreateNotifications />
      </div>
    </div>
  );
}
