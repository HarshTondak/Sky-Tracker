import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DisplayAccessibility from "./DisplayAccessibility";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

export default function UserMenu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(0);

  const logout = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };

  return (
    <div className="mmenu">
      {visible === 0 && (
        <div>
          <div className="mmenu_main hover3">
            <div className="small_circle">
              <i className="report_filled_icon"></i>
            </div>
            <div className="mmenu_col">
              <div className="mmenu_span1">Give feedback</div>
              <div className="mmenu_span2">Help us improve Sky Tracker</div>
            </div>
          </div>
          <div className="mmenu_splitter"></div>

          <div
            className="mmenu_item hover3"
            onClick={() => {
              setVisible(1);
            }}
          >
            <div className="small_circle">
              <i className="dark_filled_icon"></i>
            </div>
            <span>Display & Accessibility</span>
            <div className="rArrow">
              <i className="right_icon"></i>
            </div>
          </div>
          <div
            className="mmenu_item hover3"
            onClick={() => {
              logout();
            }}
          >
            <div className="small_circle">
              <i className="logout_filled_icon"></i>
            </div>
            <span>Logout</span>
          </div>
        </div>
      )}
      {visible === 1 && <DisplayAccessibility setVisible={setVisible} />}
    </div>
  );
}
