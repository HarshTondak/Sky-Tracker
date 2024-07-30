import { useSelector } from "react-redux";
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import "./style.css";

export default function Flight() {
  const { user } = useSelector((state) => ({ ...state }));
  const [flightId, setFlightId] = useState("");
  const [loading, setLoading] = useState(false);
  const [flightData, setFlightData] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFlightId(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    const fID = flightId.trim().replace(/ /g, "-");
    const url = `${process.env.REACT_APP_BACKEND_URL}/flights/${fID}`;
    console.log("Requesting URL:", url); // Log the full URL
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setFlightData(data);
    } catch (error) {
      console.error("Error details:", error); // Log the full error
      setError(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-container">
      <div className="search-section">
        <span className="tagline">
          Your Flight details are 1 Simple Search away..
        </span>
        <input
          type="text"
          placeholder="Enter Flight ID"
          value={flightId}
          onChange={handleInputChange}
          className="flight-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {loading && (
        <div className="loader-section">
          <PulseLoader color="#1876f2" loading={loading} size={15} />
        </div>
      )}

      {error && <div className="error-text">{error}</div>}

      {flightData && (
        <div className="flight-details">
          <table>
            <thead>
              <tr>
                <th>Flight ID</th>
                <th>Airline</th>
                <th>Departure Gate</th>
                <th>Arrival Gate</th>
                <th>Scheduled Departure</th>
                <th>Scheduled Arrival</th>
                <th>Actual Departure</th>
                <th>Actual Arrival</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{flightData.flight_id}</td>
                <td>{flightData.airline}</td>
                <td>{flightData.departure_gate}</td>
                <td>{flightData.arrival_gate}</td>
                <td>
                  {new Date(flightData.scheduled_departure).toLocaleString()}
                </td>
                <td>
                  {new Date(flightData.scheduled_arrival).toLocaleString()}
                </td>
                <td>
                  {flightData.actual_departure
                    ? new Date(flightData.actual_departure).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {flightData.actual_arrival
                    ? new Date(flightData.actual_arrival).toLocaleString()
                    : "N/A"}
                </td>
                <td>{flightData.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
