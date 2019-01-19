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
import PinchToZoom from 'react-pinch-and-zoom';
import ReactImageMagnify from 'react-image-magnify';
import ReactImageZoom from 'react-image-zoom';
import $ from 'jquery';

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
      selectedData: {},
      data_search: "",
      showData: true,
      selectedQuantity: 0
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

  addToCart = () => {
    var cart = $('.shopping-cart');
    var imgtodrag = $(this).parent('.item').find("img").eq(0);
    if (imgtodrag) {
      var imgclone = imgtodrag.clone()
        .offset({
          top: imgtodrag.offset().top,
          left: imgtodrag.offset().left
        })
        .css({
          'opacity': '0.5',
          'position': 'absolute',
          'height': '150px',
          'width': '150px',
          'z-index': '100'
        })
        .appendTo($('body'))
        .animate({
          'top': cart.offset().top + 10,
          'left': cart.offset().left + 10,
          'width': 75,
          'height': 75
        }, 1000, 'easeInOutExpo');

      setTimeout(function () {
        cart.effect("shake", {
          times: 2
        }, 200);
      }, 1500);

      imgclone.animate({
        'width': 0,
        'height': 0
      }, function () {
        $(this).detach()
      });
    }
  };

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

  increaseQuantity = () => {
    this.setState({ selectedQuantity: this.state.selectedQuantity + 1 })
  }

  decreaseQuantity = () => {
    if (this.state.selectedQuantity !== 0)
      this.setState({ selectedQuantity: this.state.selectedQuantity - 1 })
  }

  handleShow = (index) => {
    this.setState({ show: true });
    console.log(index);
    console.log(this.state.data[index]);
    this.setState({ selectedData: this.state.data[index] })
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    console.log(typeof (this.state.data));
    console.log(this.state.data);
    console.log(this.state.selectedData);
    if (this.state.show === true) {
      var image = this.state.selectedData.urls.regular
      var props = { width: 430, height: 380, zoomWidth: 350, img: image, offset: { vertical: 0, horizontal: 30 }, };
    }

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
                        <Modal show={this.state.show} onHide={this.handleClose} dialogClassName="custom-modal" bsSize="large">
                          <Modal.Header closeButton>
                            <Modal.Title> Product Details </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            {this.state.show === true ?
                              <div className="row padding">
                                <div class="col-md-7 product_img">
                                  <ReactImageZoom {...props} zoomStyle="z-index: 1111" zoomLensStyle="opacity: 0.4;background-color: gray" />
                                  {/* <img src={this.state.selectedData.urls.regular} class="img-responsive"></img> */}
                                </div>
                                <div className="col-md-5 product_content">
                                  <h4><strong>Product Id:</strong> <span>{this.state.selectedData.id}</span></h4>
                                  <div class="rating">
                                    <span class="glyphicon glyphicon-star"></span>
                                    <span class="glyphicon glyphicon-star"></span>
                                    <span class="glyphicon glyphicon-star"></span>
                                    <span class="glyphicon glyphicon-star"></span>
                                    <span class="glyphicon glyphicon-star"></span>
                                    (10 reviews)
                                  </div>
                                  <strong>{this.state.selectedData.description}</strong>

                                  <div className="padding">
                                  <h4><strong>
                                  <span> Price: </span>
                                  <span class="glyphicon glyphicon-usd"></span> 75.00 
                                  </strong></h4>
                                  </div>

                                  <p> Select Quantity </p>
                                  <div className="row padding">
                                    <div class="col-md-6">
                                      <div class="input-group">
                                        <span class="input-group-btn">
                                          <button type="button" class="btn btn-danger btn-number" data-type="minus" onClick={() => this.decreaseQuantity()} data-field="quant[2]">
                                            <span class="glyphicon glyphicon-minus"></span>
                                          </button>
                                        </span>
                                        <input type="text" name="quant[2]" class="form-control input-number" value={this.state.selectedQuantity} min="1" max="100"></input>
                                        <span class="input-group-btn">
                                          <button type="button" class="btn btn-success btn-number" data-type="plus" onClick={() => this.increaseQuantity()} data-field="quant[2]">
                                            <span class="glyphicon glyphicon-plus"></span>
                                          </button>
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <span> Select Size </span>
                                  <div className="row padding" >
                                    <div className="col-md-6">
                                      <select class="form-control" name="select">
                                        <option value="" >Size</option>
                                        <option value="black"> S </option>
                                        <option value="white"> M </option>
                                        <option value="gold"> L </option>
                                        <option value="rose gold"> XL</option>
                                      </select>
                                    </div>
                                  </div>

                                  <span> Select Color </span>
                                  <div className="row paddingColor" >
                                    <div className="col-md-12 ">
                                      <div className="col-md-1 ">
                                        <label className="orange">
                                          <input type="radio" name="color" value="orange"></input>
                                          <div className="layer"></div>
                                          <div className="button"><span></span></div>
                                        </label>
                                      </div>

                                      <div className="col-md-1 ">
                                        <label className="amber">
                                          <input type="radio" name="color" value="orange"></input>
                                          <div className="layer"></div>
                                          <div className="button"><span></span></div>
                                        </label>
                                      </div>
                                      <div className="col-md-1 ">
                                        <label className="lime">
                                          <input type="radio" name="color" value="orange"></input>
                                          <div className="layer"></div>
                                          <div className="button"><span></span></div>
                                        </label>
                                      </div>
                                      <div className="col-md-1 ">
                                        <label className="blue">
                                          <input type="radio" name="color" value="orange"></input>
                                          <div className="layer"></div>
                                          <div className="button"><span></span></div>
                                        </label>
                                      </div>
                                      <div className="col-md-1 ">
                                        <label className="teal">
                                          <input type="radio" name="color" value="orange"></input>
                                          <div className="layer"></div>
                                          <div className="button"><span></span></div>
                                        </label>
                                      </div>
                                      {/* <div className="col-md-1">
                                        <label className="teal">
                                          <input type="radio" name="color" value="orange"></input>
                                          <div className="layer"></div>
                                          <div className="button"><span></span></div>
                                        </label>
                                      </div> */}
                                    </div>
                                  </div>

                                </div>
                              </div>
                              : <div></div>}
                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={this.handleClose}>Close</Button>
                            <Button class-
                              type="submit"
                              onClick={this.addEmployee}
                              bsStyle="primary"
                              onClick={() => this.addToCart()}
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
                            key={index}
                            style={{ padding: "4px", borderRadius: '50%' }}
                            className="ui medium circular image"
                            src={response.urls.regular}
                            height="200px"
                            width="200px"
                            onClick={() => this.handleShow(index)}
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
