import { useRef } from "react";
import Header from "../../components/header";
import "./style.css";
import Flight from "../../components/flight";

export default function Home() {
  const middle = useRef(null);

  return (
    <div className="home">
      <Header />
      <Flight />
      <div className="home_middle" ref={middle}></div>
    </div>
  );
}
