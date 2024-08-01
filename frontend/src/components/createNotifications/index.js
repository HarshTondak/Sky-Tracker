import { Form, Formik, Field, ErrorMessage } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function CreateNotifications() {
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();

  const notificationInfo = {
    flight_id: "",
    message: "",
  };

  const [notification, setNotification] = useState(notificationInfo);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { flight_id, message } = notification;

  const handleNotificationChange = (e) => {
    const { name, value } = e.target;
    setNotification({ ...notification, [name]: value });
  };

  const notificationValidation = Yup.object({
    flight_id: Yup.string().required("Flight ID is required."),
    message: Yup.string()
      .required("Message is required.")
      .min(10, "Message must be at least 10 characters long.")
      .max(150, "Message cannot exceed 150 characters."),
  });

  const notificationSubmit = async () => {
    try {
      setLoading(true);
      // Generate the current timestamp
      const timestamp = new Date().toISOString();

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/notifications/create`,
        {
          flight_id,
          message,
          timestamp,
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
    <div className="createNotification">
      <div className="notification_header">
        <span>Create New Notification</span>
      </div>

      <Formik
        enableReinitialize
        initialValues={{
          flight_id,
          message,
        }}
        validationSchema={notificationValidation}
        onSubmit={notificationSubmit}
      >
        {(formik) => (
          <Form>
            <div className="form_row">
              <div className="input_wrap">
                <label htmlFor="flight_id">Flight ID</label>
                <Field
                  type="text"
                  name="flight_id"
                  value={notification.flight_id}
                  onChange={handleNotificationChange}
                />
                <ErrorMessage
                  name="flight_id"
                  component="div"
                  className="error_text"
                />
              </div>
            </div>

            <div className="form_row">
              <div className="input_wrap">
                <label htmlFor="message">Message</label>
                <Field
                  as="textarea"
                  name="message"
                  value={notification.message}
                  onChange={handleNotificationChange}
                  className="messageArea"
                />
                <div className="character-count">
                  {notification.message.length}/150 characters
                </div>
                <ErrorMessage
                  name="message"
                  component="div"
                  className="error_text"
                />
              </div>
            </div>

            <button type="submit" className="blue_btn" disabled={loading}>
              {loading ? (
                <PulseLoader color="#fff" size={10} />
              ) : (
                "Create Notification"
              )}
            </button>

            {error && <div className="error_text">{error}</div>}
            {success && <div className="success_text">{success}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
}
