import React, { useRef, useState } from "react";
import {
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import ReportAll from "./ReportAll";
import ReportNG from "./ReportNG";
import ReportDelay from "./ReportDelay";
import ReportDieInActive from "./ReportDieInActive";
import { BiRefresh } from "react-icons/bi";
import { HiDocumentReport } from "react-icons/hi";
import { BeatLoader } from "halogenium";
import ReactDatePicker from "react-date-picker";

const reportList = [
  { id: 1, name: "Report รวม(ร้องขอ-เบิก-จัดเก็บ)" },
  { id: 2, name: "Report การตรวจสอบ die ก่อนจัดเก็บ (DIE NG)" },
  { id: 3, name: "Report Delay" },
  { id: 4, name: "Report Die ไม่เคลื่อนไหว" },
];

function ReportForm() {
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [jobStart, setjobStart] = useState("");
  const [dieZone, setdieZone] = useState("");
  const [dieList, setdieList] = useState([]);
  const [currRptOpt, setcurrRptOpt] = useState(1);
  const [currActiveBtn, setcurrActiveBtn] = useState(0);
  const [Duration, setDuration] = useState(null);
  const [currNGOpt, setcurrNGOpt] = useState("all");
  const [isLoading, setisLoading] = useState("initial");
  const jobRef = useRef(null);
  const dieZoneRef = useRef(null);
  const tableRef = useRef(null);

  function viewReport() {
    console.log("form: " + startDate, endDate);
    setisLoading(true);
    axios
      .get("http://192.168.2.13:4002/die-usage/")
      .then((res) => {
        setdieList(res.data);
        setisLoading(false);
      })
      .catch((err) => console.log(err));

    tableRef.current.scrollIntoView();
  }

  function renderTable() {
    switch (currRptOpt) {
      case 1:
        return (
          <ReportAll
            list={dieList}
            startDate={moment(startDate).format()}
            endDate={moment(endDate).format()}
            jobStart={jobStart}
          />
        );
      case 2:
        let dieNGList = dieList.filter((die) => die.status === "รับคืนแล้ว");
        return (
          <ReportNG
            list={dieNGList}
            startDate={moment(startDate).format()}
            endDate={moment(endDate).format()}
            jobStart={jobStart}
            ng={currNGOpt}
          />
        );
      case 3:
        let dieDelay = dieList.filter((die) => die.status === "จ่ายแล้ว");
        return (
          <ReportDelay
            list={dieDelay}
            startDate={moment(startDate).format()}
            endDate={moment(endDate).format()}
            jobStart={jobStart}
          />
        );
      case 4:
        let tmpStartDate;
        let tmpEndDate = moment().format();
        switch (Duration) {
          case "days":
            tmpStartDate = moment().add(-1, Duration).format();
            break;
          case "weeks":
            tmpStartDate = moment().add(-1, Duration).format();
            break;
          case "months":
            tmpStartDate = moment().add(-1, Duration).format();
            break;
          default:
            tmpStartDate = moment(startDate).format();
            tmpEndDate = moment(endDate).format();
            break;
        }

        return (
          <ReportDieInActive
            list={dieList}
            startDate={tmpStartDate}
            endDate={tmpEndDate}
            dieZone={dieZone}
          />
        );
      default:
        break;
    }
  }

  function handleRefresh() {
    setjobStart("");
    setdieZone("")
    setstartDate(null);
    setendDate(null);
    setcurrNGOpt("all");
    setcurrActiveBtn(null);
    setcurrRptOpt(1);
    setisLoading("initial");
  }

  function handleNGOptionChange(e) {
    setcurrNGOpt(e.target.value);
    // setisLoading(true);
  }

  function handleBtnChange(activeBtn, duration) {
    // console.log(activeBtn, duration);
    setcurrActiveBtn(activeBtn);
    setDuration(duration);
  }

  function handleDateChange(date, dateType) {
    // console.log(date);
    if (dateType === "start") {
      setstartDate(date);
    } else {
      setendDate(date);
    }
  }

  function handleRptOptionChange(rptId) {
    setcurrRptOpt(rptId);
  }

  return (
    <Container>
      <h1>
        <HiDocumentReport size={40} />
        Report Die System
      </h1>

      <div>
        <Row>
          <Col lg={6}>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <FormGroup>
                      <label>ตั้งแต่วันที่</label>
                      <br />
                      <ReactDatePicker
                        onChange={(date) => handleDateChange(date, "start")}
                        value={startDate}
                        format="dd/MM/yyyy"
                      />
                      {/* {startDate ? null : (
                    <label style={styles.textAlert}>
                      *กรุณาระบุวันที่เริ่มต้น
                    </label>
                  )} */}
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <label>ถึงวันที่</label>
                      <br />
                      <ReactDatePicker
                        onChange={(date) => handleDateChange(date, "end")}
                        value={endDate}
                        format="dd/MM/yyyy"
                      />
                      {/* {endDate ? null : (
                    <label style={styles.textAlert}>
                      *กรุณาระบุวันที่สิ้นสุด
                    </label>
                  )} */}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  {currRptOpt === 4 ? (
                    <Col lg={4}>
                      <FormGroup>
                        <label>Die Zone</label>
                        <Form.Control
                          ref={dieZoneRef}
                          type="text"
                          onChange={(e) =>
                            setdieZone(e.target.value.toUpperCase())
                          }
                          value={dieZone}
                          autoFocus={true}
                        ></Form.Control>
                      </FormGroup>
                    </Col>
                  ) : (
                    <Col lg={8}>
                      <FormGroup>
                        <label>Job No.</label>
                        <Form.Control
                          ref={jobRef}
                          type="text"
                          maxLength={10}
                          onChange={(e) =>
                            setjobStart(e.target.value.toUpperCase())
                          }
                          value={jobStart}
                          autoFocus={true}
                        ></Form.Control>
                      </FormGroup>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={5}>
            <Card>
              <Card.Body>
                <fieldset>
                  <Form.Group>
                    {reportList.map((list, idx) => (
                      <Row key={idx}>
                        <Col>
                          <Form.Check
                            type="radio"
                            label={list.name}
                            name="formHorizontalRadios"
                            id="formHorizontalRadios1"
                            onChange={() => handleRptOptionChange(list.id)}
                          />
                        </Col>
                      </Row>
                    ))}
                  </Form.Group>
                </fieldset>
                {currRptOpt === 2 ? (
                  <Col lg={5}>
                    <FormGroup>
                      <Form.Control
                        as="select"
                        onChange={(e) => handleNGOptionChange(e)}
                      >
                        <option value="all">ดูทั้งหมด</option>
                        <option value="NG-Only">เฉพาะ NG</option>
                      </Form.Control>
                    </FormGroup>
                  </Col>
                ) : null}
                {currRptOpt === 4 ? (
                  <ButtonGroup size="sm">
                    <Button
                      variant="secondary"
                      active={currActiveBtn === 1 ? true : false}
                      onClick={() => handleBtnChange(1, "days")}
                    >
                      1 วัน
                    </Button>
                    <Button
                      variant="secondary"
                      active={currActiveBtn === 2 ? true : false}
                      onClick={() => handleBtnChange(2, "weeks")}
                    >
                      1 สัปดาห์
                    </Button>
                    <Button
                      variant="secondary"
                      active={currActiveBtn === 3 ? true : false}
                      onClick={() => handleBtnChange(3, "months")}
                    >
                      1 เดือน
                    </Button>
                  </ButtonGroup>
                ) : null}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={1}>
            <Button size="sm" variant="info" onClick={() => handleRefresh()}>
              <BiRefresh size={20} /> รีเฟรช
            </Button>
          </Col>
        </Row>

        <Row style={{ marginTop: "10px" }}>
          <Col>StartDate: {moment(startDate).format("DD/MM/yyyy")}</Col>
          <Col>EndDate: {moment(endDate).format("DD/MM/yyyy")}</Col>
          <Col>Job No: {jobStart}</Col>
          <Col>DieZone: {dieZone}</Col>
          <Col></Col>
        </Row>

        <Button onClick={() => viewReport()}>
          <HiDocumentReport size={20} /> เรียกดูรายงาน
        </Button>
      </div>

      {isLoading === "initial" ? (
        <h4 ref={tableRef}>กรุณากรอกข้อมูลเพื่อดูรายงาน</h4>
      ) : isLoading ? (
        <BeatLoader color="#26A65B" margin="4px" size="16px" />
      ) : (
        <div ref={tableRef}>{renderTable()}</div>
      )}
    </Container>
  );
}

export default ReportForm;

const styles = {
  textAlert: {
    color: "red",
    fontSize: 12,
    marginBottom: 0,
  },
};
