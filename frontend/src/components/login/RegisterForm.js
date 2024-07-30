import { Form, Formik } from "formik";
import { useState } from "react";
import RegisterInput from "../inputs/registerInput";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ setVisible }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfos = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };

  const [user, setUser] = useState(userInfos);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { first_name, last_name, email, password } = user;

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Password Validation
  // min 8 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
  const passwordRules =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:'",.<>?/\\[\]|]).{8,}$/;

  const registerValidation = Yup.object({
    first_name: Yup.string()
      .required("What's your First name ?")
      .min(2, "Fisrt name must be between 2 and 16 characters.")
      .max(16, "Fisrt name must be between 2 and 16 characters.")
      .matches(/^[aA-zZ]+$/, "Numbers and special characters are not allowed."),
    last_name: Yup.string()
      .required("What's your Last name ?")
      .min(2, "Last name must be between 2 and 16 characters.")
      .max(16, "Last name must be between 2 and 16 characters.")
      .matches(/^[aA-zZ]+$/, "Numbers and special characters are not allowed."),
    email: Yup.string()
      .required("You'll need this when you log in.")
      .email("Enter a valid email address."),
    password: Yup.string()
      .required(
        "Enter a combination of at least 8 numbers and letter(both upper & lower cases)."
      )
      .min(8, "Password must be atleast 8 characters.")
      .max(36, "Password can't be more than 36 characters")
      .matches(passwordRules, "Please create a stronger password"),
  });

  const registerSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        {
          first_name,
          last_name,
          email,
          password,
        }
      );
      setError("");
      setSuccess(data.message);

      const { message, ...rest } = data;
      // The dispatch action
      dispatch({ type: "LOGIN", payload: rest });
      // Set user cookie
      Cookies.set("user", JSON.stringify(rest));
      navigate("/");
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response.data.message);
    }
  };

  return (
    <div className="blur">
      <div className="register">
        <div className="register_header">
          <i className="exit_icon" onClick={() => setVisible(false)}></i>
          <span>Sign Up</span>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
            first_name,
            last_name,
            email,
            password,
          }}
          validationSchema={registerValidation}
          onSubmit={registerSubmit}
        >
          {(formik) => (
            <Form className="register_form">
              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="First name"
                  name="first_name"
                  onChange={handleRegisterChange}
                />
                <RegisterInput
                  type="text"
                  placeholder="Surname"
                  name="last_name"
                  onChange={handleRegisterChange}
                />
              </div>

              <div className="reg_line">
                <RegisterInput
                  type="text"
                  placeholder="Email Address"
                  name="email"
                  onChange={handleRegisterChange}
                />
              </div>

              <div className="reg_line">
                <RegisterInput
                  type="password"
                  placeholder="Secret Password"
                  name="password"
                  onChange={handleRegisterChange}
                />
              </div>

              <div className="reg_btn_wrapper">
                <button className="blue_btn open_signup" disabled={loading}>
                  {loading ? (
                    <PulseLoader color="#fff" size={10} />
                  ) : (
                    "Sign Up!"
                  )}
                </button>
              </div>

              {error && <div className="error_text">{error}</div>}
              {success && <div className="success_text">{success}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
