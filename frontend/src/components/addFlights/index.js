import { Form, Formik, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function AddFlights() {
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();

  const flightInfos = {
    flight_id: "",
    airline: "",
    status: "",
    departure_gate: "",
    arrival_gate: "",
    scheduled_departure: "",
    scheduled_arrival: "",
    actual_departure: "",
    actual_arrival: "",
  };

  const [flight, setFlight] = useState(flightInfos);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    flight_id,
    airline,
    status,
    departure_gate,
    arrival_gate,
    scheduled_departure,
    scheduled_arrival,
    actual_departure,
    actual_arrival,
  } = flight;

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setFlight({ ...flight, [name]: value });
  };

  const flightValidation = Yup.object({
    flight_id: Yup.string().required("Flight ID is required."),

    airline: Yup.string()
      .required("Airline is required.")
      .min(2, "Airline name must be at least 2 characters.")
      .max(50, "Airline name cannot exceed 50 characters."),

    status: Yup.string().required("Status is required."),

    departure_gate: Yup.string()
      .required("Departure Gate is required.")
      .matches(
        /^[A-Z0-9]{1,5}$/,
        "Gate must be 1-5 alphanumeric characters, all uppercase."
      ),

    arrival_gate: Yup.string()
      .required("Arrival Gate is required.")
      .matches(
        /^[A-Z0-9]{1,5}$/,
        "Gate must be 1-5 alphanumeric characters, all uppercase."
      ),

    scheduled_departure: Yup.date()
      .required("Scheduled Departure is required.")
      .min(new Date(), "Scheduled departure must be in the future."),

    scheduled_arrival: Yup.date()
      .required("Scheduled Arrival is required.")
      .min(
        Yup.ref("scheduled_departure"),
        "Scheduled arrival must be after scheduled departure."
      ),

    actual_departure: Yup.date()
      .nullable()
      .min(
        Yup.ref("scheduled_departure"),
        "Actual departure cannot be before scheduled departure."
      )
      .max(new Date(), "Actual departure cannot be in the future."),

    actual_arrival: Yup.date()
      .nullable()
      .min(
        Yup.ref("actual_departure"),
        "Actual arrival must be after actual departure."
      )
      .max(new Date(), "Actual arrival cannot be in the future."),
  });

  const flightSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/flights/add`,
        {
          flight_id,
          airline,
          status,
          departure_gate,
          arrival_gate,
          scheduled_departure,
          scheduled_arrival,
          actual_departure,
          actual_arrival,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setSuccess(data.message);
      navigate("/admin");
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="addFlight">
      <div className="flight_header">
        <span>Add New Flight</span>
      </div>

      <Formik
        enableReinitialize
        initialValues={{
          flight_id,
          airline,
          status,
          departure_gate,
          arrival_gate,
          scheduled_departure,
          scheduled_arrival,
          actual_departure,
          actual_arrival,
        }}
        validationSchema={flightValidation}
        onSubmit={flightSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form_row">
              <div className="input_wrap">
                <label htmlFor="flight_id">Flight ID</label>
                <Field
                  type="text"
                  name="flight_id"
                  value={flight.flight_id}
                  onChange={handleFlightChange}
                />
                <ErrorMessage
                  name="flight_id"
                  component="div"
                  className="error_text"
                />
              </div>
              <div className="input_wrap">
                <label htmlFor="airline">Airline</label>
                <Field
                  type="text"
                  name="airline"
                  value={flight.airline}
                  onChange={handleFlightChange}
                />
                <ErrorMessage
                  name="airline"
                  component="div"
                  className="error_text"
                />
              </div>
              <div className="input_wrap">
                <label htmlFor="status">Status</label>
                <Field
                  type="text"
                  name="status"
                  value={flight.status}
                  onChange={handleFlightChange}
                />
                <ErrorMessage
                  name="status"
                  component="div"
                  className="error_text"
                />
              </div>
            </div>

            <div className="form_row">
              <div className="input_wrap">
                <label htmlFor="departure_gate">Departure Gate</label>
                <Field
                  type="text"
                  name="departure_gate"
                  value={flight.departure_gate}
                  onChange={handleFlightChange}
                />
                <ErrorMessage
                  name="departure_gate"
                  component="div"
                  className="error_text"
                />
              </div>
              <div className="input_wrap">
                <label htmlFor="arrival_gate">Arrival Gate</label>
                <Field
                  type="text"
                  name="arrival_gate"
                  value={flight.arrival_gate}
                  onChange={handleFlightChange}
                />
                <ErrorMessage
                  name="arrival_gate"
                  component="div"
                  className="error_text"
                />
              </div>
            </div>

            <div className="form_row">
              <div className="input_wrap">
                <label htmlFor="scheduled_departure">Scheduled Departure</label>
                <Field
                  type="datetime-local"
                  name="scheduled_departure"
                  value={flight.scheduled_departure}
                  onChange={handleFlightChange}
                />
                <ErrorMessage
                  name="scheduled_departure"
                  component="div"
                  className="error_text"
                />
              </div>
              <div className="input_wrap">
                <label htmlFor="scheduled_arrival">Scheduled Arrival</label>
                <Field
                  type="datetime-local"
                  name="scheduled_arrival"
                  value={flight.scheduled_arrival}
                  onChange={handleFlightChange}
                />
                <ErrorMessage
                  name="scheduled_arrival"
                  component="div"
                  className="error_text"
                />
              </div>
            </div>

            <div className="form_row">
              <div className="input_wrap">
                <label htmlFor="actual_departure">Actual Departure</label>
                <Field
                  type="datetime-local"
                  name="actual_departure"
                  value={flight.actual_departure}
                  onChange={handleFlightChange}
                />
                <ErrorMessage
                  name="actual_departure"
                  component="div"
                  className="error_text"
                />
              </div>
              <div className="input_wrap">
                <label htmlFor="actual_arrival">Actual Arrival</label>
                <Field
                  type="datetime-local"
                  name="actual_arrival"
                  value={flight.actual_arrival}
                  onChange={handleFlightChange}
                />
                <ErrorMessage
                  name="actual_arrival"
                  component="div"
                  className="error_text"
                />
              </div>
            </div>

            <button type="submit" className="blue_btn" disabled={loading}>
              {loading ? <PulseLoader color="#fff" size={10} /> : "Add Flight"}
            </button>

            {error && <div className="error_text">{error}</div>}
            {success && <div className="success_text">{success}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
}
