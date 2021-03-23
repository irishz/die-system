import "./App.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/Login";
import DieRequest from "./components/DieRequest";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar } from "react-bootstrap";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { AuthContext } from "./Context/AuthContext";
import { useMemo } from "react";
import IssueDie from "./components/IssueDie/IssueDie";
import { useEffect } from "react";
import ReportForm from "./components/Report/ReportForm";

function App() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [userToken, setuserToken] = useState(
    JSON.parse(localStorage.getItem("userToken"))
  );

  useEffect(() => {
    if (userToken) {
      setIsSignIn(false);
    }
    console.log("signIn:" + isSignIn);
    console.log(userToken);
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
                <Nav.Link href="/die-request">Request Die</Nav.Link>
                {userToken === null ? null : userToken[4] === 1 ? (
                  <>
                    <Nav.Link href="/issue">Issue Die</Nav.Link>
                    <Nav.Link href="/report">Report</Nav.Link>
                  </>
                ) : null}
              </Nav>
              {userToken === null ? (
                <Nav>
                  <Nav.Link href="/login">Login</Nav.Link>
                </Nav>
              ) : (
                <Nav>
                  <Navbar.Brand>
                    User: {userToken[0]}, Shift: {userToken[2]}
                  </Navbar.Brand>
                  <Nav.Link onClick={handleLogout}>
                    Logout
                    <BiLogOut />
                  </Nav.Link>
                </Nav>
              )}
            </Navbar>
            <div className="container">
              <Switch>
                <Route exact path="/" component={DieRequest} />
                <Route path="/login" component={Login} />
                <Route path="/die-request" component={DieRequest} />
                <Route path="/issue" component={IssueDie} />
                <Route path="/report" component={ReportForm} />
              </Switch>
            </div>
          </div>
        )}
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
