import { Switch } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
  ButtonGroup,
  ToggleButton,
  Alert,
  Accordion,
} from "react-bootstrap";
import Location from "../Location/Location";
import { useRef } from "react";
import { HiChevronDoubleDown, HiChevronDoubleUp } from "react-icons/hi";
import { RiRefreshLine } from "react-icons/ri";

function IssueDie() {
  const userTokenData = JSON.parse(localStorage.getItem("userToken"));
  const [dieList, setdieList] = useState([]);
  const [activeDieStatus, setactiveDieStatus] = useState("กำลังรอ die");
  const itemRef = useRef(null);
  const locdieRef = useRef(null);
  const [scanItem, setscanItem] = useState("");
  const [scanLocDie, setscanLocDie] = useState("");
  const [Item, setItem] = useState("");
  const [LocDie, setLocDie] = useState("");
  const [job, setjob] = useState("");
  const [issueBtn, setissueBtn] = useState(true);
  const [activeAcdnKey, setactiveAcdnKey] = useState("0");

  const [itemErr, setitemErr] = useState(false);
  const initCheckDie = {
    wood: [
      { name: "แตก", checked: false },
      { name: "ยุบ", checked: false },
      { name: "บิดเบี้ยว", checked: false },
      { name: "ร่องหลวม", checked: false },
      { name: "ไม้ลอก", checked: false },
      { name: "ร่องไม้แตก", checked: false },
    ],
    blade: [
      { name: "แตก", checked: false },
      { name: "บิ่น", checked: false },
      { name: "หาย", checked: false },
      { name: "กาวติด", checked: false },
      { name: "คต", checked: false },
      { name: "สนิม", checked: false },
    ],
  };
  const [checkDie, setcheckDie] = useState(initCheckDie);

  useEffect(() => {
    axios
      .get("http://192.168.2.13:4001/die-usage/")
      .then((res) => setdieList(res.data))
      .catch((err) => console.log(err));
  }, [dieList]);

  function handleFilterDie(e) {
    // console.log(scanItem, scanLocDie);
    if (e.charCode === 13 || e.keyCode === 9) {
      e.preventDefault();
      axios
        .get(
          "http://192.168.2.13/api/checkitemlocdie/" +
            scanItem +
            "/" +
            scanLocDie
        )
        .then((res) => {
          setItem(res.data[0].item);
          setLocDie(res.data[0].Uf_Loc_die);
          setissueBtn(false);
        })
        .catch((err) => {
          setitemErr(true);
          setTimeout(() => {
            setitemErr(false);
          }, 2000);
          setissueBtn(true);
          setscanItem("");
          setscanLocDie("");
        });
    }
  }

  function getDieId() {
    let dieId = null;
    let list = dieList.filter((die) => die.item === scanItem);
    dieId = list[0]._id;

    return dieId;
  }

  function handleIssueDie() {
    let dieId = getDieId();

    console.log(dieId);
    if (dieId) {
      axios
        .put("http://192.168.2.13:4001/die-usage/update/" + dieId, {
          status: "จ่ายแล้ว",
          issuedBy: userTokenData[0],
          issuedAt: moment(),
        })
        .then(() => {
          setItem("");
          setLocDie("");
          setjob("");
          setissueBtn(true);
          itemRef.current.value = "";
          locdieRef.current.value = "";
        })
        .catch((err) => console.log(err));
    }
  }

  function handleRecieve() {
    let dieId = getDieId();

    if (dieId) {
      axios
        .put("http://192.168.2.13:4001/die-usage/update/" + dieId, {
          status: "รับคืนแล้ว",
          recievedBy: userTokenData[0],
          recievedAt: moment(),
          checkDie: checkDie,
        })
        .then(() => {
          setItem("");
          setLocDie("");
          setissueBtn(true);
          setjob("");
          itemRef.current.value = "";
          locdieRef.current.value = "";
          setcheckDie(initCheckDie);
        })
        .catch((err) => console.log(err));
    }
  }

  function onSwitchChange(idx, type) {
    let tempDie = checkDie;
    if (type === "wood") {
      tempDie.wood[idx].checked = !tempDie.wood[idx].checked;
    } else {
      tempDie.blade[idx].checked = !tempDie.blade[idx].checked;
    }
    setcheckDie(tempDie);
  }

  function handleClickJob(job) {
    console.log(job);
    setjob(job);
  }

  function toggleAccordion() {
    if (activeAcdnKey === "1") {
      setactiveAcdnKey("0");
    } else {
      setactiveAcdnKey("1");
    }
  }

  return (
    <Container>
      <Row
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <ButtonGroup toggle>
            {["ทั้งหมด", "กำลังรอ die"].map((radio, idx) => (
              <ToggleButton
                key={idx}
                type="radio"
                name={radio}
                variant="info"
                value={radio}
                checked={radio === activeDieStatus}
                onChange={(e) => setactiveDieStatus(e.currentTarget.value)}
              >
                {radio}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>
        <Button variant="primary" onClick={() => window.location.reload(false)}>
          <RiRefreshLine /> Refresh
        </Button>
      </Row>

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Job</th>
            <th>Part</th>
            <th>Loc Die</th>
            <th>M/C</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {activeDieStatus === "ทั้งหมด"
            ? dieList.map((die, idx) => (
                <tr
                  key={idx}
                  style={
                    die.status === "กำลังรอ die"
                      ? styles.waitDie
                      : styles.issueDie
                  }
                >
                  <td>{idx + 1}</td>
                  <td onDoubleClick={() => handleClickJob(die.job)}>
                    {die.job}
                  </td>
                  <td>{die.item}</td>
                  <td>{die.locdie}</td>
                  <td>{die.mcno}</td>
                  <td>{die.status}</td>
                </tr>
              ))
            : dieList
                .filter((die) => die.status === activeDieStatus)
                .map((die, idx) => (
                  <tr
                    key={idx}
                    style={
                      die.status === "กำลังรอ die"
                        ? styles.waitDie
                        : styles.issueDie
                    }
                  >
                    <td>{idx + 1}</td>
                    <td onDoubleClick={() => handleClickJob(die.job)}>
                      {die.job}
                    </td>
                    <td>{die.item}</td>
                    <td>{die.locdie}</td>
                    <td>{die.mcno}</td>
                    <td>{die.status}</td>
                  </tr>
                ))}
        </tbody>
      </Table>

      <Accordion defaultActiveKey="0" activeKey={activeAcdnKey}>
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            onClick={toggleAccordion}
          >
            {activeAcdnKey === "0" ? "Hide Layout " : "Show Layout "}
            {activeAcdnKey === "0" ? (
              <HiChevronDoubleUp />
            ) : (
              <HiChevronDoubleDown />
            )}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Location job={job} />
              <Row
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: 15,
                }}
              >
                <Col lg={4}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => {
                      itemRef.current.scrollIntoView();
                      itemRef.current.focus();
                    }}
                  >
                    เบิกไปผลิต
                  </Button>
                </Col>
                <Col lg={4}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => locdieRef.current.scrollIntoView()}
                  >
                    เก็บเข้าช่อง
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

      <Row style={styles.section1}>
        <Col>
          <h4>Part No.</h4>
        </Col>
        <Col>
          <h4>Location Die</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Control
            ref={itemRef}
            placeholder="Part No."
            autoFocus={true}
            onChange={(e) => setscanItem(e.target.value)}
          ></Form.Control>
        </Col>
        <Col>
          <Form.Control
            ref={locdieRef}
            placeholder="Loc Die"
            onChange={(e) => setscanLocDie(e.target.value)}
            onKeyPress={(e) => handleFilterDie(e)}
            onKeyDown={(e) => handleFilterDie(e)}
          ></Form.Control>
        </Col>
      </Row>

      <Row style={styles.section1}>
        <Col>
          <Form.Control readOnly={true} value={Item}></Form.Control>
        </Col>
        <Col>
          <Form.Control readOnly={true} value={LocDie}></Form.Control>
        </Col>
      </Row>

      <Row style={{ marginTop: 15 }}>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>จ่าย Die</Card.Title>
            </Card.Header>
            <Card.Body>
              <Button
                style={{ width: "100%" }}
                onClick={handleIssueDie}
                disabled={issueBtn}
                variant={issueBtn ? "secondary" : "primary"}
              >
                เบิกไปผลิต
              </Button>
              {itemErr ? (
                <Alert variant="danger">ข้อมูลไม่ตรงกับในระบบ</Alert>
              ) : null}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>เก็บ Die</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <Card>
                    <Card.Header>ตรวจสอบไม้</Card.Header>
                    <Card.Body>
                      {checkDie.wood.map((wood, idx) => (
                        <Row key={idx}>
                          <Col>{wood.name}</Col>
                          <Col>
                            <Switch
                              checked={checkDie.wood.checked}
                              onChange={() => onSwitchChange(idx, "wood")}
                            ></Switch>
                          </Col>
                        </Row>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>ตรวจสอบมีด</Card.Header>
                    <Card.Body>
                      {checkDie.blade.map((blade, idx) => (
                        <Row key={idx}>
                          <Col>{blade.name}</Col>
                          <Col>
                            <Switch
                              checked={checkDie.blade.checked}
                              onChange={() => onSwitchChange(idx, "blade")}
                            ></Switch>
                          </Col>
                        </Row>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Button
                variant={issueBtn ? "secondary" : "primary"}
                style={{ width: "100%" }}
                disabled={issueBtn}
                onClick={handleRecieve}
              >
                เก็บเข้าช่อง
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default IssueDie;

const styles = {
  section1: {
    marginTop: 15,
    paddingTop: 10,
    borderWidth: 1,
  },
  waitDie: {
    backgroundColor: "#ffc107",
  },
  issueDie: {
    backgroundColor: "#20c997",
  },
};