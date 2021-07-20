import "./App.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/Login";
import DieRequest from "./components/DieRequest/DieRequest";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { AiFillEdit } from "react-icons/ai";
import { AuthContext } from "./Context/AuthContext";
import { useMemo } from "react";
import IssueDie from "./components/IssueDie/IssueDie";
import { useEffect } from "react";
import ReportForm from "./components/Report/ReportForm";
import User from "./components/User/User";
import CreateUser from "./components/User/CreateUser";
import EditUser from "./components/User/EditUser";
import Die from "./components/Die/Die";
import CreateDie from "./components/Die/CreateDie";
import EditDie from "./components/Die/EditDie";

function App() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [userToken, setuserToken] = useState(
    JSON.parse(localStorage.getItem("userToken"))
  );

  useEffect(() => {
    if (userToken !== null) {
      setIsSignIn(false);
    } else {
      setIsSignIn(true);
    }
    console.log("signIn:" + isSignIn);
    console.log("token:", userToken);
  }, [isSignIn, userToken]);

  function handleLogout() {
    setIsSignIn(true);
    localStorage.clear();
    setuserToken(null);
  }

  // Auth context
  const authContext = useMemo(
    () => ({
      signIn: () => {
        setIsSignIn(false);
        setuserToken(JSON.parse(localStorage.getItem("userToken")));
      },
      // signOut: () => {
      //   setIsSignIn(true);
      //   setuserToken(null);
      //   localStorage.clear();
      // },
      userid: userToken,
    }),
    [userToken]
  );

  return (
    <AuthContext.Provider value={authContext}>
      <Router>
        {isSignIn ? (
          <Login />
        ) : (
          <div>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="/">Die-System</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link href="/die-request">เบิก Die</Nav.Link>
                {userToken === null ? null : userToken[4] === 1 ? (
                  <>
                    <Nav.Link href="/issue">จ่าย Die</Nav.Link>
                    <Nav.Link href="/report">รายงาน</Nav.Link>
                  </>
                ) : null}
              </Nav>
              {userToken === null ? (
                <Nav>
                  <Nav.Link href="/">เข้าสู่ระบบ</Nav.Link>
                </Nav>
              ) : (
                <Nav>
                  <Navbar.Brand>
                    ชื่อผู้ใช้: {userToken[0]}, Shift: {userToken[2]}
                  </Navbar.Brand>
                  <NavDropdown
                    title={"ตั้งค่า"}
                    id="basic-nav-dropdown"
                    alignRight
                  >
                    {userToken[4] === 1 ? (
                      <>
                        <NavDropdown.Item href="/user">
                          <AiFillEdit /> จัดการผู้ใช้
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/die-mgnt">
                          <AiFillEdit /> จัดการ Die
                        </NavDropdown.Item>
                      </>
                    ) : null}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => handleLogout()}>
                      <BiLogOut color="#ff0000" />{" "}
                      <label style={{ color: "red" }}>ออกจากระบบ</label>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              )}
            </Navbar>
            <div style={styles.body}>
              <Switch>
                <Route exact path="/" component={DieRequest} />
                <Route path="/die-request" component={DieRequest} />
                <Route path="/issue" component={IssueDie} />
                <Route path="/report" component={ReportForm} />
                <Route path="/login" component={Login} />
                <Route path="/user" component={User} />
                <Route path="/user-create" component={CreateUser} />
                <Route path="/user-edit/:id" component={EditUser} />
                <Route path="/die-mgnt" component={Die} />
                <Route path="/die-create" component={CreateDie} />
                <Route path="/die-edit/:id" component={EditDie} />
              </Switch>
            </div>
          </div>
        )}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

const styles = {
  body: {
    margin: 15,
  },
};
