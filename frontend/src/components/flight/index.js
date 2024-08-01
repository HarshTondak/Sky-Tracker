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
  const [notifications, setNotifications] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFlightId(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    const fID = flightId.trim().replace(/ /g, "-");
    const url = `${process.env.REACT_APP_BACKEND_URL}/flights/${fID}`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSearchPerformed(true);
      setFlightData(data.flight);
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Error details:", error);
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
        <div className="search-area">
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
      </div>

      {loading && (
        <div className="loader-section">
          <PulseLoader color="#1876f2" loading={loading} size={15} />
        </div>
      )}

      {error && <div className="error-text">{error}</div>}

      {flightData && (
        <div className="flight-details">
          <div className="flight-details-row">
            <div className="detail-box">
              <strong>Flight ID:</strong> {flightData.flight_id}
            </div>
            <div className="detail-box">
              <strong>Airline:</strong> {flightData.airline}
            </div>
            <div className="detail-box">
              <strong>Departure Gate:</strong> {flightData.departure_gate}
            </div>
            <div className="detail-box">
              <strong>Arrival Gate:</strong> {flightData.arrival_gate}
            </div>
            <div className="detail-box">
              <strong>Status:</strong> {flightData.status}
            </div>
          </div>
          <div className="flight-details-row">
            <div className="detail-box">
              <strong>Scheduled Departure:</strong>{" "}
              {new Date(flightData.scheduled_departure).toLocaleString()}
            </div>
            <div className="detail-box">
              <strong>Scheduled Arrival:</strong>{" "}
              {new Date(flightData.scheduled_arrival).toLocaleString()}
            </div>
            <div className="detail-box">
              <strong>Actual Departure:</strong>{" "}
              {flightData.actual_departure
                ? new Date(flightData.actual_departure).toLocaleString()
                : "N/A"}
            </div>
            <div className="detail-box">
              <strong>Actual Arrival:</strong>{" "}
              {flightData.actual_arrival
                ? new Date(flightData.actual_arrival).toLocaleString()
                : "N/A"}
            </div>
          </div>
        </div>
      )}

      {searchPerformed && (
        <div className="notifications-container">
          <h2>Notifications</h2>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.notification_id}
                className="notification-box"
              >
                <p className="notification-message">{notification.message}</p>
                <p className="notification-timestamp">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      )}
    </div>
  );
}
