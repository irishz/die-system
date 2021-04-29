import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import MyStyles from "../../App.css";
import desk from "../Location/information-desk.png";

function Location(params) {
  const [zoneList, setzoneList] = useState([]);
  const [locdie, setlocdie] = useState("");
  const [activeZone, setactiveZone] = useState("");

  useLayoutEffect(() => {
    axios
      .get("http://192.168.2.13:4002/zone")
      .then((res) => setzoneList(res.data))
      .catch((err) => console.log(err));
    // return () => {
    //   cleanup
    // };
    console.log(params.job);
  }, []);

  useEffect(() => {
    axios
      .get("http://192.168.2.13/api/getitemlocdie/" + params.job)
      .then((res) => setlocdie(res.data.Uf_Loc_die))
      .catch((err) => console.log(err));
    // active location
    switch (locdie.length) {
      case 5:
        setactiveZone(locdie.substring(0, 2));
        break;
      case 4:
        setactiveZone(locdie.substring(0, 1));
        break;
      default:
        setactiveZone(locdie.substring(0, 1));
        break;
    }
    // return () => {
    //   cleanup
    // }
  }, [locdie, params.job]);

  return (
    <Container>
      <h3>Location Die: {locdie}</h3>

      {/* Group Zone 1 */}
      <Row style={{ marginTop: 10, marginBottom: 10 }}>
        <Col lg={3}>
          <div style={styles.issueDie}>
            <label>โต๊ะจ่าย Die</label>
            <img src={desk} alt="" className="desk-img" width="70" />
          </div>
        </Col>
        {zoneList
          .filter((zone) => zone.group === 1 && zone.seq <= 6)
          .map((zone, idx) => (
            <Col
              className={activeZone === zone.zone ? "blob" : null}
              style={activeZone === zone.zone ? styles.active : styles.Inactive}
              key={idx}
            >
              {zone.zone}
            </Col>
          ))}

        <Col>
          <Row style={{ display: "flex", flexDirection: "column" }}>
            {zoneList
              .filter(
                (zone) => zone.group === 1 && zone.seq >= 7 && zone.seq <= 8
              )
              .map((zone, idx) => (
                <Col
                  className={activeZone === zone.zone ? "blob" : null}
                  key={idx}
                  style={
                    activeZone === zone.zone ? styles.active : styles.Inactive
                  }
                >
                  {zone.zone}
                </Col>
              ))}
          </Row>
        </Col>
      </Row>

      {/* Group Zone 2 */}
      <Row style={{ marginTop: 10, marginBottom: 10 }}>
        <Col lg={3}></Col>
        <Col style={{ marginRight: 10 }}>
          <Row style={{ display: "flex", flexDirection: "column" }}>
            {zoneList
              .filter(
                (zone) => zone.group === 2 && zone.seq >= 9 && zone.seq <= 10
              )
              .map((zone, idx) => (
                <Col
                  className={activeZone === zone.zone ? "blob" : null}
                  key={idx}
                  style={
                    activeZone === zone.zone ? styles.active : styles.Inactive
                  }
                >
                  {zone.zone}
                </Col>
              ))}
          </Row>
        </Col>

        {zoneList
          .filter(
            (zone) => zone.group === 2 && zone.seq >= 11 && zone.seq <= 12
          )
          .map((zone, idx) => (
            <Col
              className={activeZone === zone.zone ? "blob" : null}
              style={activeZone === zone.zone ? styles.active : styles.Inactive}
              key={idx}
            >
              {zone.zone}
            </Col>
          ))}

        <Col style={{ marginRight: 10 }}>
          <Row style={{ display: "flex", flexDirection: "column" }}>
            {zoneList
              .filter(
                (zone) => zone.group === 2 && zone.seq >= 13 && zone.seq <= 14
              )
              .map((zone, idx) => (
                <Col
                  className={activeZone === zone.zone ? "blob" : null}
                  key={idx}
                  style={
                    activeZone === zone.zone ? styles.active : styles.Inactive
                  }
                >
                  {zone.zone}
                </Col>
              ))}
          </Row>
        </Col>
        <Col style={{ marginRight: 10 }}>
          <Row style={{ display: "flex", flexDirection: "column" }}>
            {zoneList
              .filter(
                (zone) => zone.group === 2 && zone.seq >= 15 && zone.seq <= 16
              )
              .map((zone, idx) => (
                <Col
                  className={activeZone === zone.zone ? "blob" : null}
                  key={idx}
                  style={
                    activeZone === zone.zone ? styles.active : styles.Inactive
                  }
                >
                  {zone.zone}
                </Col>
              ))}
          </Row>
        </Col>
      </Row>

      {/* Group Zone 3 */}
      <Row style={{ marginTop: 10, marginBottom: 10 }}>
        <Col lg={3} style={{ height: 80 }}></Col>
        {zoneList
          .filter((zone) => zone.group === 3 && zone.seq >= 17)
          .map((zone, idx) => (
            <Col
              className={activeZone === zone.zone ? "blob" : null}
              style={activeZone === zone.zone ? styles.active : styles.Inactive}
              key={idx}
            >
              {zone.zone}
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default Location;

const styles = {
  active: {
    display: "flex",
    backgroundColor: "#F81E00",
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  Inactive: {
    display: "flex",
    backgroundColor: "#dddddd",
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  twoRow: {
    display: "flex",
    flexDirection: "column",
  },
  issueDie: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};
