import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
  Button,
} from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import ReportAll from "./ReportAll";
import ReportNG from "./ReportNG";
import ReportDelay from "./ReportDelay";
import { BiRefresh } from 'react-icons/bi'
import { HiDocumentReport } from "react-icons/hi";
import { TiExport } from 'react-icons/ti'

const reportList = [
  { id: 1, name: "Report รวม(ร้องขอ-เบิก-จัดเก็บ)" },
  { id: 2, name: "Report การตรวจสอบ die ก่อนจัดเก็บ (DIE NG)" },
  { id: 3, name: "Report Delay" },
];

function ReportForm() {
  const [startDate, setstartDate] = useState(null);
  const [endDate, setendDate] = useState(null);
  const [jobStart, setjobStart] = useState(null);
  const [dieList, setdieList] = useState([]);
  const [currRptOpt, setcurrRptOpt] = useState(1);
  const [isLoading, setisLoading] = useState(true);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const jobRef = useRef(null);
  const tableRef = useRef(null);

  function viewReport() {
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
            startDate={startDate}
            endDate={endDate}
            jobStart={jobStart}
          />
        );
      case 2:
        let dieNGList = dieList.filter((die) => die.status === "รับคืนแล้ว");
        return (
          <ReportNG
            list={dieNGList}
            startDate={startDate}
            endDate={endDate}
            jobStart={jobStart}
          />
        );
      case 3:
        let dieDelay = dieList.filter((die) => die.status === "จ่ายแล้ว");
        return (
          <ReportDelay
            list={dieDelay}
            startDate={startDate}
            endDate={endDate}
            jobStart={jobStart}
          />
        );
      default:
        break;
    }
  }

  function handleRefresh() {
    setjobStart(null);
    setstartDate(null);
    setendDate(null);
    startDateRef.current.value = "";
    endDateRef.current.value = "";
    jobRef.current.value = "";
  }

  return (
    <Container>
      <h1>Report Die System</h1>

      <div>
        <Card>
          <Card.Body>
            <Row>
              <Col lg={4}>
                <FormGroup>
                  <label>ตั้งแต่วันที่</label>
                  <Form.Control
                    ref={startDateRef}
                    type="date"
                    onChange={(e) =>
                      setstartDate(moment(e.target.value).format("DD/MM/YYYY"))
                    }
                    // isInvalid={startDate ? false : true}
                  ></Form.Control>
                  {/* {startDate ? null : (
                    <label style={styles.textAlert}>
                      *กรุณาระบุวันที่เริ่มต้น
                    </label>
                  )} */}
                </FormGroup>
              </Col>
              <Col lg={4}>
                <FormGroup>
                  <label>ถึงวันที่</label>
                  <Form.Control
                    ref={endDateRef}
                    type="date"
                    onChange={(e) =>
                      setendDate(moment(e.target.value).format("DD/MM/YYYY"))
                    }
                    // isInvalid={endDate ? false : true}
                  ></Form.Control>
                  {/* {endDate ? null : (
                    <label style={styles.textAlert}>
                      *กรุณาระบุวันที่สิ้นสุด
                    </label>
                  )} */}
                </FormGroup>
              </Col>
              <Col lg={2}>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => handleRefresh()}
                >
                  <BiRefresh size={20}/> รีเฟรช
                </Button>
              </Col>
            </Row>
            <Row>
              <Col lg={4}>
                <FormGroup>
                  <label>Job No.</label>
                  <Form.Control
                    ref={jobRef}
                    type="text"
                    maxLength={10}
                    onChange={(e) => setjobStart(e.target.value.toUpperCase())}
                    autoFocus={true}
                    // isInvalid={jobStart ? false : true}
                  ></Form.Control>
                  {/* {jobStart ? null : (
                    <label style={styles.textAlert}>
                      *กรุณาระบุหมายเลข job
                    </label>
                  )} */}
                </FormGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row>
          <Col>StartDate:{startDate}</Col>
          <Col>EndDate:{endDate}</Col>
          <Col>Job No.: {jobStart}</Col>
          <Col></Col>
        </Row>

        <Card>
          <Card.Body>
            <fieldset>
              <Form.Group>
                {reportList.map((list, idx) => (
                  <Col key={idx}>
                    <Form.Check
                      type="radio"
                      label={list.name}
                      name="formHorizontalRadios"
                      id="formHorizontalRadios1"
                      onChange={() => setcurrRptOpt(list.id)}
                      defaultValue={1}
                    />
                  </Col>
                ))}
              </Form.Group>
            </fieldset>
          </Card.Body>
        </Card>
        <Button onClick={() => viewReport()}><HiDocumentReport size={20}/> เรียกดูรายงาน</Button>
        <Button variant="success"><TiExport size={20}/> Export File</Button>
      </div>

      {isLoading ? (
        <h4 ref={tableRef}>กรุณากรอกข้อมูลเพื่อดูรายงาน</h4>
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
