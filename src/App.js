import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@material-ui/core";
import spacex from "./spacex-Ptd-iTdrCJM-unsplash.jpg";
let token = window.localStorage.getItem("token");
const App = () => {
  const [launches, setLaunches] = useState([]);
  const [rockets, setRockets] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLaunch, setSelectedLaunch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchLaunches();
    fetchRockets();
  }, [token]);

  const fetchLaunches = async () => {
    try {
      const response = await axios.get(
        "https://api.spacexdata.com/v3/launches"
      );
      setLaunches(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRockets = async () => {
    try {
      const response = await axios.get("https://api.spacexdata.com/v3/rockets");
      const rocketData = response.data.reduce((acc, rocket) => {
        acc[rocket.rocket_id] = rocket;
        return acc;
      }, {});
      setRockets(rocketData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleLaunchChange = (event) => {
    setSelectedLaunch(event.target.value === "" ? null : event.target.value);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleOpenPopup = (launch) => {
    setSelectedLaunch(launch);
  };

  const handleClosePopup = () => {
    setSelectedLaunch(null);
  };

  const filteredLaunches = launches.filter((launch) => {
    const statusMatch = selectedStatus
      ? launch.status === selectedStatus
      : true;
    const launchMatch =
      selectedLaunch !== null
        ? selectedLaunch === "true"
          ? launch.original_launch === true
          : launch.original_launch === false
        : true;
    const typeMatch = selectedType
      ? launch.rocket?.rocket_type === selectedType
      : true;

    return statusMatch || launchMatch || typeMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLaunches.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedLaunches = filteredLaunches.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "cornflowerblue",
      }}
    >
      <div id="banner">
        <h1 style={{ textAlign: "center", color: "crimson" }}>
          SpaceXDataCenter
        </h1>
        <img
          src={spacex}
          alt="rocket"
          style={{
            width: "83%",
            height: "500px",
            paddingLeft: "8.5%",
          }}
        />
      </div>
      <div id="spacexlaunch">
        <Container>
          <Paper style={{ padding: "1rem", margin: "2rem 0" }}>
            {/* Banner */}
            <Typography
              variant="h4"
              align="center"
              style={{ marginBottom: "2rem" }}
            >
              SpaceX Launches
            </Typography>

            {/* Search Form */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={selectedStatus} onChange={handleStatusChange}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Original Launch</InputLabel>
                  <Select value={selectedLaunch} onChange={handleLaunchChange}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select value={selectedType} onChange={handleTypeChange}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="rocket">Rocket</MenuItem>
                    <MenuItem value="capsule">Capsule</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Data Grid */}
            <Grid container spacing={2}>
              {displayedLaunches.map((launch) => (
                <Grid item xs={12} sm={6} md={4} key={launch.flight_number}>
                  <Paper
                    style={{ padding: "1rem", cursor: "pointer" }}
                    onClick={() => handleOpenPopup(launch)}
                  >
                    <Typography variant="h6">{launch.mission_name}</Typography>
                    <Typography variant="body2">
                      Status: {launch.status}
                    </Typography>
                    {launch.rocket && (
                      <div>
                        <Typography variant="body2">
                          Rocket: {launch.rocket.rocket_name}
                        </Typography>
                        <Typography variant="body2">
                          Type: {launch.rocket.rocket_type}
                        </Typography>
                        <img
                          src={
                            rockets[launch.rocket.rocket_id]?.flickr_images[0]
                          }
                          alt="Rocket"
                          style={{ width: "100%", marginTop: "0.5rem" }}
                        />
                      </div>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
                Previous Page
              </Button>
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  style={{ marginLeft: "0.5rem" }}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next Page
              </Button>
            </div>
          </Paper>

          {/* Popup */}
          {selectedLaunch && (
            <Paper
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "1rem",
                zIndex: 9999,
              }}
            >
              <Typography variant="h6">
                {selectedLaunch.mission_name}
              </Typography>
              <Typography variant="body2">
                Launch Date: {selectedLaunch.launch_date_utc || "Unknown"}
              </Typography>
              {/* Display additional details as per your requirements */}
              <Button onClick={handleClosePopup} style={{ marginTop: "1rem" }}>
                Close
              </Button>
            </Paper>
          )}
        </Container>
      </div>
    </div>
  );
};

export default App;
