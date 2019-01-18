import React, { Component } from "react";
import "./App.css";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import {
  Form,
  FormGroup,
  FormControl,
  Col,
  ControlLabel,
  Image
} from "react-bootstrap";
import { FieldGroup } from "react-bootstrap";
import axios from "axios";
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ref = React.createRef();

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      employees: [],
      searchList: [],
      addContactForm: false,
      btnValue: "Submit",
      show: false,
      editIndex: undefined,
      search: "",
      data: [],
      selectedData:[],
      data_search: "",
      showData: true
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
    this.onSearchData = this.onSearchData.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  shouldComponentUpdate() {
    console.log("App: shouldComponentUpdate");
    return true;
  }

  componentDidUpdate() {
    console.log("App: componentDidUpdate");
    console.log(this.state.employees);
  }

  componentDidMount() {
  }

  onSearchData() {
    axios
      .get("https://api.unsplash.com/search/photos", {
        params: { query: this.state.data_search },
        headers: {
          Authorization:
            "Client-ID c94079fa3fdda6ffb6ccee0720b80531ef1329d73bbcea2a44e2622b24c46dec"
        }
      },
        this.setState({ showData: false })
      )
      .then(response => {
        this.setState({ showData: true })
        this.setState({ data: response.data.results });
      });
  }

  handleInputs(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  handleShow = (index) => {
    console.log("Its working!");
    this.setState({ show: true });
    console.log(index);
    console.log(this.state.data[index]);
    this.setState({selectedData: this.state.data[index]})
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    console.log(typeof (this.state.data));
    console.log(this.state.data);
    console.log(this.state.selectedData);
    
    return (
      <div>
        <div className="App">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <div>
                    <div className="static-modal">
                      <div>
                        <Modal show={this.state.show} onHide={this.handleClose}>
                          <Modal.Header closeButton>
                            <Modal.Title> Product Details </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form horizontal>
                              <FormGroup controlId="formHorizontalEmail">
                                <Col componentClass={ControlLabel} sm={3}>
                                  Product Name
                                </Col>
                                <Col sm={9}>
                                    "ABC"
                                </Col>
                              </FormGroup>
                            </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={this.handleClose}>Close</Button>
                            <Button
                              type="submit"
                              onClick={this.addEmployee}
                              bsStyle="primary"
                            >
                              <span className="glyphicon glyphicon-plus"> </span>
                              Add to Cart
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />
        <br />
        <div className="App">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h4>
                  API Datatable (Enter <strong>Any Word </strong> of your choice!)
                </h4>
                <div className="App">
                  <input
                    type="text"
                    className="input"
                    placeholder="Search..."
                    name="search"
                    className="form-control"
                    aria-describedby="search"
                    value={this.state.data_search}
                    onChange={e =>
                      this.setState({ data_search: e.target.value })
                    }
                  />
                  <ul />
                </div>

                <td>
                  <p data-placement="top" data-toggle="tooltip" title="Add">
                    <button
                      onClick={this.onSearchData}
                      className="btn btn-warning btn-xs"
                      data-title="Add"
                      data-toggle="modal"
                      data-target="#add"
                    >
                      Search
                    </button>
                  </p>
                </td>

                {
                  !this.state.showData ?
                    <div>
                      <br /> <br /><br /><br /><br />
                      <div class="ui active centered inline loader"></div></div> :

                    <div className="col-md-12">
                      {this.state.data.map((response, index) => {
                        console.log(response);
                        return (
                          <img
                            style={{ padding: "4px", borderRadius: '50%' }}
                            className="ui medium circular image"
                            src={response.urls.regular}
                            height="200px"
                            width="200px"
                            onClick={this.handleShow}
                          />
                        );
                      })}
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
