import React from "react";
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

const reportList = [
  { id: 1, name: "Report รวม(ร้องขอ-เบิก-จัดเก็บ)" },
  { id: 2, name: "Report การตรวจสอบ die ก่อนจัดเก็บ (DIE NG)" },
  { id: 3, name: "Report Delay" },
];

function ReportForm() {
  return (
    <Container>
      <h1>Report Die System</h1>

      <Card>
        <Card.Body>
          <Row>
            <Col>
              <FormGroup>
                <label>Start Date</label>
                <Form.Control type="date"></Form.Control>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label>End Date</label>
                <Form.Control type="date"></Form.Control>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label>Job Start</label>
                <Form.Control
                  type="text"
                  maxLength={10}
                  autoFocus={true}
                ></Form.Control>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label>Job End</label>
                <Form.Control type="text" maxLength={10}></Form.Control>
              </FormGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

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
                  />
                </Col>
              ))}
            </Form.Group>
          </fieldset>
        </Card.Body>
      </Card>
      <Button>เรียกดูรายงาน</Button>
      <Button>Export File</Button>
    </Container>
  );
}

export default ReportForm;
