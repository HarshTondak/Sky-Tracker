import Header from "../../components/header";
import "./style.css";
import Flight from "../../components/flight";

export default function Home() {
  return (
    <div className="home">
      <Header />
      <Flight />
    </div>
  );
}
